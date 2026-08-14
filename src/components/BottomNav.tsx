import { Link } from "@tanstack/react-router";

const items = [
  { to: "/", icon: "explore", label: "Discovery" },
  { to: "/matches", icon: "chat_bubble", label: "Matches" },
  { to: "/profile", icon: "person", label: "Profile" },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface shadow-[0_-4px_20px_rgba(169,51,73,0.08)] rounded-t-xl">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.to === "/" }}
          className="flex flex-col items-center justify-center text-on-surface-variant px-5 py-1 rounded-full transition-colors hover:bg-surface-container-high data-[status=active]:bg-primary-container data-[status=active]:text-on-primary-container"
        >
          <span className="material-symbols-outlined mb-1">{item.icon}</span>
          <span className="font-label-sm text-label-sm">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
