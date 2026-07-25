import React from 'react';
import { BookingStep } from '@/types/booking';
import { Check } from 'lucide-react';

interface BookingStepperProps {
  currentStep: BookingStep;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const steps = [
    { number: 1, label: 'Data Diri' },
    { number: 2, label: 'Pembayaran' },
    { number: 3, label: 'Konfirmasi Sukses' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-[#0D5C54] -translate-y-1/2 transition-all duration-500 z-0"
          style={{
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
          }}
        />

        {/* Step Circles */}
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCompleted
                    ? 'bg-[#0D5C54] text-white'
                    : isActive
                    ? 'bg-[#0D5C54] text-white ring-4 ring-emerald-100 shadow-md'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span
                className={`text-xs font-semibold ${
                  isActive ? 'text-[#0D5C54]' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
