
import React, { useState } from 'react';
import { Order, UploadedFile, OrderStatus } from '../types';
import { 
    ClipboardDocumentListIcon, DocumentArrowUpIcon, DocumentArrowDownIcon, 
    CreditCardIcon, CheckCircleIcon, InformationCircleIcon, 
    ChevronDownIcon, ChevronUpIcon, EyeIcon, ShoppingBagIcon, ArrowUturnLeftIcon, ExclamationTriangleIcon
} from './Icons';
import { formatRupiah } from '../App'; // Impor formatRupiah

interface BuyerOrdersViewProps {
  orders: Order[];
  onBuyerUploadDocument: (orderId: string, file: UploadedFile) => void;
  onReportDownloaded: (orderId: string) => void;
  formatFileSize: (bytes: number) => string;
  downloadFile: (dataUrl: string, filename: string) => void;
  onNavigateToShop: () => void; // For "Continue Shopping" button
}

const OrderStatusInfo: React.FC<{ status: OrderStatus, isTurnitinOrder?: boolean }> = ({ status, isTurnitinOrder }) => {
    let bgColor = 'bg-gray-500';
    let textColor = 'text-white';
    // Status will be in Indonesian from types.ts

    if (isTurnitinOrder) {
        switch (status) {
            case 'Menunggu Dokumen': bgColor = 'bg-orange-500/20'; textColor = 'text-orange-300'; break;
            case 'Dokumen Dikirim': bgColor = 'bg-cyan-500/20'; textColor = 'text-cyan-300'; break;
            case 'Dokumen Diproses': bgColor = 'bg-indigo-500/20'; textColor = 'text-indigo-300'; break;
            case 'Laporan Siap - Menunggu Pembayaran': bgColor = 'bg-purple-500/20'; textColor = 'text-purple-300'; break;
            case 'Pembayaran Dikonfirmasi': bgColor = 'bg-lime-500/20'; textColor = 'text-lime-300'; break;
            case 'Laporan Diunduh': bgColor = 'bg-green-500/20'; textColor = 'text-green-300'; break;
            case 'Dibatalkan': bgColor = 'bg-red-500/20'; textColor = 'text-red-300'; break;
            default: bgColor = 'bg-slate-600'; textColor = 'text-slate-100';
        }
    } else {
        switch (status) {
            case 'Tertunda': bgColor = 'bg-yellow-500/20'; textColor = 'text-yellow-300'; break;
            case 'Diproses': bgColor = 'bg-blue-500/20'; textColor = 'text-blue-300'; break;
            case 'Dikirim': bgColor = 'bg-teal-500/20'; textColor = 'text-teal-300'; break;
            case 'Selesai': bgColor = 'bg-green-500/20'; textColor = 'text-green-300'; break;
            case 'Dibatalkan': bgColor = 'bg-red-500/20'; textColor = 'text-red-300'; break;
            default: bgColor = 'bg-slate-600'; textColor = 'text-slate-100';
        }
    }
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
            {status}
        </span>
    );
};

const OrderItemCard: React.FC<{item: Order['items'][0]}> = ({item}) => (
    <div className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-md border border-slate-600">
        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-slate-500" />
        <div className="flex-grow">
            <h4 className="text-md font-semibold text-gray-100">{item.name}</h4>
            <p className="text-sm text-gray-400">Jml: {item.quantity}</p>
            <p className="text-sm text-gray-400">Harga: {formatRupiah(item.price)}</p>
        </div>
        <p className="text-md font-semibold text-emerald-400">{formatRupiah(item.price * item.quantity)}</p>
    </div>
);

const BuyerOrdersView: React.FC<BuyerOrdersViewProps> = ({ orders, onBuyerUploadDocument, onReportDownloaded, formatFileSize, downloadFile, onNavigateToShop }) => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadingForOrderId, setUploadingForOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [paymentNotified, setPaymentNotified] = useState<{[orderId: string]: boolean}>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
      setUploadingForOrderId(orderId);
    } else {
      setDocumentFile(null);
      setUploadingForOrderId(null);
    }
  };

  const handleUploadDocument = (orderId: string) => {
    if (!documentFile || uploadingForOrderId !== orderId) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const uploadedFile: UploadedFile = {
        name: documentFile.name,
        type: documentFile.type,
        dataUrl: reader.result as string,
        size: documentFile.size,
      };
      onBuyerUploadDocument(orderId, uploadedFile);
      setDocumentFile(null);
      setUploadingForOrderId(null);
    };
    reader.readAsDataURL(documentFile);
  };

  const handleDownloadReport = (order: Order) => {
    if (order.adminUploadedReport) {
      downloadFile(order.adminUploadedReport.dataUrl, order.adminUploadedReport.name);
      onReportDownloaded(order.id);
    }
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  const handlePaymentNotified = (orderId: string) => {
    setPaymentNotified(prev => ({...prev, [orderId]: true}));
    // Potentially, this could also update an order status to "Payment Notified"
    // For now, it's a client-side UX update.
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-8">
        <ShoppingBagIcon className="w-24 h-24 mx-auto text-slate-500 mb-6" />
        <h2 className="text-3xl font-semibold text-gray-200 mb-4">Belum Ada Pesanan</h2>
        <p className="text-gray-400 mb-8">Anda belum melakukan pesanan. Saatnya berbelanja!</p>
        <button
          onClick={onNavigateToShop}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />
          Lanjut Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 shadow-xl rounded-lg p-4 sm:p-6 md:p-8 border border-slate-700">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center">
        <ClipboardDocumentListIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3" />
        Pesanan Saya
      </h2>
      <div className="space-y-6">
        {orders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map((order) => (
          <div key={order.id} className={`bg-slate-700/40 rounded-lg shadow-lg border ${order.isTurnitinOrder ? 'border-purple-500/50' : 'border-slate-600'}`}>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center ">
                <div className="mb-3 sm:mb-0">
                    <p className="text-xs text-gray-400 font-mono">ID Pesanan: {order.id}</p>
                    <p className="text-md text-gray-300">Tanggal: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p className="text-lg font-semibold text-emerald-300">Total: {formatRupiah(order.totalAmount)}</p>
                </div>
                <div className="flex flex-col items-start sm:items-end space-y-2">
                     <OrderStatusInfo status={order.status} isTurnitinOrder={order.isTurnitinOrder} />
                     <button
                        onClick={() => toggleExpandOrder(order.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-slate-600 rounded-md text-xs flex items-center"
                        title={expandedOrderId === order.id ? "Sembunyikan Detail" : "Tampilkan Detail"}
                        aria-expanded={expandedOrderId === order.id}
                        >
                        {expandedOrderId === order.id ? <ChevronUpIcon className="w-4 h-4 mr-1" /> : <ChevronDownIcon className="w-4 h-4 mr-1" />}
                        Detail
                    </button>
                </div>
            </div>

            {expandedOrderId === order.id && (
                 <div className="border-t border-slate-600 p-4 space-y-4">
                    <h4 className="text-md font-semibold text-gray-100 mb-2">Item dalam pesanan ini:</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {order.items.map(item => <OrderItemCard key={item.id} item={item}/> )}
                    </div>
                 
                    {order.isTurnitinOrder && (
                    <div className="border-t border-slate-500 pt-4 mt-4 space-y-3">
                        <h4 className="text-md font-semibold text-gray-100 mb-1">Aksi Layanan Turnitin:</h4>
                        
                        {order.status === 'Menunggu Dokumen' && (
                        <div className="p-3 bg-slate-600/50 rounded-md border border-slate-500">
                            <p className="text-sm text-orange-300 mb-2 flex items-center"><InformationCircleIcon className="w-5 h-5 mr-2"/>Silakan unggah dokumen Anda untuk diproses.</p>
                            <input type="file" id={`docUpload-${order.id}`} 
                                onChange={(e) => handleFileChange(e, order.id)} 
                                className="block w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer mb-2"
                                accept=".doc,.docx,.pdf" 
                            />
                            {documentFile && uploadingForOrderId === order.id && (
                            <button onClick={() => handleUploadDocument(order.id)} 
                                className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium flex items-center justify-center">
                                <DocumentArrowUpIcon className="w-5 h-5 mr-2"/>Unggah Dokumen
                            </button>
                            )}
                        </div>
                        )}

                        {order.buyerUploadedFile && (order.status === 'Dokumen Dikirim' || order.status === 'Dokumen Diproses') && (
                             <div className="p-3 bg-slate-600/50 rounded-md border border-slate-500 text-sm text-cyan-300 flex items-center">
                                <InformationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0"/>
                                <span>Dokumen Anda ({order.buyerUploadedFile.name} - {formatFileSize(order.buyerUploadedFile.size)}) telah dikirim dan sedang diproses oleh admin.</span>
                            </div>
                        )}

                        {order.status === 'Laporan Siap - Menunggu Pembayaran' && (
                        <div className="p-3 bg-slate-600/50 rounded-md border border-slate-500 space-y-3">
                            <p className="text-sm text-purple-300 flex items-center"><InformationCircleIcon className="w-5 h-5 mr-2"/>Laporan Turnitin Anda sudah siap!</p>
                            <p className="text-sm text-gray-200">Silakan lakukan pembayaran sebesar <strong className="text-emerald-300">{formatRupiah(order.totalAmount)}</strong> menggunakan kode QRIS di bawah ini. Setelah pembayaran, admin akan mengonfirmasinya untuk membuka akses unduh laporan Anda.</p>
                            {order.qrisImageUrlForOrder ? (
                                <div className="my-2 p-2 border border-slate-500 rounded-md bg-slate-700 inline-block">
                                <img src={order.qrisImageUrlForOrder} alt="Pembayaran QRIS" className="max-w-xs h-auto max-h-60 rounded" />
                                </div>
                            ) : (
                                <p className="text-sm text-red-400 flex items-center"><ExclamationTriangleIcon className="w-5 h-5 mr-2"/>Gambar QRIS tidak tersedia. Silakan hubungi admin.</p>
                            )}
                            {!paymentNotified[order.id] ? (
                                <button 
                                    onClick={() => handlePaymentNotified(order.id)}
                                    className="w-full sm:w-auto px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-sm font-medium flex items-center justify-center">
                                    <CreditCardIcon className="w-5 h-5 mr-2"/>Saya Sudah Bayar
                                </button>
                            ) : (
                                 <p className="text-sm text-green-400 flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2"/>Admin telah diberitahu. Mohon tunggu konfirmasi.</p>
                            )}
                        </div>
                        )}

                        {order.status === 'Pembayaran Dikonfirmasi' && order.adminUploadedReport && (
                        <div className="p-3 bg-slate-600/50 rounded-md border border-slate-500">
                            <p className="text-sm text-lime-300 mb-2 flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2"/>Pembayaran dikonfirmasi! Anda sekarang dapat mengunduh laporan Anda.</p>
                             <p className="text-xs text-gray-300 mb-2">Laporan: {order.adminUploadedReport.name} ({formatFileSize(order.adminUploadedReport.size)})</p>
                            <button onClick={() => handleDownloadReport(order)}
                                className="w-full sm:w-auto px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-md text-sm font-medium flex items-center justify-center">
                                <DocumentArrowDownIcon className="w-5 h-5 mr-2"/>Unduh Laporan
                            </button>
                        </div>
                        )}
                        {order.status === 'Laporan Diunduh' && (
                             <div className="p-3 bg-slate-600/50 rounded-md border border-slate-500 text-sm text-green-300 flex items-center">
                                <CheckCircleIcon className="w-5 h-5 mr-2"/>Laporan diunduh. Pesanan ini selesai.
                            </div>
                        )}
                    </div>
                    )}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerOrdersView;
