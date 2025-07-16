"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { request } from "../lib/datocms";
import { getBestSellers } from "../lib/datocms";

const ALL_PRODUCTS_QUERY = `
  query AllProducts {
    allProducts {
      id
      name
      slug
      price
      description
      images {
        url
        alt
        width
        height
      }
      categories {
        name
      }
    }
  }
`;

export default function ProductosRelacionados({ categoria, actualSlug }) {
  const [relacionados, setRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelacionados() {
      setLoading(true);
      // 1. Traer todos los productos
      const data = await request({ query: ALL_PRODUCTS_QUERY });
      let productos = data?.allProducts || [];
      // 2. Filtrar por categoría (excluyendo el producto actual)
      let mismos = productos.filter(
        (p) =>
          p.slug !== actualSlug &&
          p.categories?.some(
            (cat) => cat.name.toLowerCase() === categoria?.toLowerCase()
          )
      );
      // 3. Si hay menos de 4, rellenar con destacados (sin repetir)
      if (mismos.length < 4) {
        const destacados = (await getBestSellers()).filter(
          (p) => p.slug !== actualSlug && !mismos.some((m) => m.slug === p.slug)
        );
        mismos = [...mismos, ...destacados.slice(0, 4 - mismos.length)];
      }
      setRelacionados(mismos.slice(0, 4));
      setLoading(false);
    }
    fetchRelacionados();
  }, [categoria, actualSlug]);

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          También te puede interesar
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[220px] h-80 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }
  if (!relacionados.length) return null;

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        También te puede interesar
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
        {relacionados.map((producto) => (
          <Link
            key={producto.id}
            href={`/products/${producto.slug}`}
            className="min-w-[220px] max-w-xs w-full bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 group hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              {producto.images?.url ? (
                <Image
                  src={producto.images.url}
                  alt={
                    producto.images.alt || producto.name || "Imagen de producto"
                  }
                  width={220}
                  height={192}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-gray-400">Sin imagen</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 text-gray-900 truncate">
                {producto.name}
              </h3>
              <p className="text-gray-500 text-sm mb-2 truncate">
                {producto.description}
              </p>
              <p className="text-black font-bold mb-2">${producto.price}</p>
              <span className="inline-block mt-2 text-xs font-semibold text-slate-600 underline underline-offset-2">
                Ver producto
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
