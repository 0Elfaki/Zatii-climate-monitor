import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function FileUploader({ title, onFileSelect }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'success', 'error'
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it is a CSV
    if (file.name.endsWith('.csv')) {
      setStatus('success');
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setStatus('error');
      setFileName('');
      onFileSelect(null);
    }
  };

  return (
    <div className={`
      relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group
      ${status === 'idle' ? 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400' : ''}
      ${status === 'success' ? 'border-green-500 bg-green-50' : ''}
      ${status === 'error' ? 'border-red-500 bg-red-50' : ''}
    `}>
      <div className="mx-auto w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
        {status === 'idle' && <Upload className="text-gray-400" />}
        {status === 'success' && <CheckCircle className="text-green-500" />}
        {status === 'error' && <AlertCircle className="text-red-500" />}
      </div>

      <h3 className="font-bold text-lg mb-1">{title}</h3>
      
      {status === 'idle' && (
        <p className="text-sm text-gray-500">Drag & drop or click to upload .CSV</p>
      )}
      
      {status === 'success' && (
        <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
          <FileText size={16} />
          {fileName}
        </div>
      )}

      {status === 'error' && (
        <p className="text-red-600 text-sm font-medium">Incorrect format! Please use .csv</p>
      )}

      <input 
        type="file" 
        accept=".csv"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
