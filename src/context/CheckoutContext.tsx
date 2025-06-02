import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type MetodoEntrega = "domicilio" | "agencia";
export type EmpresaAgencia = "MRW" | "Zoom";

export interface DatosEntrega {
  metodo: MetodoEntrega;
  empresa: EmpresaAgencia;
  estado: string;
  ciudad: string;
  agencia: string;
  direccion: string;
  referencias: string;
  casillero: string;
  telefono: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

interface CheckoutContextType {
  datosEntrega: DatosEntrega | null;
  setDatosEntrega: (datos: DatosEntrega) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  // Restaurar del localStorage si existe
  const [datosEntrega, setDatosEntregaState] = useState<DatosEntrega | null>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("checkout_datosEntrega");
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    }
  );

  // Guardar en localStorage cada vez que cambian los datos
  useEffect(() => {
    if (datosEntrega) {
      localStorage.setItem(
        "checkout_datosEntrega",
        JSON.stringify(datosEntrega)
      );
    }
  }, [datosEntrega]);

  // setDatosEntrega que actualiza el estado y localStorage
  const setDatosEntrega = (datos: DatosEntrega) => {
    setDatosEntregaState(datos);
  };

  return (
    <CheckoutContext.Provider value={{ datosEntrega, setDatosEntrega }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context)
    throw new Error("useCheckout debe usarse dentro de CheckoutProvider");
  return context;
};
