import { supabase, type ProfileRow } from "@/integrations/supabase/client";

const PROFILE_COLUMNS = "id, name, age, city, avatar_url, bio, interests, lifestyle";

const ACTIVE_PROFILE_OVERRIDE_KEY = "roomie:active-profile-override";

/**
 * Dev-only "act as this profile" override used by UserSwitcher. Stored under
 * its own localStorage key, separate from Supabase's own session storage, so
 * switching never touches the real signed-in session.
 */
export function getActiveProfileOverride(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_PROFILE_OVERRIDE_KEY);
}

export function setActiveProfileOverride(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) {
    window.localStorage.setItem(ACTIVE_PROFILE_OVERRIDE_KEY, id);
  } else {
    window.localStorage.removeItem(ACTIVE_PROFILE_OVERRIDE_KEY);
  }
}

/**
 * Loads the profile of the signed-in user, or (when there is no session)
 * the first existing row in `profiles` so persistence can be tested.
 * A UserSwitcher override, when set, takes priority over both.
 */
export async function fetchCurrentProfile(): Promise<ProfileRow | null> {
  const overrideId = getActiveProfileOverride();
  if (overrideId) {
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", overrideId)
      .maybeSingle();
    if (error) throw error;
    if (data) return data as ProfileRow;
  }

  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;

  const query = supabase.from("profiles").select(PROFILE_COLUMNS);

  const { data, error } = userId
    ? await query.eq("id", userId).maybeSingle()
    : await query.order("id", { ascending: true }).limit(1).maybeSingle();

  if (error) throw error;
  return (data as ProfileRow | null) ?? null;
}

export async function fetchAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProfileRow[];
}

export async function updateProfile(
  id: string,
  patch: Partial<Omit<ProfileRow, "id">>,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select(PROFILE_COLUMNS)
    .single();

  if (error) throw error;
  return data as ProfileRow;
}
