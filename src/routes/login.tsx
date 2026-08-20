import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { signInWithUsernamePassword } from "@/lib/profile-api";
import { useAppState } from "../lib/app-state";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — RoomieMatch" }, { name: "robots", content: "noindex" }],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { switchProfile } = useAppState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const profile = await signInWithUsernamePassword(username, password);
      switchProfile(profile);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface px-container-margin">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-[24px] p-stack-md shadow-[0_8px_30px_rgba(169,51,73,0.06)] flex flex-col gap-stack-sm">
        <h1 className="font-headline-md text-headline-md font-bold text-brand tracking-tight text-center mb-2">
          RoomieMatch
        </h1>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center">
          Iniciar sesión
        </h2>
        <p className="text-label-sm text-on-surface-variant text-center -mt-1">
          Herramienta de prueba: valida usuario/contraseña contra los perfiles demo.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-stack-sm mt-2">
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface">Usuario</span>
            <input
              type="text"
              required
              autoCapitalize="none"
              autoCorrect="off"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="isabel"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface">Contraseña</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-3 px-4 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            />
          </label>

          {error && <p className="text-label-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand text-on-brand font-label-lg text-label-lg py-3 rounded-xl hover:opacity-95 disabled:opacity-50 shadow-[0_8px_25px_rgba(169,51,73,0.2)] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isSubmitting ? "Un momento..." : "Iniciar sesión"}
          </button>
        </form>

        <Link
          to="/"
          className="text-center font-label-sm text-label-sm text-on-surface-variant hover:opacity-80 transition-opacity"
        >
          Volver a Discovery
        </Link>
      </div>
    </div>
  );
}
