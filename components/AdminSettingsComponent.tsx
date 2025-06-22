
import React, { useState, useEffect } from 'react';
import { AdminSettings } from '../types';
import { Cog6ToothIcon, CheckCircleIcon, ExclamationTriangleIcon } from './Icons';

interface AdminSettingsProps {
  settings: AdminSettings;
  onSave: (settings: AdminSettings) => void;
}

const AdminSettingsComponent: React.FC<AdminSettingsProps> = ({ settings, onSave }) => {
  const [qrisImageUrl, setQrisImageUrl] = useState(settings.qrisImageUrl || '');
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    setQrisImageUrl(settings.qrisImageUrl || '');
  }, [settings]);

  const handleSave = () => {
    if (!qrisImageUrl.trim()) {
        setMessage({text: 'URL Gambar QRIS tidak boleh kosong jika Anda ingin menggunakan layanan Turnitin.', type: 'error'});
    }
    try {
        if(qrisImageUrl.trim()) new URL(qrisImageUrl);
    } catch (_) {
        setMessage({text: 'Format URL tidak valid untuk Gambar QRIS.', type: 'error'});
        return;
    }
    onSave({ qrisImageUrl });
    setMessage({text: 'Pengaturan berhasil disimpan!', type: 'success'});
    setTimeout(() => setMessage(null), 3000);
  };
  
  const inputClass = "w-full px-4 py-3 rounded-md bg-slate-700 border border-slate-600 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 placeholder-gray-500";
  const labelClass = "block mb-2 text-sm font-medium text-gray-300";

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded-md text-sm flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
          {message.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <ExclamationTriangleIcon className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}
      <div>
        <label htmlFor="qrisImageUrl" className={labelClass}>
          URL Gambar QRIS
          <span className="text-xs text-gray-400 ml-1">(Diperlukan untuk pembayaran layanan Turnitin. Gunakan URL publik.)</span>
        </label>
        <input
          id="qrisImageUrl"
          type="url"
          value={qrisImageUrl}
          onChange={(e) => setQrisImageUrl(e.target.value)}
          className={inputClass}
          placeholder="contoh: https://picsum.photos/seed/sampleQR/250/250"
        />
      </div>
      
      {qrisImageUrl && (
        <div className="mt-4">
          <p className={labelClass}>Pratinjau Gambar QRIS Saat Ini:</p>
          <div className="p-2 border border-slate-600 rounded-md bg-slate-700 inline-block">
            <img 
                src={qrisImageUrl} 
                alt="Pratinjau QRIS" 
                className="max-w-xs h-auto max-h-60 rounded object-contain" 
                onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const errorMsg = target.parentElement?.querySelector('.qris-error-msg') as HTMLElement;
                    if (errorMsg) errorMsg.style.display = 'block';
                }}
                onLoad={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'block';
                     const errorMsg = target.parentElement?.querySelector('.qris-error-msg') as HTMLElement;
                    if (errorMsg) errorMsg.style.display = 'none';
                }}
            />
            <p className="qris-error-msg text-xs text-red-400 mt-1" style={{display: 'none'}}>Tidak dapat memuat gambar. Periksa URL.</p>
          </div>
           <p className="text-xs text-gray-400 mt-1">Jika gambar tidak termuat, silakan periksa URL dan pastikan dapat diakses publik.</p>
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-105"
      >
        <Cog6ToothIcon className="w-5 h-5 mr-2" />
        Simpan Pengaturan
      </button>
    </div>
  );
};

export default AdminSettingsComponent;