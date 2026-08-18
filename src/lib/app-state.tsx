import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
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
  startChat: (userId: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState("");
  const [conversations, setConversations] = useState<Conversations>(seedConversations);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [contactsState, setContactsState] = useState<Contact[]>(seedContacts);

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
      userProfiles,
      selectedProfileId,
      setSelectedProfileId,
      contacts: contactsState,
      startChat: (userId) => {
        setContactsState((prev) => {
          if (prev.some((c) => c.id === userId)) return prev;
          const profile = userProfiles.find((p) => p.id === userId);
          if (!profile) return prev;
          const newContact: Contact = {
            id: profile.id,
            name: profile.name,
            avatar: profile.photo,
            compatibility: profile.compatibility,
            lastMessage: "",
            when: "Just now",
            online: true,
            ...(profile.verified !== undefined ? { verified: profile.verified } : {}),
          };
          return [newContact, ...prev];
        });
      },
    }),
    [location, conversations, selectedProfileId, contactsState],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

