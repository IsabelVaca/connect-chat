import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppStateProvider } from "../lib/app-state";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-on-surface">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-on-surface">Página no encontrada</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-on-brand transition-opacity hover:opacity-90"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-on-surface">
          Esta página no cargó
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Algo salió mal de nuestro lado. Puedes intentar recargar o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-on-brand transition-opacity hover:opacity-90"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-outline-variant bg-surface px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RoomieMatch — Encuentra tu roomie ideal" },
      {
        name: "description",
        content:
          "Descubre roomies compatibles, chatea con tus matches y configura tus preferencias de vivienda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { DetailedProfileView } from "../components/DetailedProfileView";
import { useAppState } from "../lib/app-state";
import { fetchCurrentProfile } from "../lib/profile-api";
import { findMatchBetween } from "../lib/match-api";

function RootAppStateOverlay() {
  const { selectedProfileId, setSelectedProfileId, userProfiles } = useAppState();
  const navigate = useNavigate();

  if (!selectedProfileId) return null;

  const profile = userProfiles.find((p) => p.id === selectedProfileId);
  if (!profile) return null;

  return (
    <DetailedProfileView
      profile={profile}
      onClose={() => setSelectedProfileId(null)}
      onMessage={async (id) => {
        setSelectedProfileId(null);
        // The chat route is keyed by match id, so resolve the real match before navigating.
        const current = await fetchCurrentProfile();
        if (!current) return;
        const match = await findMatchBetween(current.id, id);
        if (match) {
          navigate({ to: "/matches/$contactId", params: { contactId: match.id } });
        } else {
          navigate({ to: "/matches" });
        }
      }}
    />
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <RootAppStateOverlay />
      </AppStateProvider>
    </QueryClientProvider>
  );
}
