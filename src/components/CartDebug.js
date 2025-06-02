"use client";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartDebug() {
  const { cart, cartTotal, clearCart } = useContext(CartContext);

  return (
    <div className="border p-4 my-8 mx-auto max-w-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">
        Contenido del Carrito (Solo para Pruebas)
      </h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul className="mb-4">
          {cart.map((item) => (
            <li
              key={item.id}
              className="mb-2 flex justify-between items-center"
            >
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>
                ${item.price.toFixed(2)} c/u | Subtotal: $
                {(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="font-bold text-xl mt-4">
        Total del Carrito: ${cartTotal.toFixed(2)}
      </div>
      <button
        onClick={clearCart}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
      >
        Vaciar Carrito
      </button>
    </div>
  );
}
