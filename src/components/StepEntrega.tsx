"use client";

import React, { useState, useEffect } from "react";
import {
  useCheckout,
  MetodoEntrega,
  EmpresaAgencia,
  DatosEntrega,
} from "../context/CheckoutContext";
import agenciasMRW from "../data/agencias-mrw.json";
import agenciasZoom from "../data/agencias-zoom.json";

interface StepEntregaProps {
  onNext: () => void;
}

// type MetodoEntrega = "domicilio" | "agencia";
// type EmpresaAgencia = "MRW" | "Zoom";

const estados = [
  "Amazonas",
  "Anzoátegui",
  "Apure",
  "Aragua",
  "Barinas",
  "Bolívar",
  "Carabobo",
  "Cojedes",
  "Delta Amacuro",
  "Distrito Capital",
  "Falcón",
  "Guárico",
  "Lara",
  "Mérida",
  "Miranda",
  "Monagas",
  "Nueva Esparta",
  "Portuguesa",
  "Sucre",
  "Táchira",
  "Trujillo",
  "La Guaira",
  "Yaracuy",
  "Zulia",
];

const agenciasEjemplo = {
  MRW: ["MRW Caracas Centro", "MRW Maracay", "MRW Valencia"],
  Zoom: ["Zoom Caracas Centro", "Zoom Maracay", "Zoom Valencia"],
};

const StepEntrega: React.FC<StepEntregaProps> = ({ onNext }) => {
  const { setDatosEntrega, datosEntrega } = useCheckout();
  const [metodo, setMetodo] = useState<MetodoEntrega>("domicilio");
  const [empresa, setEmpresa] = useState<EmpresaAgencia>("MRW");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [agencia, setAgencia] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencias, setReferencias] = useState("");
  const [casillero, setCasillero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedulaTipo, setCedulaTipo] = useState("V");
  const [cedulaNumero, setCedulaNumero] = useState("");
  const [error, setError] = useState("");

  // Precargar campos si hay datos en el contexto
  useEffect(() => {
    if (datosEntrega) {
      setMetodo(datosEntrega.metodo);
      setEmpresa(datosEntrega.empresa);
      setEstado(datosEntrega.estado);
      setCiudad(datosEntrega.ciudad);
      setAgencia(datosEntrega.agencia);
      setDireccion(datosEntrega.direccion);
      setReferencias(datosEntrega.referencias);
      setCasillero(datosEntrega.casillero);
      setTelefono(datosEntrega.telefono);
      setNombre(datosEntrega.nombre);
      setApellido(datosEntrega.apellido);
      // Restaurar cédula separando tipo y número
      if (datosEntrega.cedula) {
        const match = datosEntrega.cedula.match(/^(V|E|J)-(\d{1,10})$/i);
        if (match) {
          setCedulaTipo(match[1].toUpperCase());
          setCedulaNumero(match[2]);
        } else {
          setCedulaTipo("V");
          setCedulaNumero("");
        }
      }
    }
  }, [datosEntrega]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación mejorada con mensajes específicos
    if (!nombre) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!apellido) {
      setError("El apellido es obligatorio.");
      return;
    }
    if (!cedulaNumero) {
      setError("La cédula o RIF es obligatorio.");
      return;
    }
    if (!telefono) {
      setError("El teléfono es obligatorio.");
      return;
    }
    if (!estado) {
      setError("El estado es obligatorio.");
      return;
    }
    if (!ciudad) {
      setError("La ciudad es obligatoria.");
      return;
    }
    if (metodo === "domicilio" && !direccion) {
      setError("La dirección es obligatoria para delivery.");
      return;
    }
    if (metodo === "agencia" && !agencia) {
      setError("Selecciona una agencia.");
      return;
    }
    setError("");
    // Guardar en contexto global
    setDatosEntrega({
      metodo,
      empresa,
      estado,
      ciudad,
      agencia: metodo === "agencia" ? agencia : "",
      direccion: metodo === "domicilio" ? direccion : "",
      referencias,
      casillero,
      telefono,
      nombre,
      apellido,
      cedula: `${cedulaTipo}-${cedulaNumero}`,
    });
    onNext();
  };

  // Refuerzo: al cambiar a domicilio, setea estado y ciudad en el estado local
  useEffect(() => {
    if (metodo === "domicilio") {
      setEstado("Lara");
      setCiudad("Barquisimeto");
    }
  }, [metodo]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Datos de Entrega</h2>
      <div className="flex gap-4 mb-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="metodo"
            value="domicilio"
            checked={metodo === "domicilio"}
            onChange={() => {
              setMetodo("domicilio");
              setEstado("Lara");
              setCiudad("Barquisimeto");
            }}
          />
          Delivery a domicilio
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="metodo"
            value="agencia"
            checked={metodo === "agencia"}
            onChange={() => {
              setMetodo("agencia");
              setEstado("");
              setCiudad("");
            }}
          />
          Envío a agencia (MRW/Zoom)
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nombre *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Apellido *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Cédula o RIF *</label>
          <div className="flex gap-2">
            <select
              className="border rounded px-2 py-1"
              value={cedulaTipo}
              onChange={(e) => setCedulaTipo(e.target.value)}
              required
              style={{ width: 60 }}
            >
              <option value="V">V</option>
              <option value="E">E</option>
              <option value="J">J</option>
            </select>
            <input
              className="w-full border rounded px-2 py-1"
              value={cedulaNumero}
              onChange={(e) =>
                setCedulaNumero(e.target.value.replace(/[^0-9]/g, ""))
              }
              required
              placeholder="Ej: 12345678"
              maxLength={10}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Teléfono *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            placeholder="Ej: 0412-1234567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Estado *</label>
          {metodo === "domicilio" ? (
            <input
              className="w-full border rounded px-2 py-1 bg-gray-100"
              value="Lara"
              disabled
            />
          ) : (
            <select
              className="w-full border rounded px-2 py-1"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            >
              <option value="">Selecciona un estado</option>
              {estados.map((est) => (
                <option key={est} value={est}>
                  {est}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Ciudad *</label>
          {metodo === "domicilio" ? (
            <input
              className="w-full border rounded px-2 py-1 bg-gray-100"
              value="Barquisimeto"
              disabled
            />
          ) : (
            <input
              className="w-full border rounded px-2 py-1"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
          )}
        </div>
        {metodo === "domicilio" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">
              Dirección exacta *
            </label>
            <input
              className="w-full border rounded px-2 py-1"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
            <label className="block text-xs text-gray-500 mt-1">
              Incluye calle, edificio, apto, etc.
            </label>
            <label className="block text-sm font-medium mt-2">
              Referencias (opcional)
            </label>
            <input
              className="w-full border rounded px-2 py-1"
              value={referencias}
              onChange={(e) => setReferencias(e.target.value)}
            />
          </div>
        )}
        {metodo === "agencia" && (
          <>
            <div>
              <label className="block text-sm font-medium">Empresa *</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value as EmpresaAgencia)}
                required
              >
                <option value="MRW">MRW</option>
                <option value="Zoom">Zoom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Agencia/Sucursal *
              </label>
              <select
                className="w-full border rounded px-2 py-1"
                value={agencia}
                onChange={(e) => setAgencia(e.target.value)}
                required
              >
                <option value="">Selecciona una agencia</option>
                {(empresa === "MRW"
                  ? agenciasMRW[estado] || []
                  : agenciasZoom[estado] || []
                ).map((ag) => (
                  <option key={ag.nombre} value={ag.nombre}>
                    {ag.nombre} ({ag.ciudad})
                  </option>
                ))}
              </select>
              {agencia && (
                <div className="text-xs text-gray-600 mt-1">
                  Ciudad seleccionada:{" "}
                  {(empresa === "MRW"
                    ? agenciasMRW[estado] || []
                    : agenciasZoom[estado] || []
                  ).find((ag) => ag.nombre === agencia)?.ciudad || ""}
                </div>
              )}
              {((empresa === "MRW" &&
                !(agenciasMRW[estado] && agenciasMRW[estado].length)) ||
                (empresa === "Zoom" &&
                  !(agenciasZoom[estado] && agenciasZoom[estado].length))) && (
                <div className="text-red-600 text-xs mt-1">
                  No hay agencias disponibles en este estado.
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Número de casillero (opcional)
              </label>
              <input
                className="w-full border rounded px-2 py-1"
                value={casillero}
                onChange={(e) => setCasillero(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Siguiente
      </button>
    </form>
  );
};

export default StepEntrega;
