import React from "react";

interface StepEnvioProps {
  onNext: () => void;
  onBack: () => void;
}

const StepEnvio: React.FC<StepEnvioProps> = ({ onNext, onBack }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Método de Envío</h2>
      {/* Aquí irá la selección real de envío */}
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={onBack}>
          Atrás
        </button>
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={onNext}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default StepEnvio;
