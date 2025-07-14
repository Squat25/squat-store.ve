"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import CheckoutSteps from "../../components/CheckoutSteps";
import StepEntrega from "../../components/StepEntrega";
import StepEnvio from "../../components/StepEnvio";
import StepPago from "../../components/StepPago";
import StepConfirmacion from "../../components/StepConfirmacion";
import { CheckoutProvider } from "../../context/CheckoutContext";
import { CartContext } from "../../context/CartContext";

const steps = ["Entrega", "Envío", "Pago", "Confirmación"];

const CheckoutPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [datosPago, setDatosPago] = useState(null); // Estado global para el pago
  const { cart, cartTotal } = useContext(CartContext);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <CheckoutProvider>
      <div className="bg-gray-50 min-h-screen py-8 px-2">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Formulario de Checkout */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 md:mb-0">
            <CheckoutSteps steps={steps} currentStep={currentStep} />
            <div className="mt-8">
              {currentStep === 0 && <StepEntrega onNext={nextStep} />}
              {currentStep === 1 && (
                <StepEnvio onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 2 && (
                <StepPago
                  onNext={(pago) => {
                    setDatosPago(pago);
                    nextStep();
                  }}
                  onBack={prevStep}
                />
              )}
              {currentStep === 3 && (
                <StepConfirmacion onBack={prevStep} datosPago={datosPago} />
              )}
            </div>
          </div>
          {/* Resumen del pedido */}
          <div className="w-full md:w-96 bg-white rounded-2xl shadow-lg p-6 md:p-8 h-fit sticky top-24 self-start">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Resumen del Pedido
            </h3>
            {cart.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Tu carrito está vacío.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 mb-4">
                {cart.map((item) => (
                  <li
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center py-3"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden mr-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        Talla: {item.size} | Color:{" "}
                        <span
                          className="inline-block w-4 h-4 rounded-full border align-middle ml-1"
                          style={{
                            background: item.color,
                            borderColor: "#ccc",
                          }}
                          title={item.color}
                        ></span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Cantidad: {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between font-semibold text-lg mb-2">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </CheckoutProvider>
  );
};

export default CheckoutPage;
