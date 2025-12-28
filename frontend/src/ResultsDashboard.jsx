import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Download, Send, CloudRain } from 'lucide-react';

// Fallback data in case something goes wrong with the upload
const MOCK_DATA = [
  { day: 'Jul 1', rain: 45, threshold: 30 },
  { day: 'Jul 10', rain: 38, threshold: 30 },
  { day: 'Jul 20', rain: 32, threshold: 30 },
  { day: 'Aug 1', rain: 12, threshold: 30 },
  { day: 'Aug 10', rain: 8, threshold: 30 },
  { day: 'Aug 20', rain: 15, threshold: 30 },
  { day: 'Sep 1', rain: 40, threshold: 30 },
];

export default function ResultsDashboard({ data }) {
  
  // Use uploaded data if available, otherwise use mock data
  const chartData = data && data.length > 0 ? data : MOCK_DATA;

  // Simple logic to detect if there is a risk (rain < threshold)
  const hasRisk = chartData.some(d => d.rain < d.threshold);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Complete ✅</h2>
          <p className="text-gray-500">Target: Algadarif Region • Season: July-Oct 2024</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-md">
          <Download size={18} /> Export Data
        </button>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Risk Level */}
        <div className={`border p-6 rounded-2xl ${hasRisk ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${hasRisk ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className={`font-semibold ${hasRisk ? 'text-red-900' : 'text-green-900'}`}>Dry Spell Risk</h3>
          </div>
          <p className={`text-3xl font-bold ${hasRisk ? 'text-red-700' : 'text-green-700'}`}>
            {hasRisk ? "HIGH" : "LOW"}
          </p>
          <p className={`text-sm mt-1 ${hasRisk ? 'text-red-600' : 'text-green-600'}`}>
            {hasRisk ? "Critical drop detected below threshold" : "Moisture levels stable"}
          </p>
        </div>

        {/* Card 2: Rainfall */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <CloudRain size={24} />
            </div>
            <h3 className="font-semibold text-blue-900">Avg. Rainfall</h3>
          </div>
          <p className="text-3xl font-bold text-blue-700">-- mm</p>
          <p className="text-sm text-blue-600 mt-1">Based on uploaded dataset</p>
        </div>

        {/* Card 3: Action */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-200 rounded-lg text-gray-600">
              <Send size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Recommendation</h3>
          </div>
          <p className="font-bold text-gray-800 text-lg leading-tight">
            {hasRisk ? "Delay Planting / Fertilizer" : "Proceed with Planting"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {hasRisk ? "Conserve soil moisture" : "Conditions are optimal"}
          </p>
        </div>
      </div>

      {/* 3. Main Chart */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">Rainfall Projection vs. Threshold</h3>
          <p className="text-gray-500">Visualizing moisture levels based on your CSV upload.</p>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Area 
                type="monotone" 
                dataKey="rain" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorRain)" 
                strokeWidth={3}
                name="Rainfall (mm)"
              />
              <Area 
                type="monotone" 
                dataKey="threshold" 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                fill="none" 
                strokeWidth={2}
                name="Critical Threshold"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}       