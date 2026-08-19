import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { BottomNav } from "../components/BottomNav";
import { useAppState } from "../lib/app-state";
import { supabase, type ProfileRow, type Lifestyle } from "@/integrations/supabase/client";
import { fetchCurrentProfile } from "@/lib/profile-api";
import type { UserProfile, LifestyleItem } from "../lib/mock-data";

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

function mapProfileRowToUserProfile(
  profile: ProfileRow,
  currentUserProfile: ProfileRow,
): UserProfile {
  const lifestyleItems: LifestyleItem[] = [];
  const candidateLifestyle = profile.lifestyle ?? {};
  const currentLifestyle = currentUserProfile.lifestyle ?? {};

  if (candidateLifestyle.sleepSchedule) {
    lifestyleItems.push({
      label: "Sleep Schedule",
      value: candidateLifestyle.sleepSchedule,
      match: candidateLifestyle.sleepSchedule === currentLifestyle.sleepSchedule ? "Match" : "Okay",
      icon: "bedtime",
    });
  }
  if (candidateLifestyle.cleanliness) {
    lifestyleItems.push({
      label: "Cleanliness",
      value: candidateLifestyle.cleanliness,
      match: candidateLifestyle.cleanliness === currentLifestyle.cleanliness ? "Match" : "Okay",
      icon: "cleaning_services",
    });
  }
  if (candidateLifestyle.socialLevel) {
    lifestyleItems.push({
      label: "Social Level",
      value: candidateLifestyle.socialLevel,
      match: candidateLifestyle.socialLevel === currentLifestyle.socialLevel ? "Match" : "Okay",
      icon: "groups",
    });
  }
  if (candidateLifestyle.guests) {
    lifestyleItems.push({
      label: "Guests",
      value: candidateLifestyle.guests,
      match: candidateLifestyle.guests === currentLifestyle.guests ? "Match" : "Okay",
      icon: "door_open",
    });
  }

  // Calculate compatibility score
  let matchesCount = 0;
  let totalFields = 0;
  const fields: (keyof Lifestyle)[] = ["sleepSchedule", "cleanliness", "socialLevel", "guests"];
  fields.forEach((f) => {
    if (candidateLifestyle[f] && currentLifestyle[f]) {
      totalFields++;
      if (candidateLifestyle[f] === currentLifestyle[f]) {
        matchesCount++;
      }
    }
  });

  const compatibility =
    totalFields > 0
      ? Math.round(75 + (matchesCount / totalFields) * 25)
      : Math.floor(Math.random() * 15) + 80;

  return {
    id: profile.id,
    name: profile.name ?? "Roomie",
    age: profile.age ?? 25,
    location: profile.city ?? "Nearby",
    rent: candidateLifestyle.budget ?? 1200,
    compatibility,
    photo: profile.avatar_url ?? `https://i.pravatar.cc/600?u=${profile.id}`,
    bio: profile.bio ?? "No bio yet.",
    interests: profile.interests ?? [],
    lifestyle: lifestyleItems,
    apartmentPhotos: [],
    hasRoom: true,
    verified: true,
  };
}

function Discovery() {
  const { setSelectedProfileId, startChat, addProfiles } = useAppState();
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<ProfileRow | null>(null);
  const [discoveryIndex, setDiscoveryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadDiscovery = async () => {
      try {
        setIsLoading(true);
        const currProfile = await fetchCurrentProfile();
        if (!active) return;
        if (!currProfile) {
          setError("No se pudo cargar el perfil del usuario.");
          setIsLoading(false);
          return;
        }
        setCurrentUserProfile(currProfile);

        if (!currProfile.city) {
          setCandidates([]);
          setIsLoading(false);
          return;
        }

        // Fetch swipes to exclude already interacted users
        const { data: swipesData, error: swipesError } = await supabase
          .from("swipes")
          .select("to_user_id")
          .eq("from_user_id", currProfile.id);

        if (swipesError) throw swipesError;
        const swipedUserIds = new Set(swipesData?.map((s) => s.to_user_id) ?? []);

        // Fetch other users in the same city
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, age, city, avatar_url, bio, interests, lifestyle")
          .eq("city", currProfile.city)
          .neq("id", currProfile.id);

        if (profilesError) throw profilesError;

        const filtered = (profilesData ?? []).filter((p) => !swipedUserIds.has(p.id));
        const mapped = filtered.map((p) => mapProfileRowToUserProfile(p, currProfile));

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
  }, [addProfiles]);

  const handleSwipe = async (action: "like" | "pass") => {
    const candidate = candidates[discoveryIndex];
    if (!candidate || !currentUserProfile) return;

    // Advance card index smoothly in the UI first
    setDiscoveryIndex((prev) => prev + 1);

    try {
      const { error } = await supabase.from("swipes").insert({
        from_user_id: currentUserProfile.id,
        to_user_id: candidate.id,
        action,
      });
      if (error) throw error;

      // Check if it's a mutual match!
      if (action === "like") {
        const { data: mutualSwipe, error: matchError } = await supabase
          .from("swipes")
          .select("id")
          .eq("from_user_id", candidate.id)
          .eq("to_user_id", currentUserProfile.id)
          .eq("action", "like")
          .maybeSingle();

        if (matchError) console.error("Error checking mutual swipe:", matchError);

        if (mutualSwipe) {
          // Add them to chat contacts in app state
          startChat(candidate.id);
        }
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

  const hasNoCity = currentUserProfile && !currentUserProfile.city;
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
            <strong className="text-brand">{currentUserProfile?.city}</strong> por hoy!
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
    </div>
  );
}
