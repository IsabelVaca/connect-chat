import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { BottomNav } from "../components/BottomNav";
import { useAppState } from "../lib/app-state";
import { supabase } from "@/integrations/supabase/client";
import { createMatchIfMutual, mapProfileRowToUserProfile } from "../lib/match-api";
import type { UserProfile } from "../lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Discovery — RoomieMatch" },
      {
        name: "description",
        content: "Swipe through compatible roommate profiles near you and find your best match.",
      },
      { property: "og:title", content: "Discovery — RoomieMatch" },
      {
        property: "og:description",
        content: "Swipe through compatible roommate profiles near you and find your best match.",
      },
    ],
  }),
  component: Discovery,
});

function Discovery() {
  const { setSelectedProfileId, addProfiles, activeProfile } = useAppState();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!activeProfile) {
      setIsLoading(true);
      return;
    }

    let active = true;
    const loadDiscovery = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!activeProfile.city) {
          if (active) {
            setCandidates([]);
            setIsLoading(false);
          }
          return;
        }

        // Fetch swipes to exclude already interacted users
        const { data: swipesData, error: swipesError } = await supabase
          .from("swipes")
          .select("to_user_id")
          .eq("from_user_id", activeProfile.id);

        if (swipesError) throw swipesError;
        const swipedUserIds = new Set(swipesData?.map((s) => s.to_user_id) ?? []);

        // Fetch other users in the same city
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, age, city, avatar_url, bio, interests, lifestyle")
          .eq("city", activeProfile.city)
          .neq("id", activeProfile.id);

        if (profilesError) throw profilesError;

        const filtered = (profilesData ?? []).filter((p) => !swipedUserIds.has(p.id));
        const mapped = filtered.map((p) => mapProfileRowToUserProfile(p, activeProfile));

        // Add them to the app state so they can be viewed in DetailedProfileView overlay
        addProfiles(mapped);

        if (active) {
          setCandidates(mapped);
          setDiscoveryIndex(0);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading discovery candidates:", err);
        if (active) {
          setError("Error al cargar candidatos de Supabase.");
          setIsLoading(false);
        }
      }
    };

    void loadDiscovery();

    return () => {
      active = false;
    };
  }, [activeProfile, addProfiles]);

  const handleSwipe = async (action: "like" | "pass") => {
    const candidate = candidates[discoveryIndex];
    if (!candidate || !activeProfile) return;

    // Advance card index smoothly in the UI first
    setDiscoveryIndex((prev) => prev + 1);

    try {
      const { error } = await supabase.from("swipes").insert({
        from_user_id: activeProfile.id,
        to_user_id: candidate.id,
        action,
      });
      if (error) throw error;

      // Check if it's a mutual match! (persists a real row in `matches` if so)
      if (action === "like") {
        const match = await createMatchIfMutual(activeProfile.id, candidate.id);
        if (match) setMatchedProfile(candidate);
      }
    } catch (err) {
      console.error("Error recording swipe:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md">
        <TopAppBar />
        <main className="flex-grow flex flex-col items-center justify-center px-container-margin pb-stack-lg pt-stack-sm">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-brand animate-spin">
              progress_activity
            </span>
            <p className="font-label-md text-label-md text-on-surface-variant">
              Buscando roomies compatibles...
            </p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md">
        <TopAppBar />
        <main className="flex-grow flex flex-col items-center justify-center px-container-margin pb-stack-lg pt-stack-sm text-center">
          <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand text-on-brand rounded-lg font-label-md hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </main>
        <BottomNav />
      </div>
    );
  }

  const hasNoCity = activeProfile && !activeProfile.city;
  const isOutOfCandidates = discoveryIndex >= candidates.length;

  if (hasNoCity) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md">
        <TopAppBar />
        <main className="flex-grow flex flex-col items-center justify-center px-container-margin pb-stack-lg pt-stack-sm text-center max-w-sm mx-auto">
          <div className="w-20 h-20 rounded-full bg-surface-container-low border border-outline-variant/30 flex items-center justify-center text-brand mb-6 shadow-sm">
            <span className="material-symbols-outlined text-4xl">location_city</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
            ¿Dónde te gustaría vivir?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant/80 mb-6">
            Para mostrarte perfiles en tu zona, necesitamos saber en qué ciudad buscas roomie.
          </p>
          <Link
            to="/profile"
            className="w-full bg-brand text-on-brand font-label-lg text-label-lg py-3.5 rounded-xl hover:opacity-95 shadow-[0_8px_25px_rgba(169,51,73,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">edit_square</span>
            Configurar ciudad en mi perfil
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (isOutOfCandidates) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md">
        <TopAppBar />
        <main className="flex-grow flex flex-col items-center justify-center px-container-margin pb-stack-lg pt-stack-sm text-center max-w-sm mx-auto animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-secondary-container/20 border border-outline-variant/20 flex items-center justify-center text-teal mb-6 shadow-sm">
            <span className="material-symbols-outlined text-4xl icon-filled">check_circle</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">¡Todo al día!</h2>
          <p className="font-body-md text-body-md text-on-surface-variant/80 mb-6">
            ¡Has visto todos los perfiles disponibles en{" "}
            <strong className="text-brand">{activeProfile?.city}</strong> por hoy!
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/matches"
              className="w-full bg-brand text-on-brand font-label-lg text-label-lg py-3.5 rounded-xl hover:opacity-95 shadow-[0_8px_25px_rgba(169,51,73,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">forum</span>
              Ver mis Matches
            </Link>
            <Link
              to="/profile"
              className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-label-lg text-label-lg py-3.5 rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">settings</span>
              Cambiar ciudad o presupuesto
            </Link>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const currentUser = candidates[discoveryIndex]!;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md">
      <TopAppBar />
      <main className="flex-grow flex flex-col items-center justify-start px-container-margin pb-stack-lg pt-stack-sm relative">
        <button
          onClick={() => setSelectedProfileId(currentUser.id)}
          aria-label={`View details for ${currentUser.name}`}
          className="relative w-full max-w-sm h-[65vh] max-h-[600px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(169,51,73,0.08)] bg-surface-container-lowest text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-brand/20"
        >
          <div
            className="absolute inset-0 bg-cover bg-center w-full h-full"
            style={{ backgroundImage: `url("${currentUser.photo}")` }}
            role="img"
            aria-label={`Portrait of ${currentUser.name}, ${currentUser.age}`}
          />
          <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-md border border-surface-container-high/50">
            <span className="material-symbols-outlined text-teal text-sm icon-filled">
              favorite
            </span>
            <span className="font-label-md text-label-md text-teal font-bold">
              {currentUser.compatibility}%
            </span>
          </div>
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-20 pb-6 px-5 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-white">
                {currentUser.name}, {currentUser.age}
              </h2>
              {currentUser.verified && (
                <span
                  className="material-symbols-outlined text-secondary-fixed text-xl icon-filled text-teal"
                  title="Verified"
                >
                  verified
                </span>
              )}
            </div>
            <p className="font-body-md text-body-md text-surface-container-lowest/90 mb-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_city</span>{" "}
              {currentUser.location} • ${currentUser.rent.toLocaleString()}/mo
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-secondary-fixed/20 border border-secondary-fixed/30 text-surface-container-lowest font-label-sm text-label-sm backdrop-blur-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  {currentUser.hasRoom ? "home" : "search"}
                </span>{" "}
                {currentUser.hasRoom ? "Room Available" : "Looking for Room"}
              </span>
              {currentUser.lifestyle.slice(0, 2).map((item) => (
                <span
                  key={item.label}
                  className="px-3 py-1.5 rounded-full bg-surface-container/20 border border-surface-container/30 text-surface-container-lowest font-label-sm text-label-sm backdrop-blur-md flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">{item.icon}</span>{" "}
                  {item.value}
                </span>
              ))}
            </div>
          </div>
        </button>
        <div className="flex justify-center items-center gap-8 z-10 pt-stack-sm">
          <button
            onClick={() => handleSwipe("pass")}
            aria-label="Pass"
            className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-[0_10px_20px_rgba(186,26,26,0.15)] flex items-center justify-center text-error hover:scale-105 active:scale-95 transition-all duration-200 border border-error-container/30 focus:outline-none focus:ring-4 focus:ring-error/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl font-bold">close</span>
          </button>
          <button
            onClick={() => handleSwipe("like")}
            aria-label="Like"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-teal to-secondary-fixed-dim shadow-[0_12px_24px_rgba(0,106,97,0.25)] flex items-center justify-center text-on-teal hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl font-bold icon-filled">
              favorite
            </span>
          </button>
        </div>
      </main>
      <div className="h-24" />
      <BottomNav />

      <Dialog open={!!matchedProfile} onOpenChange={(open) => !open && setMatchedProfile(null)}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-center font-headline-lg-mobile text-headline-lg-mobile text-brand">
              ¡Es un Match! 🎉
            </DialogTitle>
          </DialogHeader>
          {matchedProfile && (
            <div className="flex flex-col items-center gap-3 py-2">
              <img
                src={matchedProfile.photo}
                alt={`Foto de ${matchedProfile.name}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-brand shadow-lg"
              />
              <p className="font-body-md text-body-md text-on-surface-variant">
                Tú y <span className="font-semibold text-on-surface">{matchedProfile.name}</span> se
                gustaron mutuamente.
              </p>
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <button
              onClick={() => {
                setMatchedProfile(null);
                navigate({ to: "/matches" });
              }}
              className="w-full bg-brand text-on-brand font-label-lg text-label-lg py-3 rounded-xl hover:opacity-95 shadow-[0_8px_25px_rgba(169,51,73,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined">forum</span>
              Ir a Matches
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
