import { createFileRoute, Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { BottomNav } from "../components/BottomNav";
import { mutualMatches } from "../lib/mock-data";
import { useAppState } from "../lib/app-state";

export const Route = createFileRoute("/matches/")({
  head: () => ({
    meta: [
      { title: "Matches — RoomieMatch" },
      {
        name: "description",
        content: "See your mutual roommate matches and keep the conversation going.",
      },
      { property: "og:title", content: "Matches — RoomieMatch" },
      {
        property: "og:description",
        content: "See your mutual roommate matches and keep the conversation going.",
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
  const { conversations, contacts, setSelectedProfileId } = useAppState();

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pb-[90px]">
      <TopAppBar />
      <main className="flex-grow w-full max-w-[1140px] mx-auto">
        <section className="mt-stack-sm mb-stack-md">
          <div className="px-container-margin mb-stack-sm flex justify-between items-center">
            <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              New Mutual Matches
            </h2>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar px-container-margin gap-4 pb-4">
            {mutualMatches.map((match) => (
              <button
                key={match.id}
                onClick={() => setSelectedProfileId(match.id)}
                className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group border-0 bg-transparent text-left outline-none"
              >
                <div className="relative w-[72px] h-[72px]">
                  <img
                    className={`w-full h-full rounded-full object-cover border-2 transition-transform duration-300 ${
                      match.isNew
                        ? "border-brand group-hover:scale-105"
                        : "border-outline-variant group-hover:border-brand"
                    }`}
                    alt={`${match.name}'s profile`}
                    src={match.avatar}
                  />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface text-center">
                  {match.name}
                </span>
              </button>
            ))}
            <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0 w-[72px]">
              <button className="w-[72px] h-[72px] rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center text-brand hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
                More
              </span>
            </div>
          </div>
        </section>

        <section className="px-container-margin">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-stack-sm">
            Messages
          </h2>
          <div className="flex flex-col gap-3">
            {contacts.map((contact) => {
              const thread = conversations[contact.id] ?? [];
              const last = thread[thread.length - 1];
              const preview = last ? last.text : contact.lastMessage;
              const unread = Boolean(contact.unread);

              return (
                <Link
                  key={contact.id}
                  to="/matches/$contactId"
                  params={{ contactId: contact.id }}
                  onMouseMove={handlePointerMove}
                  className={`group isolate rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors relative overflow-hidden ${
                    unread
                      ? "bg-surface-container-lowest shadow-[0_8px_24px_rgba(169,51,73,0.06)]"
                      : "bg-surface border border-outline-variant/30"
                  }`}
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
                      setSelectedProfileId(contact.id);
                    }}
                  >
                    <img
                      className={`w-full h-full rounded-full object-cover ${unread ? "" : "opacity-90"}`}
                      alt={`${contact.name}'s profile`}
                      src={contact.avatar}
                    />
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal rounded-full border-2 border-surface-container-lowest" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-label-md text-label-md text-on-surface truncate pr-2 flex items-center gap-1 mb-1">
                      {contact.name}
                      {contact.verified && (
                        <span className="material-symbols-outlined text-teal text-[14px] icon-filled">
                          verified_user
                        </span>
                      )}
                    </h3>
                    <p
                      className={`font-body-md text-body-md truncate ${
                        unread ? "text-on-surface font-medium" : "text-on-surface-variant"
                      }`}
                    >
                      {preview}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${
                        unread
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {contact.compatibility}%
                    </span>
                    <span
                      className={`font-label-sm text-label-sm flex-shrink-0 ${
                        unread ? "text-brand" : "text-on-surface-variant"
                      }`}
                    >
                      {contact.when}
                    </span>
                    {contact.unread ? (
                      <div className="w-5 h-5 bg-brand text-on-brand rounded-full flex items-center justify-center font-label-sm text-[10px]">
                        {contact.unread}
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
