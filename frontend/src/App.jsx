import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './App.css'; // Keeps basic Vite styling, harmless

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    setLoading(true);
    const files = event.target.files;
    const formData = new FormData();
    
    // Pack all files to send to backend
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      // Send to your Python Backend
      const response = await axios.post('http://localhost:8000/predict', formData);
      setData(response.data.data);
    } catch (error) {
      console.error("Error analyzing climate data:", error);
      alert("Error connecting to backend. Is the Python server running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Zatii Climate Monitor 🌍</h1>
      
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Upload Climate Data</h2>
        <input 
          type="file" 
          multiple 
          onChange={handleUpload} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
        {loading && <p className="text-blue-600 mt-2 font-medium animate-pulse">Running Titanium Master Engine...</p>}
      </div>

      {/* Results Section */}
      {data.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">2. Dry Spell Forecast</h2>
          
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="risk_score" stroke="#16a34a" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="font-bold text-lg">Analysis Report:</h3>
            <p className="text-gray-700">Total Days Analyzed: <span className="font-mono">{data.length}</span></p>
            <p className="text-red-600 font-semibold">High Risk Alerts: {data.filter(d => d.status === "High Risk").length}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;