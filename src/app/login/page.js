"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Link from "next/link";

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

  // Login manual usando NextAuth
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });
      if (res?.error) throw new Error(res.error);
      setSuccess("¡Login exitoso!");
      setError("");
      // Redirigir al home
      router.replace("/");
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
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
        <div className="w-full flex mb-6">
          <button
            className={`flex-1 py-2 font-semibold border-b-2 transition-colors duration-200 ${
              tab === "login"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => setTab("login")}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2 font-semibold border-b-2 transition-colors duration-200 ${
              tab === "register"
                ? "border-black text-black"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => setTab("register")}
          >
            Registrarse
          </button>
        </div>
        {tab === "login" && (
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition-colors duration-200 mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={24}
                height={24}
              >
                <g>
                  <path
                    fill="#4285F4"
                    d="M43.611 20.083H42V20H24v8h11.303C33.972 32.082 29.372 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.81.857 6.646 2.278l6.435-6.435C33.047 6.534 28.761 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
                  />
                  <path
                    fill="#34A853"
                    d="M6.306 14.691l6.571 4.819C14.655 16.163 19.001 13 24 13c2.507 0 4.81.857 6.646 2.278l6.435-6.435C33.047 6.534 28.761 5 24 5c-6.065 0-11 4.935-11 11 0 1.306.252 2.554.706 3.691z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 44c5.346 0 9.822-1.824 13.09-4.956l-6.047-4.946C29.372 35 24 35 24 35c-5.372 0-9.972-2.918-11.303-7.083l-6.571 4.819C8.978 41.466 16.954 44 24 44z"
                  />
                  <path
                    fill="#EA4335"
                    d="M43.611 20.083H42V20H24v8h11.303C33.972 32.082 29.372 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.81.857 6.646 2.278l6.435-6.435C33.047 6.534 28.761 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
                  />
                </g>
              </svg>
              Continuar con Google
            </button>
            <input
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black w-full"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowLoginPassword((v) => !v)}
                tabIndex={-1}
              >
                {showLoginPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
            <div className="flex justify-end mt-1">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
          </form>
        )}
        {tab === "register" && (
          <form
            onSubmit={handleRegister}
            className="w-full flex flex-col gap-4"
          >
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition-colors duration-200 mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width={24}
                height={24}
              >
                <g>
                  <path
                    fill="#4285F4"
                    d="M43.611 20.083H42V20H24v8h11.303C33.972 32.082 29.372 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.81.857 6.646 2.278l6.435-6.435C33.047 6.534 28.761 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
                  />
                  <path
                    fill="#34A853"
                    d="M6.306 14.691l6.571 4.819C14.655 16.163 19.001 13 24 13c2.507 0 4.81.857 6.646 2.278l6.435-6.435C33.047 6.534 28.761 5 24 5c-6.065 0-11 4.935-11 11 0 1.306.252 2.554.706 3.691z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 44c5.346 0 9.822-1.824 13.09-4.956l-6.047-4.946C29.372 35 24 35 24 35c-5.372 0-9.972-2.918-11.303-7.083l-6.571 4.819C8.978 41.466 16.954 44 24 44z"
                  />
                  <path
                    fill="#EA4335"
                    d="M43.611 20.083H42V20H24v8h11.303C33.972 32.082 29.372 35 24 35c-6.065 0-11-4.935-11-11s4.935-11 11-11c2.507 0 4.81.857 6.646 2.278l6.435-6.435C33.047 6.534 28.761 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"
                  />
                </g>
              </svg>
              Continuar con Google
            </button>
            <input
              type="text"
              placeholder="Nombre"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black w-full"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowRegisterPassword((v) => !v)}
                tabIndex={-1}
              >
                {showRegisterPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
          </form>
        )}
      </div>
    </div>
  );
}
