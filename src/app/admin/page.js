"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ADMIN_EMAILS = ["valcas2205@gmail.com", "admin@example.com"];

function TabButton({ active, onClick, children }) {
  return (
    <button
      className={`px-4 py-2 rounded-t font-semibold border-b-2 transition-colors duration-200 ${
        active
          ? "border-black text-black bg-white"
          : "border-transparent text-gray-500 bg-gray-100 hover:text-black"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Modal de editor de variantes
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState("pedidos");
  // Pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accion, setAccion] = useState({});
  // Inventario
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [variantes, setVariantes] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(false);
  const [savingInventario, setSavingInventario] = useState(false);
  const [inventarioError, setInventarioError] = useState("");

  // Cargar pedidos
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

  // Cargar productos de DatoCMS para inventario
  useEffect(() => {
    if (tab === "inventario") {
      setLoadingInventario(true);
      fetch("/api/products-admin")
        .then((res) => res.json())
        .then((data) => {
          setProductos(data.productos || []);
          setLoadingInventario(false);
        })
        .catch(() => {
          setInventarioError("Error al cargar productos");
          setLoadingInventario(false);
        });
    }
  }, [tab]);

  // Cargar variantes de inventario de MongoDB al seleccionar producto
  const handleSelectProducto = (producto) => {
    setProductoSeleccionado(producto);
    setInventarioError("");
    setVariantes([]);
    setLoadingInventario(true);
    fetch(`/api/inventario?slug=${producto.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setVariantes(data.variantes || []);
        setLoadingInventario(false);
      })
      .catch(() => {
        setInventarioError("Error al cargar inventario");
        setLoadingInventario(false);
      });
  };

  // Editar stock de una variante
  const handleChangeStock = (idx, value) => {
    setVariantes((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, stock: value } : v))
    );
  };

  // Agregar nueva variante
  const handleAddVariante = () => {
    setVariantes((prev) => [...prev, { talla: "", color: "", stock: 0 }]);
  };

  // Guardar inventario
  const handleSaveInventario = async () => {
    if (!productoSeleccionado) return;
    setSavingInventario(true);
    setInventarioError("");
    try {
      const res = await fetch(
        `/api/inventario?slug=${productoSeleccionado.slug}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantes }),
        }
      );
      if (!res.ok) throw new Error("No se pudo guardar el inventario");
      setSavingInventario(false);
    } catch (e) {
      setInventarioError("Error al guardar inventario");
      setSavingInventario(false);
    }
  };

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
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-5xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Panel de Administración
        </h2>
        <p className="mb-8 text-gray-700">
          Bienvenido, {session.user.name} ({session.user.email})
        </p>
        {/* Tabs */}
        <div className="flex mb-8 w-full">
          <TabButton
            active={tab === "pedidos"}
            onClick={() => setTab("pedidos")}
          >
            Pedidos
          </TabButton>
          <TabButton
            active={tab === "inventario"}
            onClick={() => setTab("inventario")}
          >
            Inventario
          </TabButton>
        </div>
        {/* Pedidos */}
        {tab === "pedidos" &&
          (loading ? (
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
                    <td className="p-2">
                      {new Date(p.fecha).toLocaleString()}
                    </td>
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
                          <div className="mt-2 font-bold">
                            Datos de Entrega:
                          </div>
                          <div>
                            Nombre: {p.datosEntrega?.nombre}{" "}
                            {p.datosEntrega?.apellido}
                          </div>
                          <div>Teléfono: {p.datosEntrega?.telefono}</div>
                          <div>
                            Dirección:{" "}
                            {p.datosEntrega?.direccion ||
                              p.datosEntrega?.agencia}
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
          ))}
        {/* Inventario */}
        {tab === "inventario" && (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Inventario de Productos
            </h3>
            {loadingInventario ? (
              <div>Cargando productos...</div>
            ) : inventarioError ? (
              <div className="text-red-600">{inventarioError}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    className={`border rounded-lg p-4 shadow cursor-pointer transition hover:shadow-lg ${
                      productoSeleccionado?.id === producto.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => handleSelectProducto(producto)}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <img
                        src={
                          producto.images &&
                          Array.isArray(producto.images) &&
                          producto.images[0]?.url
                            ? producto.images[0].url
                            : "/LogoNegro.png"
                        }
                        alt={producto.name}
                        className="w-16 h-16 object-cover rounded bg-gray-100"
                        onError={(e) => (e.target.src = "/LogoNegro.png")}
                      />
                      <div>
                        <div className="font-bold text-lg">{producto.name}</div>
                        <div className="text-gray-500 text-sm">
                          {producto.slug}
                        </div>
                        <div className="text-gray-700 font-semibold mt-1">
                          ${producto.price}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {producto.categories?.map((cat) => cat.name).join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Modal de editor de variantes */}
            <Modal
              open={!!productoSeleccionado}
              onClose={() => setProductoSeleccionado(null)}
            >
              {productoSeleccionado && (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={
                        productoSeleccionado.images &&
                        Array.isArray(productoSeleccionado.images) &&
                        productoSeleccionado.images[0]?.url
                          ? productoSeleccionado.images[0].url
                          : "/LogoNegro.png"
                      }
                      alt={productoSeleccionado.name}
                      className="w-24 h-24 object-cover rounded bg-gray-100 border"
                      onError={(e) => (e.target.src = "/LogoNegro.png")}
                    />
                    <div>
                      <div className="font-bold text-lg">
                        {productoSeleccionado.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {productoSeleccionado.slug}
                      </div>
                    </div>
                  </div>
                  <h4 className="font-bold mb-2">
                    Variantes (Talla, Color, Stock)
                  </h4>
                  <table className="w-full text-sm mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2">Talla</th>
                        <th className="p-2">Color</th>
                        <th className="p-2">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantes.map((v, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <input
                              className="border rounded px-2 py-1 w-20"
                              value={v.talla}
                              onChange={(e) =>
                                setVariantes((prev) =>
                                  prev.map((vv, i) =>
                                    i === idx
                                      ? { ...vv, talla: e.target.value }
                                      : vv
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="p-2">
                            <input
                              className="border rounded px-2 py-1 w-24"
                              value={v.color}
                              onChange={(e) =>
                                setVariantes((prev) =>
                                  prev.map((vv, i) =>
                                    i === idx
                                      ? { ...vv, color: e.target.value }
                                      : vv
                                  )
                                )
                              }
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={0}
                              className="border rounded px-2 py-1 w-16"
                              value={v.stock}
                              onChange={(e) =>
                                handleChangeStock(idx, Number(e.target.value))
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="bg-gray-200 text-black px-3 py-1 rounded mr-2"
                    onClick={handleAddVariante}
                  >
                    + Agregar Variante
                  </button>
                  <button
                    className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 transition-colors duration-200 ml-2"
                    onClick={handleSaveInventario}
                    disabled={savingInventario}
                  >
                    {savingInventario ? "Guardando..." : "Guardar Inventario"}
                  </button>
                  {inventarioError && (
                    <div className="text-red-600 mt-2">{inventarioError}</div>
                  )}
                </div>
              )}
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
