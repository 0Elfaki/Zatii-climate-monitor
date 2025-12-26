import React, { useState } from 'react';
import Papa from 'papaparse'; // <--- Import this
import FileUploader from './FileUploader';
import AnalysisSteps from './AnalysisSteps';
import ResultsDashboard from './ResultsDashboard';
import { LayoutDashboard } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState('upload');
  const [trainFile, setTrainFile] = useState(null);
  const [testFile, setTestFile] = useState(null);
  
  // New State: Store the actual data for the chart
  const [chartData, setChartData] = useState(null);

  const isReady = trainFile && testFile;

  // New Function: Read the CSV and convert it for the Chart
  const handleAnalysisStart = () => {
    if (!testFile) return;

    // Use PapaParse to read the file text
    Papa.parse(testFile, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        // We assume the CSV has columns: 'day', 'rain', 'threshold'
        // If the user uploads a file with different columns, this might need adjustment
        // For now, we trust the input or use the raw results.data
        setChartData(results.data);
        setStep('processing');
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Error reading file. Please check the CSV format.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      
      <nav className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Zatii <span className="text-blue-600">Climate Monitor</span></h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Algadarif Early Warning System</p>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        
        {/* PHASE 1: UPLOAD */}
        {step === 'upload' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             {/* ... (Header Text remains same) ... */}
            <div className="text-center mb-12 mt-4">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Predict Dry Spells in Algadarif</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload historical data and current seasonal predictors.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <FileUploader 
                title="1. Historical Rainfall Data (Train)" 
                onFileSelect={(f) => setTrainFile(f)} 
              />
              <FileUploader 
                title="2. Seasonal Predictors (Test)" 
                onFileSelect={(f) => setTestFile(f)} 
              />
            </div>

            <div className="text-center">
              <button
                disabled={!isReady}
                onClick={handleAnalysisStart} // <--- CHANGED THIS function
                className={`
                  px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform
                  ${isReady 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-2xl' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
              >
                {isReady ? 'Run Analysis Model ⚡' : 'Upload CSVs to Start'}
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: PROCESSING */}
        {step === 'processing' && (
          <AnalysisSteps onComplete={() => setStep('results')} />
        )}

        {/* PHASE 3: RESULTS */}
        {step === 'results' && (
          <div>
            <button 
              onClick={() => { setStep('upload'); setTrainFile(null); setTestFile(null); }}
              className="mb-6 text-sm text-gray-500 hover:text-blue-600 underline"
            >
              ← Start New Analysis
            </button>
            {/* PASS THE REAL DATA DOWN */}
            <ResultsDashboard data={chartData} />
          </div>
        )}

      </main>
    </div>
  );
}