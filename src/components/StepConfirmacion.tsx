"use client";

import React, { useEffect, useContext, useState } from "react";
import { useCheckout } from "../context/CheckoutContext";
import { CartContext } from "../context/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "./Toast";

interface StepConfirmacionProps {
  onBack: () => void;
  datosPago: any; // Recibe los datos de pago reales
}

const StepConfirmacion: React.FC<StepConfirmacionProps> = ({
  onBack,
  datosPago,
}) => {
  const { datosEntrega } = useCheckout();
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const [cartSnapshot, setCartSnapshot] = useState([]); // Copia local del carrito
  const [cartTotalSnapshot, setCartTotalSnapshot] = useState(0);
  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    localStorage.removeItem("checkout_datosEntrega");
  }, []);

  const handleConfirmar = async () => {
    if (loading) return; // Evita doble envío
    if (cart.length === 0) {
      setError("No puedes confirmar un pedido con el carrito vacío.");
      toastError("No puedes confirmar un pedido con el carrito vacío.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);
    setCartSnapshot(cart); // Guardar copia antes de vaciar
    setCartTotalSnapshot(cartTotal);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datosEntrega,
          carrito: cart,
          pago: datosPago,
          email: session?.user?.email || null,
        }),
      });
      if (!res.ok) throw new Error("No se pudo guardar el pedido");
      setSuccess(true);
      clearCart();
      toastSuccess("¡Pedido enviado correctamente!");
    } catch (err) {
      setError(err.message || "Error al guardar el pedido");
      toastError(err.message || "Error al guardar el pedido");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar comprobante si existe
  const comprobanteUrl = datosPago?.comprobante;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Confirmación del Pedido</h2>
      {/* Mostrar comprobante si existe */}
      {comprobanteUrl && (
        <div className="mb-4 p-3 bg-green-50 rounded">
          <span className="font-bold">Comprobante de pago subido: </span>
          <a
            href={comprobanteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline break-all"
          >
            Ver comprobante
          </a>
        </div>
      )}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-bold">Datos de Entrega:</h3>
        <p>
          Nombre: {datosEntrega?.nombre} {datosEntrega?.apellido}
        </p>
        <p>Cédula/RIF: {datosEntrega?.cedula}</p>
        <p>Teléfono: {datosEntrega?.telefono}</p>
        <p>
          Método:{" "}
          {datosEntrega?.metodo === "domicilio"
            ? "Delivery a domicilio"
            : "Envío a agencia"}
        </p>
        {datosEntrega?.metodo === "domicilio" ? (
          <>
            <p>Dirección: {datosEntrega?.direccion}</p>
            <p>Referencias: {datosEntrega?.referencias || "Ninguna"}</p>
          </>
        ) : (
          <>
            <p>Empresa: {datosEntrega?.empresa}</p>
            <p>Agencia: {datosEntrega?.agencia}</p>
            <p>Casillero: {datosEntrega?.casillero || "Ninguno"}</p>
          </>
        )}
      </div>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-bold mb-2">Resumen del Carrito:</h3>
        {(success ? cartSnapshot.length === 0 : cart.length === 0) ? (
          <div className="text-red-600">Tu carrito está vacío.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Producto</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(success ? cartSnapshot : cart).map((item) => (
                <tr key={item.id + item.size + item.color} className="border-t">
                  <td className="flex items-center gap-2 py-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    {item.name}
                  </td>
                  <td className="text-center">{item.size}</td>
                  <td className="text-center">
                    <span
                      className="inline-block w-4 h-4 rounded-full border align-middle"
                      style={{ background: item.color, borderColor: "#ccc" }}
                      title={item.color}
                    ></span>
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">
                    ${item.price.toLocaleString()}
                  </td>
                  <td className="text-center font-semibold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="text-right font-bold pt-2">
                  Total:
                </td>
                <td className="text-center font-bold pt-2">
                  $
                  {success
                    ? cartTotalSnapshot.toLocaleString()
                    : cartTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-black text-white rounded"
        onClick={onBack}
      >
        Atrás
      </button>
      <button
        className="mt-4 ml-2 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        onClick={handleConfirmar}
        disabled={loading || cart.length === 0}
      >
        {loading ? "Enviando..." : "Confirmar Pedido"}
      </button>
      {success && (
        <div className="mt-4 text-green-700 font-bold">
          ¡Pedido enviado correctamente!
          <br />
          <span className="block text-green-900 font-normal mt-2">
            Tu pedido está pendiente de confirmación. Esto puede tomar unos
            minutos. Te avisaremos cuando sea aprobado.
          </span>
          <Link
            href="/profile/pedidos"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            style={{ marginTop: "20px" }}
          >
            Ver mis pedidos
          </Link>
        </div>
      )}
      {error && <div className="mt-4 text-red-600 font-bold">{error}</div>}
    </div>
  );
};

export default StepConfirmacion;
