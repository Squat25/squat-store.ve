"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import CartDebug from "./CartDebug";

export default function HomeClient({ products }) {
  const { data: session } = useSession();

  // Depuración: mostrar los productos y sus imágenes
  console.log("PRODUCTS:", products);

  return (
    <>
      {session?.user && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center">
          ¡Bienvenido, {session.user.name}!
        </div>
      )}
      {/* Hero Section */}
      <div className="relative w-full h-[500px]">
        <Image
          src="/hero-banner.png"
          alt="Hero Banner"
          fill
          style={{ objectFit: "cover" }}
          className="absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 bg-black/30">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
            Bienvenido a Squat
          </h1>
          <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">
            Descubre nuestra última colección de ropa deportiva.
          </p>
          <Link
            href="/collections"
            className="bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
          >
            Comprar Ahora
          </Link>
        </div>
      </div>

      {/* Carrito temporal para pruebas */}
      <CartDebug />

      {/* Productos Destacados */}
      <section className="py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Nuestros Productos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
              >
                {product.images && product.images.url ? (
                  <Image
                    src={product.images.url}
                    alt={product.images.alt || product.name}
                    width={product.images.width || 300}
                    height={product.images.height || 300}
                    className="w-full h-auto rounded-md mb-4 object-cover"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  <div className="w-full h-[300px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-2xl mb-4">
                    No Image Available
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-lg font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No hay productos disponibles. ¡Añade algunos en DATO CMS!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
