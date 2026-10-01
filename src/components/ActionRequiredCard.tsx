'use client';

import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { addPendingPayment, markPendingPaymentCompleted } from '@/app/(app)/dashboard/actions';

export default function ActionRequiredCard({ customers, pendingPayments, receipts = [] }: { customers: any[], pendingPayments: any[], receipts?: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for auto-filling
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedReceiptId, setSelectedReceiptId] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [type, setType] = useState('SALE');
  const [dueDate, setDueDate] = useState('');

  const getDaysDiff = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(dateStr);
    target.setHours(0,0,0,0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleOpenModal = () => {
    setSelectedCustomerId('');
    setSelectedReceiptId('');
    setAmount('');
    setReference('');
    setType('SALE');
    setDueDate('');
    setIsModalOpen(true);
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCustomerId(e.target.value);
    setSelectedReceiptId('');
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rId = e.target.value;
    setSelectedReceiptId(rId);
    if (rId) {
      const receipt = receipts.find((r) => r.id === rId);
      if (receipt) {
        setAmount(receipt.totalAmount.toString());
        setReference(receipt.receiptNumber);
        if (receipt.type) setType(receipt.type);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addPendingPayment(formData);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error adding pending payment');
    }
    setIsSubmitting(false);
  };

  const handleComplete = async (id: string) => {
    await markPendingPaymentCompleted(id);
  };

  const filteredReceipts = receipts.filter(r => r.customerId === selectedCustomerId);

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-50 p-5 sm:p-6 lg:p-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <div className="text-gray-400 text-[11px] sm:text-[13px] font-bold mb-1">Pending payments</div>
          <div className="text-lg sm:text-[20px] font-extrabold text-[#111]">Action Required</div>
        </div>
        <button 
          onClick={handleOpenModal}
          className="bg-[#111] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black transition shadow-lg shadow-black/10"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="relative flex-1 ml-2">
        <div className="absolute left-[7px] top-2 bottom-0 w-[2px] bg-gray-100"></div>

        {pendingPayments.length > 0 ? pendingPayments.map((payment, i) => {
          const daysDiff = getDaysDiff(payment.dueDate);
          const isOverdue = daysDiff < 0;
          const isToday = daysDiff === 0;
          
          let dateText = '';
          if (isOverdue) dateText = 'Overdue';
          else if (isToday) dateText = 'Today';
          else dateText = `In ${daysDiff} days`;

          const isUrgent = isOverdue || isToday;
          
          return (
            <div key={payment.id} className="relative pl-10 mb-8 last:mb-2">
              {isUrgent ? (
                <>
                  <div className="absolute left-[7px] top-2 bottom-[-32px] w-[2px] bg-[#FFE375]"></div>
                  <div className="absolute left-[2px] top-4 w-[12px] h-[12px] rounded-full bg-white border-[3px] border-[#FFE375] z-10 shadow-sm ring-4 ring-white"></div>
                </>
              ) : (
                <div className="absolute left-[2px] top-3 w-[12px] h-[12px] rounded-full bg-white border-[3px] border-gray-200 z-10 ring-4 ring-white"></div>
              )}

              <div className={isUrgent ? 'bg-[#FFE375] rounded-[20px] p-5 relative shadow-xl shadow-[#FFE375]/40' : 'py-2'}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-extrabold text-[#111] text-[14px]">{payment.customerName}</h4>
                  <span className={`text-[10px] font-bold mt-0.5 ${isUrgent ? 'text-[#111]' : 'text-gray-400'}`}>
                    {dateText}
                  </span>
                </div>
                <p className={`text-[12px] font-bold mb-4 ${isUrgent ? 'text-[#111]/70' : 'text-gray-400'}`}>
                  {payment.reference ? `${payment.reference} - ` : ''}₹{payment.amount} ({payment.type})
                </p>

                {isUrgent ? (
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center border-2 border-[#FFE375] text-[10px] font-bold text-white">
                      {payment.customerName.substring(0, 2).toUpperCase()}
                    </div>
                    <button 
                      onClick={() => handleComplete(payment.id)}
                      className="h-7 px-3 rounded-full bg-[#111] text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-black/20 hover:bg-black"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleComplete(payment.id)}
                    className="h-7 px-3 rounded-full border border-gray-200 bg-white text-gray-500 text-[10px] font-bold flex items-center justify-center shadow-sm hover:bg-gray-50 mt-2"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="pl-10 py-4 text-sm font-bold text-gray-400">
            No pending payments.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#111] transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-[20px] font-extrabold text-[#111] mb-6">Add Pending Payment</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Customer</label>
                <select 
                  name="customerId" 
                  required 
                  value={selectedCustomerId}
                  onChange={handleCustomerChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-[#111] focus:ring-2 focus:ring-[#FFE375] outline-none"
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {selectedCustomerId && filteredReceipts.length > 0 && (
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Link Receipt (Optional)</label>
                  <select 
                    value={selectedReceiptId}
                    onChange={handleReceiptChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-[#111] focus:ring-2 focus:ring-[#FFE375] outline-none"
                  >
                    <option value="">Select a Receipt...</option>
                    {filteredReceipts.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.receiptNumber} - ₹{r.totalAmount} ({r.type || 'UNKNOWN'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Type</label>
                  <select 
                    name="type" 
                    required 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-[#111] focus:ring-2 focus:ring-[#FFE375] outline-none"
                  >
                    <option value="SALE">SALE</option>
                    <option value="PURCHASE">PURCHASE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="amount" 
                    required 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-[#111] focus:ring-2 focus:ring-[#FFE375] outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Reference / Invoice (Optional)</label>
                <input 
                  type="text" 
                  name="reference" 
                  placeholder="e.g. Inv #10042" 
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-[#111] focus:ring-2 focus:ring-[#FFE375] outline-none" 
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  name="dueDate" 
                  required 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[13px] font-bold text-[#111] focus:ring-2 focus:ring-[#FFE375] outline-none" 
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#111] text-white rounded-xl text-[13px] font-bold shadow-lg shadow-black/10 hover:bg-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? 'Saving...' : <><Check size={16} /> Save Payment</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
