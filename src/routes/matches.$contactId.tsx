import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { contacts } from "../lib/mock-data";
import { useAppState } from "../lib/app-state";

export const Route = createFileRoute("/matches/$contactId")({
  loader: ({ params }) => {
    const contact = contacts.find((c) => c.id === params.contactId);
    if (!contact) throw notFound();
    return { contact };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Conversation — RoomieMatch" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `Chat with ${loaderData.contact.name} — RoomieMatch`;
    const description = `Your conversation with ${loaderData.contact.name} on RoomieMatch.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Conversation,
});

function Conversation() {
  const { contact } = Route.useLoaderData();
  const { conversations, sendMessage } = useAppState();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const messages = conversations[contact.id] ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    sendMessage(contact.id, text);
    setDraft("");
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md px-container-margin h-16 flex items-center gap-3 shadow-sm">
        <Link
          to="/matches"
          aria-label="Back to matches"
          className="material-symbols-outlined text-on-surface p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors"
        >
          arrow_back
        </Link>
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={contact.avatar}
          alt={`${contact.name}'s profile`}
        />
        <div className="min-w-0">
          <h1 className="font-label-md text-label-md text-on-surface truncate flex items-center gap-1">
            {contact.name}
            {contact.verified && (
              <span className="material-symbols-outlined text-teal text-[14px] icon-filled">
                verified_user
              </span>
            )}
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {contact.compatibility}% Compatible
          </p>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-container-margin py-stack-md pb-32 flex flex-col gap-3">
        {messages.map((message) => {
          const mine = message.from === "me";
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-xl shadow-[0_4px_16px_rgba(169,51,73,0.05)] ${
                  mine
                    ? "bg-brand text-on-brand rounded-br-sm"
                    : "bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-bl-sm"
                }`}
              >
                <p className="font-body-md text-body-md whitespace-pre-wrap break-words">
                  {message.text}
                </p>
                <span
                  className={`block mt-1 font-label-sm text-label-sm ${
                    mine ? "text-on-brand/70 text-right" : "text-on-surface-variant"
                  }`}
                >
                  {message.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </main>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-surface-container p-container-margin pb-[calc(16px+env(safe-area-inset-bottom))] z-50"
      >
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Write a message"
            placeholder={`Message ${contact.name}...`}
            className="flex-grow bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-r from-brand to-primary-container text-on-brand shadow-[0_8px_25px_rgba(169,51,73,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined icon-filled">send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
