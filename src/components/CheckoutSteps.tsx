import React from "react";

interface CheckoutStepsProps {
  steps: string[];
  currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, idx) => (
        <div key={step} className="flex-1 flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-white font-bold ${
              idx <= currentStep ? "bg-black" : "bg-gray-300"
            }`}
          >
            {idx + 1}
          </div>
          <span
            className={`text-xs ${
              idx === currentStep ? "font-semibold" : "text-gray-500"
            }`}
          >
            {step}
          </span>
          {idx < steps.length - 1 && (
            <div className="w-full h-1 bg-gray-200 mt-2 mb-2" />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
