"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ADMIN_EMAILS = ["valcas2205@gmail.com", "admin@example.com"];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accion, setAccion] = useState({});

  useEffect(() => {
    if (
      status === "authenticated" &&
      ADMIN_EMAILS.includes(session.user.email)
    ) {
      fetch("/api/pedidos-admin")
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

  const cambiarEstado = async (id, nuevoEstado) => {
    setAccion({ [id]: true });
    try {
      const res = await fetch(`/api/pedidos-admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado");
      setPedidos((prev) =>
        prev.map((p) => (p._id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (e) {
      alert("Error al actualizar el estado");
    } finally {
      setAccion({});
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!session?.user || !ADMIN_EMAILS.includes(session.user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Acceso denegado
          </h2>
          <p className="text-gray-700">
            No tienes permisos para ver esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Panel de Administración
        </h2>
        <p className="mb-8 text-gray-700">
          Bienvenido, {session.user.name} ({session.user.email})
        </p>
        {loading ? (
          <div>Cargando pedidos...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : pedidos.length === 0 ? (
          <div className="text-gray-500">No hay pedidos.</div>
        ) : (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Fecha</th>
                <th className="p-2">Cliente</th>
                <th className="p-2">Total</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Comprobante</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-2">{new Date(p.fecha).toLocaleString()}</td>
                  <td className="p-2">
                    {p.datosEntrega?.nombre} {p.datosEntrega?.apellido}
                  </td>
                  <td className="p-2 font-bold">
                    $
                    {p.carrito?.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )}
                  </td>
                  <td className="p-2 font-semibold capitalize">{p.estado}</td>
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
                  <td className="p-2 flex gap-2">
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                      disabled={p.estado === "confirmado" || accion[p._id]}
                      onClick={() => cambiarEstado(p._id, "confirmado")}
                    >
                      Confirmar
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                      disabled={p.estado === "rechazado" || accion[p._id]}
                      onClick={() => cambiarEstado(p._id, "rechazado")}
                    >
                      Rechazar
                    </button>
                    <details>
                      <summary className="cursor-pointer text-blue-600 underline ml-2">
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
