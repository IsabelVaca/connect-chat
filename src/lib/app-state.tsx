import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, type ProfileRow } from "@/integrations/supabase/client";
import { fetchCurrentProfile, setActiveProfileOverride } from "./profile-api";
import {
  conversations as seedConversations,
  type Message,
  type Contact,
  contacts as seedContacts,
  type UserProfile,
  userProfiles,
} from "./mock-data";

type Conversations = Record<string, Message[]>;

type AppState = {
  location: string;
  setLocation: (value: string) => void;
  conversations: Conversations;
  sendMessage: (contactId: string, text: string) => void;
  userProfiles: UserProfile[];
  selectedProfileId: string | null;
  setSelectedProfileId: (id: string | null) => void;
  contacts: Contact[];
  addProfiles: (profiles: UserProfile[]) => void;
  session: Session | null;
  activeProfile: ProfileRow | null;
  switchProfile: (profile: ProfileRow) => void;
  clearProfileOverride: () => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState("");
  const [conversations, setConversations] = useState<Conversations>(seedConversations);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [contactsState, setContactsState] = useState<Contact[]>(seedContacts);
  const [profilesState, setProfilesState] = useState<UserProfile[]>(userProfiles);
  const [session, setSession] = useState<Session | null>(null);
  const [activeProfile, setActiveProfile] = useState<ProfileRow | null>(null);

  const addProfiles = useCallback((newProfiles: UserProfile[]) => {
    setProfilesState((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      newProfiles.forEach((p) => map.set(p.id, p));
      return Array.from(map.values());
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    void fetchCurrentProfile().then((profile) => {
      if (active) setActiveProfile(profile);
    });
    return () => {
      active = false;
    };
  }, [session]);

  const switchProfile = useCallback((profile: ProfileRow) => {
    setActiveProfileOverride(profile.id);
    setActiveProfile(profile);
  }, []);

  const clearProfileOverride = useCallback(() => {
    setActiveProfileOverride(null);
    void fetchCurrentProfile().then(setActiveProfile);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      location,
      setLocation,
      conversations,
      sendMessage: (contactId, text) =>
        setConversations((prev) => ({
          ...prev,
          [contactId]: [
            ...(prev[contactId] ?? []),
            {
              id: `${contactId}-${Date.now()}`,
              from: "me",
              text,
              time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            },
          ],
        })),
      userProfiles: profilesState,
      selectedProfileId,
      setSelectedProfileId,
      contacts: contactsState,
      addProfiles,
      session,
      activeProfile,
      switchProfile,
      clearProfileOverride,
    }),
    [
      location,
      conversations,
      selectedProfileId,
      contactsState,
      profilesState,
      addProfiles,
      session,
      activeProfile,
      switchProfile,
      clearProfileOverride,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
