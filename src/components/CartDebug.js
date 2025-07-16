"use client";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartDebug() {
  const {
    cart,
    cartTotal,
    cartItemsCount,
    clearCart,
    isInCart,
    getCartItemQuantity,
  } = useContext(CartContext);

  return (
    <div className="border p-4 my-8 mx-auto max-w-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">
        Debug del Carrito (Solo para Desarrollo)
      </h2>
      <div className="mb-4">
        <p>
          <strong>Total de productos únicos:</strong> {cart.length}
        </p>
        <p>
          <strong>Total de items:</strong> {cartItemsCount}
        </p>
        <p>
          <strong>Total del carrito:</strong> ${cartTotal.toFixed(2)}
        </p>
      </div>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul className="mb-4">
          {cart.map((item) => (
            <li
              key={`${item.id}-${item.size}-${item.color}`}
              className="mb-2 flex justify-between items-center border-b pb-2"
            >
              <div>
                <span className="font-semibold">{item.name}</span>
                <br />
                <span className="text-sm text-gray-600">
                  {item.size} | {item.color} | x{item.quantity}
                </span>
              </div>
              <span>
                ${item.price.toFixed(2)} c/u | Subtotal: $
                {(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="font-bold text-xl mt-4 mb-4">
        Total del Carrito: ${cartTotal.toFixed(2)}
      </div>
      <div className="flex gap-2">
        <button
          onClick={clearCart}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
        >
          Vaciar Carrito
        </button>
        <button
          onClick={() => {
            console.log("Estado del carrito:", cart);
            console.log("Funciones del carrito:", {
              isInCart,
              getCartItemQuantity,
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
        >
          Log al Console
        </button>
      </div>
    </div>
  );
}
