"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    image: "/slide1.png",
    headline: "Entrena sin límites",
    subtext:
      "Descubre la nueva colección de alto rendimiento para atletas como tú.",
    cta: "Explorar colección",
    href: "/collections",
  },
  {
    image: "/slide2.png",
    headline: "Para todos los cuerpos, para todas las metas",
    subtext: "Ropa deportiva que se adapta a ti. Envíos a toda Venezuela.",
    cta: "Ver novedades",
    href: "/collections",
  },
  {
    image: "/slide3.png",
    headline: "Tecnología y estilo",
    subtext:
      "Materiales premium, diseños exclusivos. Siente la diferencia Squat.",
    cta: "Comprar ahora",
    href: "/sales",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    setAnim(true);
    const timer = setInterval(() => {
      setAnim(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % length);
        setAnim(true);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, [length]);

  const goTo = (idx) => {
    setAnim(false);
    setTimeout(() => {
      setCurrent(idx);
      setAnim(true);
    }, 200);
  };
  const prev = () => goTo((current - 1 + length) % length);
  const next = () => goTo((current + 1) % length);

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] md:h-[540px] overflow-hidden rounded-b-2xl shadow-lg">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className={`w-full h-full object-cover object-center scale-105 transition-transform duration-700 ${
              anim && idx === current ? "scale-110" : "scale-105"
            }`}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 flex flex-col justify-center items-center text-white text-center px-3 sm:px-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-2 sm:mb-4 drop-shadow-xl animate-fade-in">
              {slide.headline}
            </h1>
            <p className="text-base sm:text-2xl md:text-3xl mb-4 sm:mb-8 max-w-2xl drop-shadow-lg animate-fade-in delay-100">
              {slide.subtext}
            </p>
            <Link
              href={slide.href}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-2 sm:px-10 sm:py-3 rounded-full text-lg sm:text-xl font-bold shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 animate-fade-in delay-200"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}
      {/* Flechas navegación */}
      <button onClick={prev} className="hidden" aria-label="Anterior">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={next} className="hidden" aria-label="Siguiente">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* Dots */}
      <div className="hidden">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className=""
            aria-label={`Ir a slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
