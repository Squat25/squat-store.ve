import React, { useEffect, useContext, useState } from "react";
import { useCheckout } from "../context/CheckoutContext";
import { CartContext } from "../context/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

  useEffect(() => {
    localStorage.removeItem("checkout_datosEntrega");
  }, []);

  const handleConfirmar = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
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
    } catch (err) {
      setError(err.message || "Error al guardar el pedido");
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
        {cart.length === 0 ? (
          <div className="text-red-600">Tu carrito está vacío.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-t">
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
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-200 rounded"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-200 rounded"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-center">
                    ${item.price.toLocaleString()}
                  </td>
                  <td className="text-center font-semibold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right font-bold pt-2">
                  Total:
                </td>
                <td className="text-center font-bold pt-2">
                  ${cartTotal.toLocaleString()}
                </td>
                <td></td>
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
        className="mt-4 ml-2 px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleConfirmar}
        disabled={loading}
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
