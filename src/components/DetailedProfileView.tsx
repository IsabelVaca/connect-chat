import { type UserProfile } from "../lib/mock-data";

interface DetailedProfileViewProps {
  profile: UserProfile;
  onClose: () => void;
  onMessage: (profileId: string) => void;
}

export function DetailedProfileView({ profile, onClose, onMessage }: DetailedProfileViewProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex justify-center items-start md:py-10 px-0 md:px-4">
      {/* Backdrop overlay to close when clicking outside on desktop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest md:rounded-2xl md:shadow-[0_12px_40px_rgba(87,65,67,0.15)] overflow-hidden min-h-screen md:min-h-0 pb-28 md:pb-32 z-10 animate-in fade-in-50 zoom-in-95 duration-200">
        
        {/* Desktop Close/Back Button floating on top-left of the card */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-6 left-6 z-50 items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface hover:bg-surface-container-high transition-colors shadow-md border border-outline-variant/30 cursor-pointer"
          aria-label="Close profile"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Mobile Header with Back Button */}
        <div className="md:hidden sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md px-container-margin h-14 flex items-center justify-between shadow-sm">
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label="Back"
          >
            arrow_back
          </button>
          <span className="font-label-md text-label-md font-semibold">Profile</span>
          <button
            className="material-symbols-outlined text-on-surface p-2 -mr-2 rounded-full hover:bg-surface-container-low transition-colors"
            aria-label="More options"
          >
            more_vert
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-80 md:h-96">
          <img
            className="w-full h-full object-cover"
            alt={`A bright, high-quality portrait of ${profile.name}`}
            src={profile.photo}
          />
          
          {/* Match Percentage Ring */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full p-2 shadow-lg flex items-center justify-center">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full max-w-[80%] max-h-[250px] block mx-auto text-teal" viewBox="0 0 36 36">
                <path
                  className="fill-none stroke-surface-container-highest stroke-[3.8]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="fill-none stroke-[2.8] stroke-current stroke-round"
                  strokeDasharray={`${profile.compatibility}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="font-label-md text-label-md font-bold text-on-surface">{profile.compatibility}%</span>
              </div>
            </div>
          </div>

          {/* Basic Info Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-container-margin bg-gradient-to-t from-on-surface/85 via-on-surface/40 to-transparent text-surface-container-lowest">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white">
                {profile.name}, {profile.age}
              </h1>
              {profile.verified && (
                <span
                  className="material-symbols-outlined text-secondary-fixed-dim icon-filled text-xl"
                  title="Verified User"
                >
                  verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-surface-container-low font-label-md text-label-md">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">location_on</span> {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">payments</span> ${profile.rent}/mo
              </span>
            </div>
          </div>
        </div>

        <div className="p-container-margin md:p-stack-md flex flex-col gap-stack-md">
          {/* Bio */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-base">About Me</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              "{profile.bio}"
            </p>
          </section>

          <hr className="border-surface-variant" />

          {/* Interests Grid */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => {
                const bgClass = idx % 2 === 0 
                  ? "bg-secondary-container/30 text-on-secondary-container" 
                  : "bg-primary-container/30 text-on-primary-container";
                return (
                  <span
                    key={interest}
                    className={`px-4 py-2 rounded-full font-label-md text-label-md ${bgClass}`}
                  >
                    {interest}
                  </span>
                );
              })}
            </div>
          </section>

          <hr className="border-surface-variant" />

          {/* Lifestyle Grid */}
          <section>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Lifestyle Match</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.lifestyle.map((item) => (
                <div
                  key={item.label}
                  className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-tertiary-container">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{item.label}</p>
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item.value}</p>
                    </div>
                  </div>
                  <span
                    className={`font-label-md text-label-md px-2 py-1 rounded ${
                      item.match === "Match"
                        ? "text-teal bg-secondary-container/20"
                        : "text-outline bg-surface-container-highest"
                    }`}
                  >
                    {item.match}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Apartment Section (if photos are available) */}
          {profile.apartmentPhotos && profile.apartmentPhotos.length > 0 && (
            <>
              <hr className="border-surface-variant" />
              <section>
                <div className="flex items-center justify-between mb-stack-sm">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Current Apartment</h2>
                  {profile.hasRoom && (
                    <span className="text-brand font-label-md text-label-md font-semibold">
                      Has a room available
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                  <img
                    className="w-full h-32 md:h-48 object-cover rounded-l-xl"
                    alt={`${profile.name}'s living room`}
                    src={profile.apartmentPhotos[0]}
                  />
                  {profile.apartmentPhotos.length > 1 && (
                    <div className="grid grid-rows-2 gap-2">
                      <img
                        className="w-full h-[60px] md:h-[92px] object-cover rounded-tr-xl"
                        alt={`${profile.name}'s kitchen`}
                        src={profile.apartmentPhotos[1]}
                      />
                      {profile.apartmentPhotos.length > 2 ? (
                        <img
                          className="w-full h-[60px] md:h-[92px] object-cover rounded-br-xl"
                          alt={`${profile.name}'s bedroom`}
                          src={profile.apartmentPhotos[2]}
                        />
                      ) : (
                        <div className="bg-surface-container-low rounded-br-xl" />
                      )}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Fixed Action Button at Bottom of Modal */}
        <div className="absolute bottom-0 left-0 w-full p-container-margin bg-surface-container-lowest border-t border-surface-variant flex justify-center z-40">
          <button
            onClick={() => onMessage(profile.id)}
            className="w-full md:w-auto md:min-w-[300px] h-12 rounded-full bg-gradient-to-r from-brand to-primary-container text-on-brand font-label-md text-label-md shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined">chat</span>
            Message {profile.name}
          </button>
        </div>

      </div>
    </div>
  );
}
