import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { avatarFor } from "../lib/match-api";
import { fetchAllProfiles } from "../lib/profile-api";
import { useAppState } from "../lib/app-state";
import type { ProfileRow } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function UserSwitcher() {
  const { session, activeProfile, switchProfile, clearProfileOverride } = useAppState();
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    void fetchAllProfiles().then((data) => {
      if (active) setProfiles(data);
    });
    return () => {
      active = false;
    };
  }, [open]);

  const initial = activeProfile?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Cambiar de perfil"
        className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container-low flex items-center justify-center text-on-surface-variant font-label-md text-label-md hover:opacity-80 transition-opacity"
      >
        {activeProfile?.avatar_url ? (
          <img
            src={avatarFor(activeProfile)}
            alt={`Avatar de ${activeProfile.name ?? "Roomie"}`}
            className="w-full h-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar de perfil</DialogTitle>
          </DialogHeader>
          <p className="text-label-sm text-on-surface-variant -mt-2">
            Herramienta de prueba: cambia qué perfil usa la app localmente, sin afectar tu sesión
            real de Supabase.
          </p>
          <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => {
                  switchProfile(profile);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                  activeProfile?.id === profile.id
                    ? "bg-primary-container/10 border border-brand/30"
                    : "hover:bg-surface-container-low"
                }`}
              >
                <img
                  src={avatarFor(profile)}
                  alt={`Avatar de ${profile.name ?? "Roomie"}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-label-md text-label-md text-on-surface">
                  {profile.name ?? "Roomie"}
                </span>
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-outline-variant">
            {session ? (
              <button
                onClick={() => {
                  clearProfileOverride();
                  setOpen(false);
                }}
                className="w-full text-center py-2 font-label-md text-label-md text-brand hover:opacity-80 transition-opacity cursor-pointer"
              >
                Usar mi sesión real
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-2 font-label-md text-label-md text-brand hover:opacity-80 transition-opacity"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
