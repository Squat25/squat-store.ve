"use client";

import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaTrash } from "react-icons/fa"; // Asegúrate de haber instalado react-icons

const CartPage = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Tu Carrito de Compras
      </h1>

      {cart.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow-xl mt-8">
          <p className="text-xl text-gray-700 mb-6">
            Tu carrito está vacío. ¡Empieza a comprar!
          </p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
          >
            Ir de Compras
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Productos en el Carrito */}
          <div className="flex-grow bg-white p-8 rounded-lg shadow-xl">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-gray-200 last:border-b-0"
              >
                {/* Sección de Producto (Imagen, Nombre, Precio Unitario) */}
                <div className="flex items-center flex-1 mb-4 sm:mb-0 min-w-[200px]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg mr-6 object-cover shadow-sm"
                  />
                  <div className="flex flex-col">
                    <Link
                      href={`/products/${item.id}`}
                      className="font-semibold text-xl text-gray-800 hover:text-black transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 text-md mt-1">
                      ${item.price.toFixed(2)} / unidad
                    </p>
                  </div>
                </div>

                {/* Controles de Cantidad */}
                <div className="flex items-center justify-center mx-4 my-4 sm:my-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-l-lg text-lg font-bold transition-colors duration-200 border border-gray-200"
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <span className="w-16 text-center border-t border-b border-gray-200 py-2 text-lg font-medium text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-r-lg text-lg font-bold transition-colors duration-200 border border-gray-200"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal y Eliminar */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
                  <p className="font-bold text-xl text-gray-800 mb-2 sm:mb-0 sm:mr-6">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-2xl cursor-pointer transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                    aria-label="Eliminar producto"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
                aria-label="Continuar Comprando"
              >
                Continuar Comprando
              </button>
            </div>
          </div>

          {/* Resumen del Carrito */}
          <div className="lg:w-80 bg-white p-8 rounded-lg shadow-xl h-fit sticky top-28">
            {" "}
            {/* sticky para que se quede visible al scrollear */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Resumen del Pedido
            </h2>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <p className="text-lg text-gray-700">Subtotal de productos:</p>
              <p className="font-semibold text-lg text-gray-800">
                ${cartTotal.toFixed(2)}
              </p>
            </div>
            {/* Puedes añadir más líneas aquí para envío, impuestos, descuentos */}
            <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
              <p className="text-xl font-bold text-gray-800">Total:</p>
              <p className="font-bold text-xl text-gray-800">
                ${cartTotal.toFixed(2)}
              </p>
            </div>
            <Link
              href="/checkout"
              className="w-full text-center bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-700 transition-colors duration-300 block"
            >
              Proceder al Pago
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-center mt-4 text-red-500 hover:text-red-700 font-semibold py-2 transition-colors duration-300"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
