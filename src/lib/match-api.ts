import { supabase, type ProfileRow, type Lifestyle } from "@/integrations/supabase/client";
import type { UserProfile, LifestyleItem } from "./mock-data";

export type MatchRow = {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string | null;
};

export type MessageRow = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string | null;
};

export type MatchWithProfile = {
  match: MatchRow;
  profile: ProfileRow;
  lastMessage: MessageRow | null;
};

const PROFILE_COLUMNS = "id, name, age, city, avatar_url, bio, interests, lifestyle";

export function avatarFor(profile: Pick<ProfileRow, "id" | "avatar_url">) {
  return profile.avatar_url ?? `https://i.pravatar.cc/600?u=${profile.id}`;
}

export function otherUserId(match: MatchRow, currentUserId: string) {
  return match.user1_id === currentUserId ? match.user2_id : match.user1_id;
}

/** Maps a raw Supabase profile row into the richer UserProfile shape used by Discovery/DetailedProfileView. */
export function mapProfileRowToUserProfile(
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
    photo: avatarFor(profile),
    bio: profile.bio ?? "No bio yet.",
    interests: profile.interests ?? [],
    lifestyle: lifestyleItems,
    apartmentPhotos: [],
    hasRoom: true,
    verified: true,
  };
}

/** Returns the existing match between two users, if any. */
export async function findMatchBetween(a: string, b: string): Promise<MatchRow | null> {
  const { data, error } = await supabase
    .from("matches")
    .select("id, user1_id, user2_id, created_at")
    .or(`and(user1_id.eq.${a},user2_id.eq.${b}),and(user1_id.eq.${b},user2_id.eq.${a})`)
    .maybeSingle();
  if (error) throw error;
  return (data as MatchRow | null) ?? null;
}

/** Returns a single match by its id. */
export async function fetchMatchById(matchId: string): Promise<MatchRow | null> {
  const { data, error } = await supabase
    .from("matches")
    .select("id, user1_id, user2_id, created_at")
    .eq("id", matchId)
    .maybeSingle();
  if (error) throw error;
  return (data as MatchRow | null) ?? null;
}

/**
 * Checks whether the other user already liked us. If so, creates (or reuses)
 * the match row and returns it. Returns null when the like is not reciprocal.
 */
export async function createMatchIfMutual(
  currentUserId: string,
  otherId: string,
): Promise<MatchRow | null> {
  const { data: mutual, error: swipeError } = await supabase
    .from("swipes")
    .select("id")
    .eq("from_user_id", otherId)
    .eq("to_user_id", currentUserId)
    .eq("action", "like")
    .maybeSingle();
  if (swipeError) throw swipeError;
  if (!mutual) return null;

  const existing = await findMatchBetween(currentUserId, otherId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("matches")
    .insert({ user1_id: currentUserId, user2_id: otherId })
    .select("id, user1_id, user2_id, created_at")
    .single();
  if (error) throw error;
  return data as MatchRow;
}

export async function fetchMatches(currentUserId: string): Promise<MatchWithProfile[]> {
  const { data: matchRows, error } = await supabase
    .from("matches")
    .select("id, user1_id, user2_id, created_at")
    .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const matches = (matchRows ?? []) as MatchRow[];
  if (matches.length === 0) return [];

  const otherIds = matches.map((m) => otherUserId(m, currentUserId));
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .in("id", otherIds);
  if (profilesError) throw profilesError;

  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .select("id, match_id, sender_id, content, created_at")
    .in(
      "match_id",
      matches.map((m) => m.id),
    )
    .order("created_at", { ascending: true });
  if (messagesError) throw messagesError;

  const profileById = new Map((profilesData as ProfileRow[] | null)?.map((p) => [p.id, p]) ?? []);
  const lastByMatch = new Map<string, MessageRow>();
  ((messagesData ?? []) as MessageRow[]).forEach((m) => lastByMatch.set(m.match_id, m));

  return matches.flatMap((match) => {
    const profile = profileById.get(otherUserId(match, currentUserId));
    if (!profile) return [];
    return [{ match, profile, lastMessage: lastByMatch.get(match.id) ?? null }];
  });
}

export async function fetchProfileById(id: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ProfileRow | null) ?? null;
}

export async function fetchMessages(matchId: string): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, match_id, sender_id, content, created_at")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MessageRow[];
}

export async function sendMessageToMatch(
  matchId: string,
  senderId: string,
  content: string,
): Promise<MessageRow> {
  const { data, error } = await supabase
    .from("messages")
    .insert({ match_id: matchId, sender_id: senderId, content })
    .select("id, match_id, sender_id, content, created_at")
    .single();
  if (error) throw error;
  return data as MessageRow;
}

/** Realtime subscription to new messages of a conversation. */
export function subscribeToMatchMessages(matchId: string, onInsert: (message: MessageRow) => void) {
  const channel = supabase
    .channel(`messages:${matchId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
      (payload) => onInsert(payload.new as MessageRow),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function unmatch(matchId: string): Promise<void> {
  const { error: messagesError } = await supabase.from("messages").delete().eq("match_id", matchId);
  if (messagesError) throw messagesError;
  const { error } = await supabase.from("matches").delete().eq("id", matchId);
  if (error) throw error;
}

export function formatMessageTime(createdAt: string | null) {
  const date = createdAt ? new Date(createdAt) : new Date();
  // Explicit locale keeps SSR and client output identical (avoids a hydration mismatch).
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatRelativeDay(createdAt: string | null) {
  if (!createdAt) return "Nuevo";
  const date = new Date(createdAt);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return "Hoy";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Ayer";
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
