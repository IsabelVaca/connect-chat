export function TopAppBar() {
  return (
    <header className="w-full top-0 sticky flex justify-between items-center px-container-margin h-16 bg-surface z-40">
      <div className="w-10 h-10" aria-hidden="true" />
      <h1 className="font-headline-md text-headline-md font-bold text-brand tracking-tight">
        RoomieMatch
      </h1>
      <button className="text-on-surface-variant hover:opacity-80 transition-opacity p-2 -mr-2 rounded-full focus:outline-none focus:ring-2 focus:ring-brand/20">
        <span className="material-symbols-outlined text-2xl">tune</span>
      </button>
    </header>
  );
}
