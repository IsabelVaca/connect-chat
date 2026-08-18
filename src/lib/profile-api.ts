import { supabase, type ProfileRow } from "@/integrations/supabase/client";

/**
 * Loads the profile of the signed-in user, or (when there is no session)
 * the first existing row in `profiles` so persistence can be tested.
 */
export async function fetchCurrentProfile(): Promise<ProfileRow | null> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;

  const query = supabase
    .from("profiles")
    .select("id, name, age, city, avatar_url, bio, interests, lifestyle");

  const { data, error } = userId
    ? await query.eq("id", userId).maybeSingle()
    : await query.order("id", { ascending: true }).limit(1).maybeSingle();

  if (error) throw error;
  return (data as ProfileRow | null) ?? null;
}

export async function updateProfile(
  id: string,
  patch: Partial<Omit<ProfileRow, "id">>,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("id, name, age, city, avatar_url, bio, interests, lifestyle")
    .single();

  if (error) throw error;
  return data as ProfileRow;
}
