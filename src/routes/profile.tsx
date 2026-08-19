import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopAppBar } from "../components/TopAppBar";
import { BottomNav } from "../components/BottomNav";
import { fetchCurrentProfile, updateProfile } from "@/lib/profile-api";

import type * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

function Profile() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(1500);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [sleepSchedule, setSleepSchedule] = useState<string>("");
  const [cleanliness, setCleanliness] = useState<string>("");
  const [socialLevel, setSocialLevel] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");

  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const interestsList = [
    "Coffee",
    "Hiking",
    "Gaming",
    "Yoga",
    "Plants",
    "Music",
    "Cooking",
    "Gym",
    "Movies",
    "Travel",
  ];

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const leaflet = (await import("leaflet")).default;
      if (cancelled || !mapContainerRef.current || mapRef.current) return;
      leafletRef.current = leaflet;
      mapRef.current = leaflet.map(mapContainerRef.current).setView([40.7128, -74.006], 13);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        })
        .addTo(mapRef.current);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const profile = await fetchCurrentProfile();
        if (cancelled) return;
        if (!profile) {
          setSaveStatus("No hay perfiles en la tabla todavía");
          return;
        }

        setProfileId(profile.id);
        setFullName(profile.name ?? "");
        setAge(profile.age !== null && profile.age !== undefined ? String(profile.age) : "");
        setProfileImage(profile.avatar_url ?? "");
        setBio(profile.bio ?? "");
        setSelectedInterests(profile.interests ?? []);
        if (profile.city) {
          setSearchQuery(profile.city);
          setSelectedLocation({ name: profile.city, lat: 0, lon: 0 });
        }
        const lifestyle = profile.lifestyle ?? {};
        setSleepSchedule(lifestyle.sleepSchedule ?? "");
        setCleanliness(lifestyle.cleanliness ?? "");
        setSocialLevel(lifestyle.socialLevel ?? "");
        setGuests(lifestyle.guests ?? "");
        if (typeof lifestyle.budget === "number") setBudget(lifestyle.budget);
      } catch (error) {
        console.error("Error loading profile:", error);
        if (!cancelled) setSaveStatus("No se pudo cargar el perfil");
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (!profileId) {
      setSaveStatus("No hay perfil disponible para guardar");
      return;
    }
    setIsSaving(true);
    setSaveStatus("");
    try {
      await updateProfile(profileId, {
        name: fullName || null,
        age: age ? Number(age) : null,
        city: selectedLocation?.name ?? searchQuery ?? null,
        avatar_url: profileImage || null,
        bio: bio || null,
        interests: selectedInterests,
        lifestyle: { sleepSchedule, cleanliness, socialLevel, guests, budget },
      });
      setSaveStatus("Cambios guardados");
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("No se pudieron guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      );
      const data = await response.json();

      if (data.length === 0) return;

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      setSelectedLocation({ name: result.display_name, lat, lon });

      if (mapRef.current && leafletRef.current) {
        mapRef.current.setView([lat, lon], 13);
        markerRef.current?.remove();
        markerRef.current = leafletRef.current.marker([lat, lon]).addTo(mapRef.current);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void searchLocation(searchQuery);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <TopAppBar />
      <main className="flex-grow px-container-margin py-stack-md flex flex-col gap-stack-lg max-w-[600px] mx-auto w-full pb-72">
        {/* Location Section */}
        <section className="flex flex-col gap-stack-md">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            Where to?
          </h2>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search for a city or location..."
              aria-label="Search for a city or location"
              className="flex-1 px-4 py-2.5 rounded-lg border border-surface-container-high bg-surface-container-lowest text-on-surface placeholder-on-surface/50 font-body-md focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              disabled={isSearching}
              aria-label="Search location"
              className="px-4 py-2.5 rounded-lg bg-brand text-on-brand font-label-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </form>
          <div
            ref={mapContainerRef}
            className="w-full h-80 rounded-2xl shadow-md overflow-hidden border border-surface-container-high"
          />
          {selectedLocation && (
            <div className="p-4 rounded-lg bg-surface-container-lowest border border-surface-container-high shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-brand text-[20px]">
                  location_on
                </span>
                <p className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Selected Location
                </p>
              </div>
              <p className="text-body-sm text-on-surface/70 line-clamp-2">
                {selectedLocation.name}
              </p>
              <p className="text-label-sm text-on-surface/50 mt-2">
                Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
              </p>
            </div>
          )}
        </section>

        {/* Bio Section */}
        <section className="bg-surface-container-lowest rounded-[24px] p-stack-md shadow-[0_8px_30px_rgba(169,51,73,0.06)] flex flex-col gap-stack-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            About Me
          </h3>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            maxLength={500}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-body-md text-on-surface placeholder-on-surface-variant/50 font-body-md focus:outline-none focus:ring-2 focus:ring-brand resize-none"
            rows={5}
          />
          <p className="text-label-sm text-on-surface-variant/70">{bio.length}/500</p>
        </section>

        {/* Interests Section */}
        <section className="bg-surface-container-lowest rounded-[24px] p-stack-md shadow-[0_8px_30px_rgba(169,51,73,0.06)] flex flex-col gap-stack-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {interestsList.map((interest) => (
              <button
                key={interest}
                onClick={() => {
                  setSelectedInterests((prev) =>
                    prev.includes(interest)
                      ? prev.filter((i) => i !== interest)
                      : [...prev, interest],
                  );
                }}
                className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all ${
                  selectedInterests.includes(interest)
                    ? "bg-brand text-on-brand shadow-md"
                    : "bg-surface-container-high text-on-surface border border-outline-variant hover:bg-surface-container-highest"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </section>

        {/* Lifestyle Match Section */}
        <section className="bg-surface-container-lowest rounded-[24px] p-stack-md shadow-[0_8px_30px_rgba(169,51,73,0.06)] flex flex-col gap-stack-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Lifestyle Match
          </h3>

          {/* Sleep Schedule */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors">
              <span className="font-label-lg text-label-lg text-on-surface">Sleep Schedule</span>
              <span className="material-symbols-outlined">expand_more</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              {["Early Bird", "Night Owl"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSleepSchedule(option)}
                  className={`w-full px-4 py-3 rounded-lg font-body-md transition-all ${
                    sleepSchedule === option
                      ? "bg-brand text-on-brand"
                      : "bg-surface-container-highest text-on-surface border border-outline-variant hover:bg-surface-container-high"
                  }`}
                >
                  {option}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Cleanliness */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors">
              <span className="font-label-lg text-label-lg text-on-surface">Cleanliness</span>
              <span className="material-symbols-outlined">expand_more</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              {["Strictly clean", "Tidy", "Relaxed"].map((option) => (
                <button
                  key={option}
                  onClick={() => setCleanliness(option)}
                  className={`w-full px-4 py-3 rounded-lg font-body-md transition-all ${
                    cleanliness === option
                      ? "bg-brand text-on-brand"
                      : "bg-surface-container-highest text-on-surface border border-outline-variant hover:bg-surface-container-high"
                  }`}
                >
                  {option}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Social Level */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors">
              <span className="font-label-lg text-label-lg text-on-surface">Social Level</span>
              <span className="material-symbols-outlined">expand_more</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              {["Introvert", "Values Quiet", "Party Host"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSocialLevel(option)}
                  className={`w-full px-4 py-3 rounded-lg font-body-md transition-all ${
                    socialLevel === option
                      ? "bg-brand text-on-brand"
                      : "bg-surface-container-highest text-on-surface border border-outline-variant hover:bg-surface-container-high"
                  }`}
                >
                  {option}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Guests */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors">
              <span className="font-label-lg text-label-lg text-on-surface">Guests</span>
              <span className="material-symbols-outlined">expand_more</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              {["No guests", "Occasional", "Weekends mostly"].map((option) => (
                <button
                  key={option}
                  onClick={() => setGuests(option)}
                  className={`w-full px-4 py-3 rounded-lg font-body-md transition-all ${
                    guests === option
                      ? "bg-brand text-on-brand"
                      : "bg-surface-container-highest text-on-surface border border-outline-variant hover:bg-surface-container-high"
                  }`}
                >
                  {option}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
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
            <span className="font-headline-md text-headline-md text-brand">${budget}</span>
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

        <section className="bg-surface-container-lowest rounded-[24px] p-stack-md shadow-[0_8px_30px_rgba(169,51,73,0.06)] flex flex-col gap-stack-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Personal Information
          </h3>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface">Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your name and last name"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-4 px-4 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface">Age</span>
            <input
              type="number"
              min={18}
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="Your age"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-4 px-4 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface">Profile Image</span>
            {!profileImage && (
              <span className="text-body-sm italic text-on-surface-variant">
                Sin archivos adjuntos.
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setProfileImage(URL.createObjectURL(file));
              }}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 py-3 text-body-md text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined">attach_file</span>
              Adjuntar archivo
            </button>
            {profileImage && (
              <img
                src={profileImage}
                alt="Profile preview"
                className="h-24 w-24 rounded-full object-cover"
              />
            )}
          </label>
        </section>
      </main>

      <div className="fixed bottom-[88px] left-0 w-full bg-surface/90 backdrop-blur-md border-t border-surface-container p-container-margin z-40">
        <div className="max-w-[600px] mx-auto flex flex-col gap-2">
          {saveStatus && (
            <p className="text-label-sm text-on-surface-variant text-center">{saveStatus}</p>
          )}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving || isLoadingProfile}
            className="w-full border border-brand text-brand font-label-lg text-label-lg py-3 rounded-xl hover:bg-primary-container/10 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">save</span>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="w-full bg-gradient-to-r from-brand to-[#c2425a] text-on-brand font-headline-md text-[20px] font-semibold py-4 rounded-xl shadow-[0_8px_25px_rgba(169,51,73,0.3)] hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            Find Roomies
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
