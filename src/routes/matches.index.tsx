import { createFileRoute, Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { BottomNav } from "../components/BottomNav";
import { useAppState } from "../lib/app-state";
import type { ProfileRow } from "@/integrations/supabase/client";
import {
  fetchMatches,
  avatarFor,
  formatRelativeDay,
  mapProfileRowToUserProfile,
  type MatchWithProfile,
} from "../lib/match-api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/matches/")({
  head: () => ({
    meta: [
      { title: "Matches — RoomieMatch" },
      {
        name: "description",
        content: "Mira tus matches mutuos de roomies y sigue la conversación.",
      },
      { property: "og:title", content: "Matches — RoomieMatch" },
      {
        property: "og:description",
        content: "Mira tus matches mutuos de roomies y sigue la conversación.",
      },
    ],
  }),
  component: Matches,
});

function handlePointerMove(event: MouseEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  event.currentTarget.style.setProperty("--mx", `${x}%`);
  event.currentTarget.style.setProperty("--my", `${y}%`);
}

function Matches() {
  const { setSelectedProfileId, addProfiles, activeProfile } = useAppState();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllMatches, setShowAllMatches] = useState(false);

  useEffect(() => {
    if (!activeProfile) {
      setMatches([]);
      setIsLoading(true);
      return;
    }
    let active = true;
    setIsLoading(true);
    void fetchMatches(activeProfile.id)
      .then((data) => {
        if (active) setMatches(data);
      })
      .catch((err) => console.error("Error loading matches:", err))
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeProfile]);

  const openProfile = (profile: ProfileRow) => {
    if (!activeProfile) return;
    const mapped = mapProfileRowToUserProfile(profile, activeProfile);
    addProfiles([mapped]);
    setSelectedProfileId(mapped.id);
    setShowAllMatches(false);
  };

  const newMatches = matches.filter((m) => !m.lastMessage);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-[90px]">
      <TopAppBar />
      <main className="flex-grow w-full max-w-[1140px] mx-auto">
        <section className="mt-stack-sm mb-stack-md">
          <div className="px-container-margin mb-stack-sm flex justify-between items-center">
            <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Nuevos Matches Mutuos
            </h2>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar px-container-margin gap-4 pb-4">
            {newMatches.map(({ match, profile }) => (
              <button
                key={match.id}
                onClick={() => openProfile(profile)}
                className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group border-0 bg-transparent text-left outline-none"
              >
                <div className="relative w-[72px] h-[72px]">
                  <img
                    className="w-full h-full rounded-full object-cover border-2 border-brand group-hover:scale-105 transition-transform duration-300"
                    alt={`Foto de perfil de ${profile.name ?? "Roomie"}`}
                    src={avatarFor(profile)}
                  />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface text-center">
                  {profile.name ?? "Roomie"}
                </span>
              </button>
            ))}
            <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0 w-[72px]">
              <button
                onClick={() => setShowAllMatches(true)}
                className="w-[72px] h-[72px] rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center text-brand hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
                Más
              </span>
            </div>
          </div>
        </section>

        <section className="px-container-margin">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-stack-sm">
            Mensajes
          </h2>
          {isLoading ? (
            <p className="font-body-md text-body-md text-on-surface-variant">Cargando matches...</p>
          ) : matches.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">
              Todavía no tienes matches. ¡Sigue explorando en Descubrir!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {matches.map(({ match, profile, lastMessage }) => (
                <Link
                  key={match.id}
                  to="/matches/$contactId"
                  params={{ contactId: match.id }}
                  onMouseMove={handlePointerMove}
                  className="group isolate rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors relative overflow-hidden bg-surface border border-outline-variant/30"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_220px_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_100%)]"
                  />
                  <div
                    className="relative w-14 h-14 flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openProfile(profile);
                    }}
                  >
                    <img
                      className="w-full h-full rounded-full object-cover"
                      alt={`Foto de perfil de ${profile.name ?? "Roomie"}`}
                      src={avatarFor(profile)}
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-label-md text-label-md text-on-surface truncate pr-2 mb-1">
                      {profile.name ?? "Roomie"}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant truncate">
                      {lastMessage?.content ?? "Di hola 👋"}
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm flex-shrink-0 text-on-surface-variant">
                    {formatRelativeDay(lastMessage?.created_at ?? match.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />

      <Dialog open={showAllMatches} onOpenChange={setShowAllMatches}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tus Matches</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {matches.length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant">
                Todavía no tienes matches.
              </p>
            ) : (
              matches.map(({ match, profile }) => (
                <button
                  key={match.id}
                  onClick={() => openProfile(profile)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low transition-colors text-left cursor-pointer"
                >
                  <img
                    src={avatarFor(profile)}
                    alt={`Foto de perfil de ${profile.name ?? "Roomie"}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="font-label-md text-label-md text-on-surface">
                    {profile.name ?? "Roomie"}
                  </span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
