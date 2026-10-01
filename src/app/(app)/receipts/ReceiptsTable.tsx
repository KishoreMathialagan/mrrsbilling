'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Printer, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { deleteReceipt } from './actions';
import { useTransition } from 'react';
import FilterBar from '@/components/FilterBar';
import { format } from 'date-fns';

export default function ReceiptsTable({ receipts, defaultSearch, defaultStartDate, defaultEndDate, defaultSort }: { receipts: any[], defaultSearch?: string, defaultStartDate?: string, defaultEndDate?: string, defaultSort?: string }) {
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      startTransition(async () => {
        await deleteReceipt(id);
      });
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedReceipts(receipts.map(r => r.id));
    } else {
      setSelectedReceipts([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedReceipts(prev => [...prev, id]);
    } else {
      setSelectedReceipts(prev => prev.filter(rId => rId !== id));
    }
  };

  const handleSendWhatsApp = () => {
    if (selectedReceipts.length === 0) {
      alert('Please select at least one receipt to share.');
      return;
    }
    const selectedData = receipts.filter(r => selectedReceipts.includes(r.id));
    const receiptToShare = selectedData[0];
    const phone = receiptToShare.customer?.mobile || '';
    if (!phone) {
      alert(`No mobile number found for receipt ${receiptToShare.receiptNumber}.`);
      return;
    }
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.length === 10) formattedPhone = '91' + formattedPhone;
    const message = `Hello ${receiptToShare.customer?.name || 'Customer'}, here are your receipt details from MRS Jewellery:
Receipt No: ${receiptToShare.receiptNumber}
Date: ${format(new Date(receiptToShare.date), 'dd MMM yyyy')}
Total Amount: ₹${receiptToShare.totalAmount.toFixed(2)}

Thank you for choosing MRS.`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    if (selectedData.length > 1) {
      alert('Note: Browser popup blockers prevent opening multiple WhatsApp windows at once. The first selected receipt has been opened.');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
        <button 
          onClick={handleSendWhatsApp}
          className="flex items-center px-5 py-2.5 bg-[#111] text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-black/10"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Send in WhatsApp
        </button>
      </div>

      <FilterBar 
        defaultSearch={defaultSearch} 
        defaultStartDate={defaultStartDate} 
        defaultEndDate={defaultEndDate} 
        defaultSort={defaultSort} 
        searchPlaceholder="Search by receipt number, customer name, mobile..." 
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={receipts.length > 0 && selectedReceipts.length === receipts.length}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Receipt #</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Items</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Total Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right min-w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No receipts found.
                  </td>
                </tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        onChange={(e) => handleSelectOne(e, r.id)} 
                        checked={selectedReceipts.includes(r.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{r.receiptNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{format(new Date(r.date), 'dd MMM yyyy')}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {r.customer?.name || 'Walk-in Customer'}
                      {r.customer?.mobile && <span className="block text-xs text-gray-400">{r.customer.mobile}</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {r.itemNames ? (
                        <span className="block truncate max-w-xs" title={r.itemNames}>{r.itemNames}</span>
                      ) : (
                        <span>{r._count.transactions} items</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold text-right">₹{r.totalAmount.toFixed(2)}</td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/receipts/${r.id}`} className="inline-flex items-center px-2 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                          <Printer className="w-4 h-4 mr-1" />
                          Print
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(r.id)} 
                          disabled={isPending}
                          className="inline-flex items-center px-2 py-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
