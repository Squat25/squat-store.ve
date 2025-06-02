"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  // Login manual conectado a API
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      setSuccess("¡Login exitoso! (Simulado, no hay sesión persistente)");
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  // Registro manual conectado a API
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setError("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Tabs */}
        <div className="flex mb-8 border-b">
          <button
            className={`flex-1 py-2 text-lg font-semibold transition-colors duration-200 border-b-2 ${
              tab === "login"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => {
              setTab("login");
              setError("");
              setSuccess("");
            }}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2 text-lg font-semibold transition-colors duration-200 border-b-2 ${
              tab === "register"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => {
              setTab("register");
              setError("");
              setSuccess("");
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Google Sign-In */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md shadow transition-colors duration-200 mb-4"
        >
          <svg width="24" height="24" viewBox="0 0 48 48">
            <g>
              <path
                fill="#4285F4"
                d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.1 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5.1-.7.1-1.3.1-2 0-1.3-.1-2.6-.3-3.8z"
              />
              <path
                fill="#34A853"
                d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.1 5.1 29.3 3 24 3c-7.2 0-13.4 3.1-17.7 8z"
              />
              <path
                fill="#FBBC05"
                d="M24 45c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2C29.2 36.7 26.7 37.5 24 37.5c-5.7 0-10.6-3.7-12.3-8.8l-7 5.4C7.1 41.1 14.9 45 24 45z"
              />
              <path
                fill="#EA4335"
                d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.5 43.9 19.4 47 24 47c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2C29.2 36.7 26.7 37.5 24 37.5c-5.7 0-10.6-3.7-12.3-8.8l-7 5.4C7.1 41.1 14.9 45 24 45z"
              />
            </g>
          </svg>
          Continuar con Google
        </button>

        {/* Separador visual */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-4 text-gray-400">o</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Formulario de Login */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black w-full pr-12"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                onClick={() => setShowLoginPassword((v) => !v)}
                tabIndex={-1}
                aria-label={
                  showLoginPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showLoginPassword ? (
                  <HiOutlineEyeOff className="w-6 h-6" />
                ) : (
                  <HiOutlineEye className="w-6 h-6" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && (
              <p className="text-green-600 text-center mt-2">{success}</p>
            )}
          </form>
        )}

        {/* Formulario de Registro */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre completo"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black w-full pr-12"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                onClick={() => setShowRegisterPassword((v) => !v)}
                tabIndex={-1}
                aria-label={
                  showRegisterPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showRegisterPassword ? (
                  <HiOutlineEyeOff className="w-6 h-6" />
                ) : (
                  <HiOutlineEye className="w-6 h-6" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Registrarse"}
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && (
              <p className="text-green-600 text-center mt-2">{success}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
