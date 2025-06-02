"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MisPedidosPage() {
  const { data: session, status } = useSession();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(
        `/api/pedidos-admin?email=${encodeURIComponent(session.user.email)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setPedidos(data.pedidos || []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error al cargar pedidos");
          setLoading(false);
        });
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Acceso denegado
          </h2>
          <p className="text-gray-700">
            Debes iniciar sesión para ver tus pedidos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Mis Pedidos</h2>
        <div className="w-full flex flex-col items-center mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mb-2"
            onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
          >
            Ver mis pedidos y estatus
          </button>
          <span className="text-gray-600 text-sm">
            Aquí puedes ver el estado y el detalle de cada pedido realizado.
          </span>
        </div>
        {loading ? (
          <div>Cargando pedidos...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : pedidos.length === 0 ? (
          <div className="text-gray-500">No tienes pedidos aún.</div>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Fecha</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Total</th>
                <th className="p-2">Comprobante</th>
                <th className="p-2">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-2">{new Date(p.fecha).toLocaleString()}</td>
                  <td className="p-2 font-semibold capitalize">{p.estado}</td>
                  <td className="p-2 font-bold">
                    $
                    {p.carrito?.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )}
                  </td>
                  <td className="p-2">
                    {p.pago?.comprobante ? (
                      <a
                        href={p.pago.comprobante}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline"
                      >
                        Ver
                      </a>
                    ) : (
                      <span className="text-gray-400">No adjunto</span>
                    )}
                  </td>
                  <td className="p-2">
                    <details>
                      <summary className="cursor-pointer text-blue-600 underline">
                        Ver Detalle
                      </summary>
                      <div className="bg-gray-50 p-2 mt-2 rounded shadow text-xs min-w-[250px]">
                        <div className="mb-1 font-bold">Productos:</div>
                        <ul>
                          {p.carrito?.map((item) => (
                            <li key={item.id}>
                              {item.name} x{item.quantity} - ${item.price} c/u
                              (Subtotal: ${item.price * item.quantity})
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 font-bold">Datos de Entrega:</div>
                        <div>
                          Nombre: {p.datosEntrega?.nombre}{" "}
                          {p.datosEntrega?.apellido}
                        </div>
                        <div>Teléfono: {p.datosEntrega?.telefono}</div>
                        <div>
                          Dirección:{" "}
                          {p.datosEntrega?.direccion || p.datosEntrega?.agencia}
                        </div>
                        <div>Método: {p.datosEntrega?.metodo}</div>
                        <div className="mt-2 font-bold">Estado del pedido:</div>
                        <div>{p.estado}</div>
                        <div className="mt-2 font-bold">Pago:</div>
                        <div>Monto: ${p.pago?.monto || "-"}</div>
                        <div>Referencia: {p.pago?.referencia || "-"}</div>
                        <div>Banco: {p.pago?.banco || "-"}</div>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
