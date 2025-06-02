"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.url || "",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-lg p-6 md:p-12">
        {/* Sección de Imágenes */}
        <div className="md:w-1/2 flex flex-col items-center">
          {product.images && product.images.url ? (
            <Image
              src={product.images.url}
              alt={product.images.alt || product.name}
              width={500}
              height={500}
              className="w-full h-auto rounded-lg shadow-md object-cover mb-4"
              priority
            />
          ) : (
            <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-2xl mb-4">
              No Image Available
            </div>
          )}
        </div>

        {/* Sección de Detalles */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            {product.name}
          </h1>
          <p className="text-3xl text-gray-800 font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>

          {/* Opciones de Talla */}
          <div className="mb-4">
            <label
              htmlFor="size"
              className="block text-gray-700 font-medium mb-1"
            >
              Talla
            </label>
            <select
              id="size"
              name="size"
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          {/* Opciones de Color */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full bg-black border border-gray-300 cursor-pointer"
                title="Negro"
              ></div>
              <div
                className="w-6 h-6 rounded-full bg-white border border-gray-300 cursor-pointer"
                title="Blanco"
              ></div>
              <div
                className="w-6 h-6 rounded-full bg-blue-700 border border-gray-300 cursor-pointer"
                title="Azul"
              ></div>
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Botón Añadir al Carrito */}
          <button
            className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold mt-8 hover:bg-gray-700 transition-colors duration-300 w-full md:w-auto"
            onClick={handleAddToCart}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>

      <Link
        href="/"
        className="block text-center mt-12 text-blue-600 hover:underline text-lg font-semibold"
      >
        &larr; Volver a todos los productos
      </Link>
    </main>
  );
}
