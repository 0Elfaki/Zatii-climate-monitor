import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Check, Loader2, Server, Database, BrainCircuit } from 'lucide-react';

const STEPS = [
  { id: 1, text: "Ingesting Daily Rainfall Observations...", icon: Database },
  { id: 2, text: "Aligning Gridded Hourly Climate Predictors...", icon: Server },
  { id: 3, text: "Calibrating Time Series for Algadarif Region...", icon: BrainCircuit },
  { id: 4, text: "Detecting Dry Spell Patterns (July-Oct)...", icon: Loader2 },
  { id: 5, text: "Generating Early Warning Report...", icon: Check }
];

export default function AnalysisSteps({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500); 
      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 800);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Running Climate Model</h2>
        <p className="text-gray-500 text-sm">Processing data for Algadarif Region</p>
      </div>
      
      <div className="space-y-6 relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-gray-100" />

        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 relative z-10"
            >
              <div className={`
                w-9 h-9 flex items-center justify-center rounded-full border-2 transition-colors
                ${isDone ? 'bg-green-500 border-green-500 text-white' : 
                  isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 
                  'bg-white border-gray-200 text-gray-300'}
              `}>
                {isDone ? <Check size={16} /> : <Icon size={16} className={isActive ? 'animate-pulse' : ''} />}
              </div>
              
              <span className={`text-sm font-medium transition-colors ${isActive ? 'text-blue-700' : isDone ? 'text-gray-600' : 'text-gray-400'}`}>
                {step.text}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="bg-blue-600 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}