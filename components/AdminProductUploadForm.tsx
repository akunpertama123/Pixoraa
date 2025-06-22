
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { UploadCloudIcon } from './Icons'; // Removed XCircleIcon

interface AdminProductUploadFormProps {
  initialData?: Product | null;
  onSave: (productData: Product | Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const AdminProductUploadForm: React.FC<AdminProductUploadFormProps> = ({ initialData, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isTurnitinService, setIsTurnitinService] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (isEditing && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price.toString());
      setImageUrl(initialData.imageUrl);
      setIsTurnitinService(initialData.isTurnitinService || false);
    } else {
      // Reset form for adding new product
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setIsTurnitinService(false);
    }
  }, [initialData, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !imageUrl) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Harga harus berupa angka positif.');
      return;
    }
    setError('');
    
    const productData = { name, description, price: priceValue, imageUrl, isTurnitinService };

    if (isEditing && initialData) {
      onSave({ ...productData, id: initialData.id });
    } else {
      onSave(productData);
    }
  };
  
  const inputClass = "w-full px-4 py-3 rounded-md bg-slate-700 border border-slate-600 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 placeholder-gray-500";
  const labelClass = "block mb-2 text-sm font-medium text-gray-300";

  return (
    <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold mb-4 text-gray-100">
        {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md text-sm">{error}</p>}
        <div>
          <label htmlFor="productName" className={labelClass}>Nama Produk</label>
          <input
            id="productName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="contoh: Mouse Nirkabel"
          />
        </div>
        <div>
          <label htmlFor="productDescription" className={labelClass}>Deskripsi</label>
          <textarea
            id="productDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} min-h-[100px]`}
            placeholder="contoh: Mouse nirkabel ergonomis dengan daya tahan baterai lama"
          />
        </div>
        <div>
          <label htmlFor="productPrice" className={labelClass}>Harga (Rp)</label>
          <input
            id="productPrice"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
            placeholder="contoh: 150000"
          />
        </div>
        <div>
          <label htmlFor="productImageUrl" className={labelClass}>URL Gambar</label>
          <input
            id="productImageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClass}
            placeholder="contoh: https://picsum.photos/400/300"
          />
        </div>
        <div className="flex items-center">
          <input
            id="isTurnitinService"
            type="checkbox"
            checked={isTurnitinService}
            onChange={(e) => setIsTurnitinService(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-slate-800"
          />
          <label htmlFor="isTurnitinService" className="ml-2 text-sm font-medium text-gray-300">
            Apakah ini produk layanan Turnitin?
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
                type="button" 
                onClick={onCancel}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-400 transition-all duration-200"
            >
                {/* Using text as XCircleIcon might not exist */}
                Batal
            </button>
            <button 
                type="submit" 
                className="w-full sm:flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
                <UploadCloudIcon className="w-5 h-5 mr-2" />
                {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductUploadForm;
