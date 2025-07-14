import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showToken, setShowToken] = useState(false); // Solo para pruebas

  // Si hay token en la URL, ir directo al paso 2 y rellenar el campo
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
      setStep(2);
    }
  }, [searchParams]);

  // Paso 1: Solicitar recuperación
  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setShowToken(false);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
      setMessage(data.message);
      if (data.resetToken) {
        setToken(data.resetToken);
        setShowToken(true);
      }
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Restablecer contraseña
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
      setMessage(data.message);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirigir automáticamente después de éxito
  useEffect(() => {
    if (step === 3) {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [step, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Recuperar contraseña
        </h1>
        {step === 1 && (
          <form onSubmit={handleRequest} className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="Tu email"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Solicitar recuperación"}
            </button>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleReset} className="w-full flex flex-col gap-4">
            <label className="text-sm text-gray-700">
              Revisa tu correo. Ingresa el token y tu nueva contraseña:
            </label>
            <input
              type="text"
              placeholder="Token de recuperación"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Restableciendo..." : "Restablecer contraseña"}
            </button>
            {/* Mostrar siempre el token si existe */}
            {token && (
              <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2 mt-2 break-all w-full text-center">
                <b>Token de prueba:</b> {token}
              </div>
            )}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}
          </form>
        )}
        {step === 3 && (
          <div className="text-green-700 text-center flex flex-col items-center gap-4">
            <b>¡Contraseña restablecida exitosamente!</b>
            <span>Serás redirigido al inicio de sesión en unos segundos.</span>
            <button
              className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors duration-200"
              onClick={() => router.push("/login")}
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}
        {/* Mostrar el token debajo del formulario si existe y no está en el paso 2 */}
        {step !== 2 && token && (
          <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2 mt-4 break-all w-full text-center">
            <b>Token de prueba:</b> {token}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
