"use client";
import { useState } from "react";

export default function ProductSelectionHelper({ isVisible, onClose }) {
  const [step, setStep] = useState(0);

  if (!isVisible) return null;

  const steps = [
    {
      title: "Paso 1: Selecciona tu talla",
      description:
        "Elige la talla que mejor te quede. Puedes cambiar tu selección en cualquier momento.",
      icon: "👕",
    },
    {
      title: "Paso 2: Elige tu color favorito",
      description:
        "Haz clic en el círculo del color que más te guste. El borde negro indica tu selección.",
      icon: "🎨",
    },
    {
      title: "Paso 3: ¡Agrega al carrito!",
      description:
        "Una vez que hayas seleccionado talla y color, el botón se activará y podrás agregar el producto.",
      icon: "🛒",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            ¿Cómo seleccionar tu producto?
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <span className="text-4xl">{steps[step].icon}</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {steps[step].title}
          </h4>
          <p className="text-gray-600 text-sm">{steps[step].description}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className={`px-4 py-2 rounded ${
              step === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Anterior
          </button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === step ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              ¡Entendido!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
