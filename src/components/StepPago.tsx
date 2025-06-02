import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { uploadToImgBB } from "../utils/uploadToImgBB";

const metodos = [
  { key: "pagoMovil", label: "Pago móvil" },
  { key: "transferencia", label: "Transferencia" },
  { key: "zelle", label: "Zelle" },
  { key: "efectivo", label: "Efectivo" },
  { key: "binance", label: "Binance Pay" },
  { key: "facebank", label: "Transferencia a Facebank" },
];

const bancos = [
  "Banesco",
  "Mercantil",
  "Venezuela",
  "Bancaribe",
  "BOD",
  "Provincial",
  "BNC",
  "Banfanb",
  "Bicentenario",
  "Otro",
];

const datosPago = {
  pagoMovil: {
    banco: "Banesco",
    titular: "Victoria Castillo",
    cedula: "V-30179383",
    telefono: "0412-1234567",
  },
  transferencia: {
    banco: "Mercantil",
    titular: "Victoria Castillo",
    cedula: "V-30179383",
    cuenta: "0105-1234-5678-9012-3456",
    tipo: "Corriente",
  },
  zelle: {
    correo: "squatstore@gmail.com",
    titular: "Victoria Castillo",
  },
  binance: {
    usuario: "squatve",
    nota: "Enviar solo a través de Binance Pay",
  },
  facebank: {
    banco: "Facebank International",
    titular: "Victoria Castillo",
    cuenta: "1234567890",
    routing: "123456789",
    tipo: "Checking",
  },
};

const StepPago = ({ onNext, onBack }) => {
  const { cartTotal } = useContext(CartContext);
  const [metodo, setMetodo] = useState("pagoMovil");
  const [form, setForm] = useState({
    banco: "",
    telefono: "",
    cedula: "",
    referencia: "",
    monto: cartTotal,
    cuenta: "",
    nombre: "",
    correo: "",
    usuarioBinance: "",
    comprobante: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "comprobante") {
      setForm({ ...form, comprobante: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación básica por método
    if (metodo === "pagoMovil") {
      if (
        !form.banco ||
        !form.telefono ||
        !form.cedula ||
        !form.referencia ||
        !form.monto
      ) {
        setError("Completa todos los campos de pago móvil.");
        return;
      }
    }
    if (metodo === "transferencia") {
      if (
        !form.banco ||
        !form.cuenta ||
        !form.nombre ||
        !form.cedula ||
        !form.referencia ||
        !form.monto
      ) {
        setError("Completa todos los campos de transferencia.");
        return;
      }
    }
    if (metodo === "zelle") {
      if (!form.correo || !form.nombre || !form.referencia || !form.monto) {
        setError("Completa todos los campos de Zelle.");
        return;
      }
    }
    if (metodo === "binance") {
      if (!form.usuarioBinance || !form.referencia || !form.monto) {
        setError("Completa todos los campos de Binance Pay.");
        return;
      }
    }
    if (metodo === "facebank") {
      if (!form.comprobante) {
        setError("Debes subir el comprobante de la transferencia.");
        return;
      }
    }
    if (metodo !== "efectivo" && !form.comprobante) {
      setError("Debes subir el comprobante de pago.");
      return;
    }
    setError("");

    let comprobanteUrl = null;
    if (form.comprobante) {
      try {
        comprobanteUrl = await uploadToImgBB(
          form.comprobante,
          process.env.NEXT_PUBLIC_IMGBB_API_KEY
        );
      } catch (err) {
        setError("Error al subir el comprobante. Intenta de nuevo.");
        return;
      }
    }
    const formWithUrl = { ...form, comprobante: comprobanteUrl };
    onNext(formWithUrl, metodo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Pago</h2>
      <div className="mb-2">
        <span className="font-bold">Total a pagar: </span>
        <span className="text-green-700 text-lg">
          ${cartTotal.toLocaleString()}
        </span>
      </div>
      <div className="flex gap-2 mb-4">
        {metodos.map((m) => (
          <button
            type="button"
            key={m.key}
            className={`px-4 py-2 rounded border ${
              metodo === m.key ? "bg-black text-white" : "bg-white text-black"
            }`}
            onClick={() => setMetodo(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      {/* Mostrar datos de destino antes del comprobante */}
      {metodo !== "efectivo" && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <h4 className="font-bold mb-1">Datos para transferir:</h4>
          {metodo === "pagoMovil" && (
            <ul>
              <li>
                <b>Banco:</b> {datosPago.pagoMovil.banco}
              </li>
              <li>
                <b>Teléfono:</b> {datosPago.pagoMovil.telefono}
              </li>
              <li>
                <b>Titular:</b> {datosPago.pagoMovil.titular}
              </li>
              <li>
                <b>Cédula:</b> {datosPago.pagoMovil.cedula}
              </li>
            </ul>
          )}
          {metodo === "transferencia" && (
            <ul>
              <li>
                <b>Banco:</b> {datosPago.transferencia.banco}
              </li>
              <li>
                <b>N° de cuenta:</b> {datosPago.transferencia.cuenta}
              </li>
              <li>
                <b>Titular:</b> {datosPago.transferencia.titular}
              </li>
              <li>
                <b>Cédula:</b> {datosPago.transferencia.cedula}
              </li>
              <li>
                <b>Tipo:</b> {datosPago.transferencia.tipo}
              </li>
            </ul>
          )}
          {metodo === "zelle" && (
            <ul>
              <li>
                <b>Correo Zelle:</b> {datosPago.zelle.correo}
              </li>
              <li>
                <b>Titular:</b> {datosPago.zelle.titular}
              </li>
            </ul>
          )}
          {metodo === "binance" && (
            <ul>
              <li>
                <b>Usuario Binance Pay:</b> {datosPago.binance.usuario}
              </li>
              <li>
                <b>Nota:</b> {datosPago.binance.nota}
              </li>
            </ul>
          )}
          {metodo === "facebank" && (
            <ul>
              <li>
                <b>Banco:</b> {datosPago.facebank.banco}
              </li>
              <li>
                <b>N° de cuenta:</b> {datosPago.facebank.cuenta}
              </li>
              <li>
                <b>Routing number:</b> {datosPago.facebank.routing}
              </li>
              <li>
                <b>Titular:</b> {datosPago.facebank.titular}
              </li>
              <li>
                <b>Tipo:</b> {datosPago.facebank.tipo}
              </li>
            </ul>
          )}
        </div>
      )}
      {/* Campos dinámicos según método */}
      {metodo === "pagoMovil" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Banco *</label>
            <select
              name="banco"
              className="w-full border rounded px-2 py-1"
              value={form.banco}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un banco</option>
              {bancos.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Teléfono *</label>
            <input
              name="telefono"
              className="w-full border rounded px-2 py-1"
              value={form.telefono}
              onChange={handleChange}
              required
              placeholder="Ej: 0412-1234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cédula/RIF *</label>
            <input
              name="cedula"
              className="w-full border rounded px-2 py-1"
              value={form.cedula}
              onChange={handleChange}
              required
              placeholder="Ej: V-12345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Referencia *</label>
            <input
              name="referencia"
              className="w-full border rounded px-2 py-1"
              value={form.referencia}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Monto *</label>
            <input
              name="monto"
              className="w-full border rounded px-2 py-1"
              value={form.monto}
              onChange={handleChange}
              required
              type="number"
              min={1}
            />
          </div>
        </div>
      )}
      {metodo === "transferencia" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Banco *</label>
            <select
              name="banco"
              className="w-full border rounded px-2 py-1"
              value={form.banco}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un banco</option>
              {bancos.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">N° de cuenta *</label>
            <input
              name="cuenta"
              className="w-full border rounded px-2 py-1"
              value={form.cuenta}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Nombre titular *
            </label>
            <input
              name="nombre"
              className="w-full border rounded px-2 py-1"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cédula/RIF *</label>
            <input
              name="cedula"
              className="w-full border rounded px-2 py-1"
              value={form.cedula}
              onChange={handleChange}
              required
              placeholder="Ej: V-12345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Referencia *</label>
            <input
              name="referencia"
              className="w-full border rounded px-2 py-1"
              value={form.referencia}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Monto *</label>
            <input
              name="monto"
              className="w-full border rounded px-2 py-1"
              value={form.monto}
              onChange={handleChange}
              required
              type="number"
              min={1}
            />
          </div>
        </div>
      )}
      {metodo === "zelle" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Correo Zelle *</label>
            <input
              name="correo"
              className="w-full border rounded px-2 py-1"
              value={form.correo}
              onChange={handleChange}
              required
              placeholder="Ej: ejemplo@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Nombre titular *
            </label>
            <input
              name="nombre"
              className="w-full border rounded px-2 py-1"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Referencia *</label>
            <input
              name="referencia"
              className="w-full border rounded px-2 py-1"
              value={form.referencia}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Monto *</label>
            <input
              name="monto"
              className="w-full border rounded px-2 py-1"
              value={form.monto}
              onChange={handleChange}
              required
              type="number"
              min={1}
            />
          </div>
        </div>
      )}
      {metodo === "efectivo" && (
        <div className="p-4 bg-yellow-50 rounded">
          <p className="text-yellow-800">
            El pago se realiza al recibir el pedido. Ten el monto exacto
            disponible.
          </p>
        </div>
      )}
      {metodo === "binance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Usuario Binance Pay *
            </label>
            <input
              name="usuarioBinance"
              className="w-full border rounded px-2 py-1"
              value={form.usuarioBinance}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Referencia *</label>
            <input
              name="referencia"
              className="w-full border rounded px-2 py-1"
              value={form.referencia}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Monto *</label>
            <input
              name="monto"
              className="w-full border rounded px-2 py-1"
              value={form.monto}
              onChange={handleChange}
              required
              type="number"
              min={1}
            />
          </div>
        </div>
      )}
      {metodo === "facebank" && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">
              Comprobante de transferencia *
            </label>
            <input
              type="file"
              name="comprobante"
              accept="image/*,application/pdf"
              className="w-full border rounded px-2 py-1"
              onChange={handleChange}
              required
            />
            <span className="text-xs text-gray-500">
              Adjunta una imagen o PDF del comprobante.
            </span>
          </div>
        </div>
      )}
      {metodo !== "efectivo" && (
        <div>
          <label className="block text-sm font-medium">
            Comprobante de pago *
          </label>
          <input
            type="file"
            name="comprobante"
            accept="image/*,application/pdf"
            className="w-full border rounded px-2 py-1"
            onChange={handleChange}
            required
          />
          <span className="text-xs text-gray-500">
            Adjunta una imagen o PDF del comprobante.
          </span>
        </div>
      )}
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={onBack}
        >
          Atrás
        </button>
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
          Siguiente
        </button>
      </div>
    </form>
  );
};

export default StepPago;
