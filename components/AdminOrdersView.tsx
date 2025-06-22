
import React, { useState } from 'react';
import { Order, OrderStatus, CartItem, UploadedFile } from '../types';
import { InboxStackIcon, ChevronDownIcon, ChevronUpIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, CheckCircleIcon as ConfirmPaymentIcon, EyeIcon as DetailEyeIcon, DocumentCheckIcon } from './Icons';
import { formatRupiah } from '../App'; // Impor formatRupiah

interface AdminOrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAdminUploadReport: (orderId: string, file: UploadedFile) => void;
  onAdminConfirmPayment: (orderId: string) => void;
  formatFileSize: (bytes: number) => string;
  downloadFile: (dataUrl: string, filename: string) => void;
}

const OrderStatusBadge: React.FC<{ status: OrderStatus, isTurnitinOrder?: boolean }> = ({ status, isTurnitinOrder }) => {
  let bgColor = 'bg-gray-500'; // Default
  // The status itself will be in Indonesian from types.ts
  if (isTurnitinOrder) {
    switch (status) {
      case 'Menunggu Dokumen': bgColor = 'bg-orange-500'; break;
      case 'Dokumen Dikirim': bgColor = 'bg-cyan-500'; break;
      case 'Dokumen Diproses': bgColor = 'bg-indigo-500'; break;
      case 'Laporan Siap - Menunggu Pembayaran': bgColor = 'bg-purple-500'; break;
      case 'Pembayaran Dikonfirmasi': bgColor = 'bg-lime-500'; break;
      case 'Laporan Diunduh': bgColor = 'bg-green-600'; break;
      case 'Dibatalkan': bgColor = 'bg-red-500'; break;
      default: bgColor = 'bg-slate-500';
    }
  } else {
    if (status === 'Tertunda') bgColor = 'bg-yellow-500';
    else if (status === 'Diproses') bgColor = 'bg-blue-500';
    else if (status === 'Dikirim') bgColor = 'bg-teal-500';
    else if (status === 'Selesai') bgColor = 'bg-green-500';
    else if (status === 'Dibatalkan') bgColor = 'bg-red-500';
  }

  return (
    <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${bgColor}`}>
      {status}
    </span>
  );
};

const OrderItemRow: React.FC<{ item: CartItem }> = ({ item }) => (
    <div className="flex justify-between items-center py-2 px-3 border-b border-slate-600 last:border-b-0">
        <div className="flex items-center">
            <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded mr-3"/>
            <div>
                <p className="text-sm font-medium text-gray-200">{item.name}</p>
                <p className="text-xs text-gray-400">ID: {item.id.substring(0,8)}</p>
            </div>
        </div>
        <div className="text-sm text-gray-300">Jml: {item.quantity}</div>
        <div className="text-sm text-gray-300">@ {formatRupiah(item.price)}</div>
        <div className="text-sm font-semibold text-emerald-400">{formatRupiah(item.price * item.quantity)}</div>
    </div>
);

const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({ orders, onUpdateOrderStatus, onAdminUploadReport, onAdminConfirmPayment, formatFileSize, downloadFile }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [uploadingReportForOrderId, setUploadingReportForOrderId] = useState<string | null>(null);

  const orderStatusesGeneral: OrderStatus[] = ['Tertunda', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
  const orderStatusesTurnitin: OrderStatus[] = ['Menunggu Dokumen', 'Dokumen Dikirim', 'Dokumen Diproses', 'Laporan Siap - Menunggu Pembayaran', 'Pembayaran Dikonfirmasi', 'Laporan Diunduh', 'Dibatalkan'];


  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    if (e.target.files && e.target.files[0]) {
      setReportFile(e.target.files[0]);
      setUploadingReportForOrderId(orderId);
    }
  };

  const handleUploadReport = (orderId: string) => {
    if (!reportFile || uploadingReportForOrderId !== orderId) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const uploadedFile: UploadedFile = {
        name: reportFile.name,
        type: reportFile.type,
        dataUrl: reader.result as string,
        size: reportFile.size,
      };
      onAdminUploadReport(orderId, uploadedFile);
      setReportFile(null);
      setUploadingReportForOrderId(null);
    };
    reader.readAsDataURL(reportFile);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-8">
        <InboxStackIcon className="w-24 h-24 mx-auto text-slate-500 mb-6" />
        <h2 className="text-3xl font-semibold text-gray-200 mb-4">Belum Ada Pesanan</h2>
        <p className="text-gray-400">Saat ini tidak ada pesanan untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 shadow-xl rounded-lg p-6 md:p-8 border border-slate-700">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400 flex items-center">
        <InboxStackIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3" />
        Kelola Pesanan Pelanggan
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID Pesanan</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pelanggan</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tanggal</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {orders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).map((order) => (
              <React.Fragment key={order.id}>
                <tr className={`${expandedOrderId === order.id ? 'bg-slate-700/30' : ''} ${order.isTurnitinOrder ? 'border-l-4 border-purple-500' : ''}`}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 font-mono" title={order.id}>{order.id.substring(0,8)}...</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{order.userEmail}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-emerald-400">{formatRupiah(order.totalAmount)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} isTurnitinOrder={order.isTurnitinOrder} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-600 border border-slate-500 text-gray-200 text-xs rounded-md p-1.5 focus:ring-blue-500 focus:border-blue-500"
                        aria-label={`Perbarui status untuk pesanan ${order.id}`}
                    >
                        {(order.isTurnitinOrder ? orderStatusesTurnitin : orderStatusesGeneral).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <button
                      onClick={() => toggleExpandOrder(order.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-slate-700 rounded-md"
                      title={expandedOrderId === order.id ? "Sembunyikan Detail" : "Tampilkan Detail"}
                      aria-expanded={expandedOrderId === order.id}
                    >
                      {expandedOrderId === order.id ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <div className="bg-slate-700/60 p-4 space-y-4">
                        <div>
                            <h4 className="text-md font-semibold text-gray-100 mb-2">Item Pesanan:</h4>
                            <div className="space-y-1 max-h-60 overflow-y-auto pr-2 rounded bg-slate-800/50 p-2 border border-slate-600">
                                {order.items.map(item => <OrderItemRow key={item.id} item={item} />)}
                            </div>
                        </div>

                        {order.isTurnitinOrder && (
                          <div className="border-t border-slate-600 pt-4 mt-4 space-y-3">
                            <h4 className="text-md font-semibold text-gray-100 mb-2">Detail Layanan Turnitin:</h4>
                            {order.buyerUploadedFile && (
                              <div className="text-sm">
                                <p className="text-gray-300 font-medium">Dokumen Pembeli:</p>
                                <div className="flex items-center space-x-2 mt-1 p-2 bg-slate-600/50 rounded-md">
                                  <DocumentCheckIcon className="w-5 h-5 text-cyan-400" />
                                  <span className="text-gray-200">{order.buyerUploadedFile.name} ({formatFileSize(order.buyerUploadedFile.size)})</span>
                                  <button onClick={() => downloadFile(order.buyerUploadedFile!.dataUrl, order.buyerUploadedFile!.name)}
                                    className="ml-auto p-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md text-xs flex items-center"
                                    title="Unduh Dokumen Pembeli">
                                    <DocumentArrowDownIcon className="w-4 h-4 mr-1"/> Unduh
                                  </button>
                                </div>
                              </div>
                            )}

                            {(order.status === 'Dokumen Dikirim' || order.status === 'Dokumen Diproses') && (
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <label htmlFor={`reportUpload-${order.id}`} className="text-sm text-gray-300 font-medium sr-only">Unggah Laporan:</label>
                                    <input type="file" id={`reportUpload-${order.id}`} 
                                        onChange={(e) => handleReportFileChange(e, order.id)} 
                                        className="block w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer" 
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    {reportFile && uploadingReportForOrderId === order.id && (
                                    <button onClick={() => handleUploadReport(order.id)} 
                                        className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-xs flex items-center whitespace-nowrap">
                                        <DocumentArrowUpIcon className="w-4 h-4 mr-1"/> Konfirmasi Unggah
                                    </button>
                                    )}
                                </div>
                            )}
                             {order.adminUploadedReport && (
                               <div className="text-sm mt-2">
                                <p className="text-gray-300 font-medium">Laporan Turnitin Diunggah:</p>
                                <div className="flex items-center space-x-2 mt-1 p-2 bg-slate-600/50 rounded-md">
                                    <DocumentCheckIcon className="w-5 h-5 text-lime-400" />
                                    <span className="text-gray-200">{order.adminUploadedReport.name} ({formatFileSize(order.adminUploadedReport.size)})</span>
                                    <button onClick={() => downloadFile(order.adminUploadedReport!.dataUrl, order.adminUploadedReport!.name)}
                                        className="ml-auto p-1.5 bg-lime-500 hover:bg-lime-600 text-white rounded-md text-xs flex items-center"
                                        title="Lihat Laporan Admin">
                                        <DocumentArrowDownIcon className="w-4 h-4 mr-1"/> Lihat Laporan
                                    </button>
                                </div>
                               </div>
                            )}

                            {order.status === 'Laporan Siap - Menunggu Pembayaran' && (
                              <button onClick={() => onAdminConfirmPayment(order.id)}
                                className="mt-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs flex items-center">
                                <ConfirmPaymentIcon className="w-4 h-4 mr-1"/> Konfirmasi Pembayaran Diterima
                              </button>
                            )}
                             {order.status === 'Pembayaran Dikonfirmasi' && <p className="text-lime-400 text-sm">Menunggu pembeli mengunduh laporan.</p>}
                             {order.status === 'Laporan Diunduh' && <p className="text-green-400 text-sm">Pembeli telah mengunduh laporan. Pesanan selesai.</p>}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersView;
