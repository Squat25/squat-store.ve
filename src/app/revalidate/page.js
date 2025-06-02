"use client";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

const ADMIN_EMAIL = "squat.ve@gmail.com";

export default function RevalidatePage() {
  const { data: session, status } = useSession();
  const [path, setPath] = useState("");
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Puedes poner aquí tu secret por defecto para no tener que escribirlo siempre
  // const DEFAULT_SECRET = "loquesea-super-secreto";

  const handleRevalidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, secret }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-2">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
          <Image
            src="/LogoNegro.png"
            alt="Squat Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold mb-6 text-center">
            Solo administradores
          </h1>
          <p className="mb-4 text-gray-600 text-center">
            Debes iniciar sesión con tu cuenta de Google para acceder a esta
            página.
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/revalidate" })}
            className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    );
  }

  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-2">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
          <Image
            src="/LogoNegro.png"
            alt="Squat Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold mb-6 text-center">No autorizado</h1>
          <p className="mb-4 text-gray-600 text-center">
            Esta página solo está disponible para el administrador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/LogoNegro.png"
            alt="Squat Logo"
            width={80}
            height={80}
            className="mb-2"
          />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Revalidar caché ISR
        </h1>
        <form onSubmit={handleRevalidate} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ruta a revalidar (ej: /, /collections, /products/slug)"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Secreto de revalidación"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Revalidando..." : "Revalidar"}
          </button>
        </form>
        {result && (
          <div className="mt-6 text-center">
            {result.revalidated ? (
              <span className="text-green-600 font-semibold">
                ¡Revalidación exitosa! ({result.now})
              </span>
            ) : result.error ? (
              <span className="text-red-500 font-semibold">
                Error: {result.error}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
