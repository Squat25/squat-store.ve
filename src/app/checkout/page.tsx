"use client";

import React, { useState } from "react";
import CheckoutSteps from "../../components/CheckoutSteps";
import StepEntrega from "../../components/StepEntrega";
import StepEnvio from "../../components/StepEnvio";
import StepPago from "../../components/StepPago";
import StepConfirmacion from "../../components/StepConfirmacion";
import { CheckoutProvider } from "../../context/CheckoutContext";

const steps = ["Entrega", "Envío", "Pago", "Confirmación"];

const CheckoutPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [datosPago, setDatosPago] = useState(null); // Estado global para el pago

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <CheckoutProvider>
      <div className="max-w-4xl mx-auto py-8 px-2">
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
    </CheckoutProvider>
  );
};

export default CheckoutPage;
