import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { conversations as seedConversations, type Message } from "./mock-data";

type Conversations = Record<string, Message[]>;

type AppState = {
  location: string;
  setLocation: (value: string) => void;
  conversations: Conversations;
  sendMessage: (contactId: string, text: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState("");
  const [conversations, setConversations] = useState<Conversations>(seedConversations);

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
    }),
    [location, conversations],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
