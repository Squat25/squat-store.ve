"use client";
import { useState } from "react";
import Image from "next/image";

export default function NewsletterSquat() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Por favor ingresa un email válido.");
      return;
    }
    setSuccess(true);
    setEmail("");
    // TODO: Aquí puedes conectar con tu backend o servicio de newsletter
  };

  return (
    <section className="py-8 px-2 sm:py-10 sm:px-4 max-w-6xl mx-auto">
      <div className="bg-black rounded-[28px] p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-8 shadow-xl">
        <div className="flex-1 mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2 uppercase tracking-tight leading-tight">
            RECIBE OFERTAS Y NOVEDADES SQUAT
          </h2>
          <p className="text-gray-200 text-base sm:text-lg font-medium">
            ¡Suscríbete y entrena con nosotros!
          </p>
        </div>
        <form
          className="flex flex-col w-full max-w-md mx-auto md:mx-0 gap-3 md:gap-4"
          onSubmit={handleSubmit}
        >
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Image src="/correo.svg" alt="Correo" width={22} height={22} />
            </span>
            <input
              type="email"
              placeholder="Ingresa tu email"
              className="pl-12 pr-4 py-3 rounded-full text-base w-full bg-white text-black placeholder:text-gray-500 border-none outline-none focus:ring-2 focus:ring-black transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ boxShadow: "none" }}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-full text-base transition-colors shadow-sm hover:bg-gray-100 border-none"
          >
            Suscribirme
          </button>
        </form>
      </div>
      {success && (
        <div className="text-green-600 text-center mt-4 font-semibold">
          ¡Gracias por suscribirte a Squat! 💪
        </div>
      )}
      {error && (
        <div className="text-red-500 text-center mt-4 font-semibold">
          {error}
        </div>
      )}
    </section>
  );
}
