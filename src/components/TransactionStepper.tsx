import { Check, Pencil } from "lucide-react";

interface TransactionStepperProps {
  currentStep?: number;
}

const steps = [
  { id: 1, label: "本人確認", completed: true },
  { id: 2, label: "審査確認", completed: true },
  { id: 3, label: "保証金", completed: true },
  { id: 4, label: "入札中", completed: false, active: true },
  { id: 5, label: "電子契約", completed: false },
  { id: 6, label: "所有権移転", completed: false },
];

export const TransactionStepper = ({ currentStep = 4 }: TransactionStepperProps) => {
  return (
    <div className="flex items-center justify-center gap-0 py-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            {/* Step Circle */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                step.id < currentStep
                  ? "bg-primary text-white"
                  : step.id === currentStep
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {step.id < currentStep ? (
                <Check className="w-6 h-6" />
              ) : step.id === currentStep ? (
                <Pencil className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            {/* Step Label */}
            <span
              className={`mt-2 text-xs font-medium whitespace-nowrap ${
                step.id <= currentStep ? "text-primary" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 ${
                step.id < currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionStepper;
