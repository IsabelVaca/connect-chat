import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { BottomNav } from "../components/BottomNav";
import { useAppState } from "../lib/app-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Preferences — RoomieMatch" },
      {
        name: "description",
        content: "Set your location, budget and move-in date so we can find your ideal roomies.",
      },
      { property: "og:title", content: "Profile & Preferences — RoomieMatch" },
      {
        property: "og:description",
        content: "Set your location, budget and move-in date so we can find your ideal roomies.",
      },
    ],
  }),
  component: Profile,
});

const suggestions = ["San Francisco, CA", "Oakland, CA", "Berkeley, CA"];

function Profile() {
  const { location, setLocation } = useAppState();
  const [budget, setBudget] = useState(1500);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <TopAppBar />
      <main className="flex-grow px-container-margin py-stack-md flex flex-col gap-stack-lg max-w-[600px] mx-auto w-full pb-56">
        <section className="flex flex-col gap-base">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            Where to?
          </h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              aria-label="Location"
              placeholder="City, neighborhood, or zip code"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-4 pl-12 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors shadow-sm"
            />
          </div>
          <div className="flex gap-gutter overflow-x-auto pb-2 mt-2 snap-x hide-scrollbar">
            {suggestions.map((suggestion) => {
              const active = location === suggestion;
              return (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setLocation(suggestion)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-label-md transition-colors snap-start border ${
                    active
                      ? "bg-primary-container/10 text-brand border-brand/20 hover:bg-primary-container/20"
                      : "bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {suggestion}
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-stack-md shadow-[0_8px_30px_rgba(169,51,73,0.06)] flex flex-col gap-stack-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Current Situation
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="cursor-pointer relative">
              <input defaultChecked className="peer sr-only" name="situation" type="radio" />
              <div className="h-full border-2 border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-2 peer-checked:border-brand peer-checked:bg-primary-container/5 transition-all">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                  group_add
                </span>
                <span className="font-label-md text-label-md text-center text-on-surface">
                  Looking for a place together
                </span>
              </div>
            </label>
            <label className="cursor-pointer relative">
              <input className="peer sr-only" name="situation" type="radio" />
              <div className="h-full border-2 border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-2 peer-checked:border-brand peer-checked:bg-primary-container/5 transition-all">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                  home
                </span>
                <span className="font-label-md text-label-md text-center text-on-surface">
                  I already have a place
                </span>
              </div>
            </label>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-stack-md shadow-[0_8px_30px_rgba(169,51,73,0.06)] flex flex-col gap-stack-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Monthly Budget
            </h3>
            <span className="font-headline-md text-headline-md text-brand">
              ${budget.toLocaleString()}
            </span>
          </div>
          <div className="pt-4 pb-2">
            <input
              type="range"
              min={500}
              max={4000}
              step={50}
              value={budget}
              aria-label="Monthly budget"
              onChange={(event) => setBudget(Number(event.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-full appearance-none slider-thumb outline-none"
            />
          </div>
          <div className="flex justify-between text-label-sm text-on-surface-variant">
            <span>$500</span>
            <span>$4,000+</span>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-[24px] p-stack-md shadow-[0_8px_30px_rgba(169,51,73,0.06)] flex flex-col gap-stack-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Move-in Date
          </h3>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              calendar_month
            </span>
            <input
              type="date"
              aria-label="Move-in date"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-4 pl-12 pr-4 text-body-md text-on-surface focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-brand focus:ring-brand w-5 h-5 border-outline-variant bg-surface-container-lowest"
              />
              <span className="font-label-md text-label-md text-on-surface-variant">
                I'm flexible with dates (+/- 2 weeks)
              </span>
            </label>
          </div>
        </section>
      </main>

      <div className="fixed bottom-[88px] left-0 w-full bg-surface/90 backdrop-blur-md border-t border-surface-container p-container-margin z-40">
        <div className="max-w-[600px] mx-auto">
          <button className="w-full bg-gradient-to-r from-brand to-[#c2425a] text-on-brand font-headline-md text-[20px] font-semibold py-4 rounded-xl shadow-[0_8px_25px_rgba(169,51,73,0.3)] hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2">
            Find Roomies
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
