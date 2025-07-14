"use client";
import { useState, useEffect } from "react";
import { getBestSellers } from "../lib/datocms";

export default function LoMasVendido() {
  const [genero, setGenero] = useState("men"); // men/women
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    let timeout;
    setLoading(true);
    setShowSkeleton(true);
    getBestSellers().then((data) => {
      console.log("Productos traídos de DatoCMS:", data);
      const filtrados = data.filter((p) =>
        p.categories.some((cat) => cat.name.toLowerCase() === genero)
      );
      setProductos(filtrados);
      setLoading(false);
      // Espera 300ms antes de ocultar el skeleton
      timeout = setTimeout(() => setShowSkeleton(false), 300);
    });
    return () => clearTimeout(timeout);
  }, [genero]);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">LO MÁS VENDIDO</h2>
          <p className="text-lg text-gray-600">Nuestros favoritos</p>
        </div>
        <a
          href="/collections/best-sellers"
          className="hidden md:inline-block text-base font-semibold underline underline-offset-4 hover:text-black transition-colors"
        >
          Ver colección
        </a>
      </div>
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button
          className={`pb-2 font-semibold text-lg transition-colors ${
            genero === "men"
              ? "border-b-4 border-black text-black"
              : "text-gray-500"
          }`}
          onClick={() => setGenero("men")}
        >
          Hombre
        </button>
        <button
          className={`pb-2 font-semibold text-lg transition-colors ${
            genero === "women"
              ? "border-b-4 border-black text-black"
              : "text-gray-500"
          }`}
          onClick={() => setGenero("women")}
        >
          Mujer
        </button>
      </div>
      {/* Carrusel/Lista de productos */}
      <div className="overflow-x-auto md:overflow-x-visible">
        {showSkeleton ? (
          <div className="flex md:grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[250px] max-w-xs w-full bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 md:min-w-0 md:max-w-none md:w-auto animate-pulse"
              >
                <div className="w-full h-64 bg-gray-200" />
                <div className="p-4">
                  <div className="h-6 w-2/3 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                  <div className="h-8 w-full bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="min-w-[250px] max-w-xs w-full bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 md:min-w-0 md:max-w-none md:w-auto group hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={producto.images?.url}
                  alt={producto.slug}
                  className="w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">
                    {producto.slug.replace(/-/g, " ")}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {producto.description}
                  </p>
                  <p className="text-black font-bold mb-2">${producto.price}</p>
                  <a
                    href={"/products/" + producto.slug}
                    className="inline-block mt-2 text-sm font-semibold text-black underline underline-offset-2 hover:text-gray-700"
                  >
                    Ver producto
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Botón ver colección en mobile */}
      <a
        href="/collections/best-sellers"
        className="md:hidden block mt-8 text-base font-semibold underline underline-offset-4 text-center hover:text-black transition-colors"
      >
        Ver colección
      </a>
    </section>
  );
}
