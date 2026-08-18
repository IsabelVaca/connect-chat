import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { BottomNav } from "../components/BottomNav";
import { useAppState } from "../lib/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Discovery — RoomieMatch" },
      {
        name: "description",
        content: "Swipe through compatible roommate profiles near you and find your best match.",
      },
      { property: "og:title", content: "Discovery — RoomieMatch" },
      {
        property: "og:description",
        content: "Swipe through compatible roommate profiles near you and find your best match.",
      },
    ],
  }),
  component: Discovery,
});

function Discovery() {
  const { userProfiles, setSelectedProfileId } = useAppState();
  const [discoveryIndex, setDiscoveryIndex] = useState(0);

  // We cycle specifically through the 3 main users: Alex, David, Sarah
  const discoveryUsers = userProfiles.slice(0, 3);
  const currentUser = discoveryUsers[discoveryIndex];

  const cycleProfile = () => {
    setDiscoveryIndex((prev) => (prev + 1) % discoveryUsers.length);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md">
      <TopAppBar />
      <main className="flex-grow flex flex-col items-center justify-start px-container-margin pb-stack-lg pt-stack-sm relative">
        <button
          onClick={() => setSelectedProfileId(currentUser.id)}
          aria-label={`View details for ${currentUser.name}`}
          className="relative w-full max-w-sm h-[65vh] max-h-[600px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(169,51,73,0.08)] bg-surface-container-lowest text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-brand/20"
        >
          <div
            className="absolute inset-0 bg-cover bg-center w-full h-full"
            style={{ backgroundImage: `url("${currentUser.photo}")` }}
            role="img"
            aria-label={`Portrait of ${currentUser.name}, ${currentUser.age}`}
          />
          <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-md border border-surface-container-high/50">
            <span className="material-symbols-outlined text-teal text-sm icon-filled">favorite</span>
            <span className="font-label-md text-label-md text-teal font-bold">
              {currentUser.compatibility}%
            </span>
          </div>
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-20 pb-6 px-5 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-white">
                {currentUser.name}, {currentUser.age}
              </h2>
              {currentUser.verified && (
                <span
                  className="material-symbols-outlined text-secondary-fixed text-xl icon-filled text-teal"
                  title="Verified"
                >
                  verified
                </span>
              )}
            </div>
            <p className="font-body-md text-body-md text-surface-container-lowest/90 mb-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_city</span> {currentUser.location} •
              ${currentUser.rent.toLocaleString()}/mo
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-secondary-fixed/20 border border-secondary-fixed/30 text-surface-container-lowest font-label-sm text-label-sm backdrop-blur-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  {currentUser.hasRoom ? "home" : "search"}
                </span>{" "}
                {currentUser.hasRoom ? "Room Available" : "Looking for Room"}
              </span>
              {currentUser.lifestyle.slice(0, 2).map((item) => (
                <span
                  key={item.label}
                  className="px-3 py-1.5 rounded-full bg-surface-container/20 border border-surface-container/30 text-surface-container-lowest font-label-sm text-label-sm backdrop-blur-md flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">{item.icon}</span>{" "}
                  {item.value}
                </span>
              ))}
            </div>
          </div>
        </button>
        <div className="flex justify-center items-center gap-8 z-10 pt-stack-sm">
          <button
            onClick={cycleProfile}
            aria-label="Pass"
            className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-[0_10px_20px_rgba(186,26,26,0.15)] flex items-center justify-center text-error hover:scale-105 active:scale-95 transition-all duration-200 border border-error-container/30 focus:outline-none focus:ring-4 focus:ring-error/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl font-bold">close</span>
          </button>
          <button
            onClick={cycleProfile}
            aria-label="Like"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-teal to-secondary-fixed-dim shadow-[0_12px_24px_rgba(0,106,97,0.25)] flex items-center justify-center text-on-teal hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl font-bold icon-filled">favorite</span>
          </button>
        </div>
      </main>
      <div className="h-24" />
      <BottomNav />
    </div>
  );
}

