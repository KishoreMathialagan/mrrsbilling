'use client';

export default function ReceiptForm({ 
  customers, 
  saveAction, 
  initialData 
}: { 
  customers: any[], 
  saveAction: (formData: FormData) => void, 
  initialData?: any 
}) {
  return (
    <form action={saveAction} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
          <select name="customerId" required defaultValue={initialData?.customerId || ""} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="">-- Choose a Customer --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.mobile})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
          <input type="number" step="0.01" name="totalAmount" defaultValue={initialData?.totalAmount} required className="block w-full rounded-md border border-gray-300 px-3 py-2 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="0.00" />
          <p className="mt-1 text-sm text-gray-500">In a future update, this will automatically calculate based on selected transactions.</p>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-100 flex justify-end mt-8">
        <button type="submit" className="px-8 py-2.5 bg-[#111] text-white rounded-xl hover:bg-black font-bold shadow-lg shadow-black/10 transition-colors">
          {initialData ? 'Update Receipt' : 'Generate Receipt'}
        </button>
      </div>
    </form>
  );
}
