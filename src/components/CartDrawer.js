"use client";
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    cart,
    drawerOpen,
    setDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartItemsCount,
  } = useContext(CartContext);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        drawerOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ background: drawerOpen ? "rgba(0,0,0,0.3)" : "transparent" }}
      aria-hidden={!drawerOpen}
      onClick={() => setDrawerOpen(false)}
    >
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fijo */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-bold">Tu Carrito</h2>
          <button
            className="text-gray-500 hover:text-black text-2xl"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar carrito"
          >
            &times;
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-12 p-4">
              <div className="text-4xl mb-4">🛒</div>
              <p className="text-lg font-semibold mb-2">
                Tu carrito está vacío
              </p>
              <p className="text-sm">
                ¡Agrega algunos productos para comenzar!
              </p>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4 text-sm text-gray-600">
                {cartItemsCount}{" "}
                {cartItemsCount === 1 ? "producto" : "productos"} en el carrito
              </div>
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={70}
                      height={70}
                      className="rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} c/u
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <span>
                          Talla:{" "}
                          <span className="font-semibold">{item.size}</span>
                        </span>
                        <span>|</span>
                        <span>Color: </span>
                        <span
                          className="inline-block w-4 h-4 rounded-full border ml-1 align-middle"
                          style={{
                            background: item.color,
                            borderColor: "#ccc",
                          }}
                          title={item.color}
                        ></span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                        <button
                          className="ml-4 text-red-500 hover:underline text-xs"
                          onClick={() =>
                            removeFromCart(item.id, item.size, item.color)
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer fijo */}
        <div className="p-4 border-t flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Total:</span>
            <span className="font-bold text-xl">${cartTotal.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition-colors duration-200 mb-2"
            onClick={() => setDrawerOpen(false)}
          >
            Ir a Checkout
          </Link>
          <Link
            href="/cart"
            className="block w-full text-center bg-gray-200 text-black py-3 rounded font-semibold hover:bg-gray-300 transition-colors duration-200"
            onClick={() => setDrawerOpen(false)}
          >
            Ver carrito
          </Link>
        </div>
      </aside>
    </div>
  );
}
