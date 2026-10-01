'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

export default function TransactionForm({
  customers,
  saveAction,
  defaultCustomerId,
  defaultType,
  initialData,
  returnTo = '/transactions'
}: {
  customers: { id: string, name: string, mobile: string }[],
  saveAction: (formData: FormData) => Promise<void>,
  defaultCustomerId?: string,
  defaultType?: string,
  initialData?: any,
  returnTo?: string
}) {
  const [items, setItems] = useState<any[]>(initialData ? [initialData] : [{
    id: Date.now().toString(),
    itemName: '',
    weight: '',
    touch: '',
    wastage: '',
    makerCharge: '',
    remark: ''
  }]);

  const [gstEnabled, setGstEnabled] = useState<boolean>(initialData?.gstEnabled || false);
  const [date, setDate] = useState<string>(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  
  // Searchable dropdown state
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(defaultCustomerId || (initialData?.customerId || ''));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCustomerId && customers) {
      const c = customers.find(c => c.id === selectedCustomerId);
      if (c) {
        setCustomerSearch(`${c.name} (${c.mobile})`);
      }
    }
  }, [selectedCustomerId, customers]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCustomerDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.mobile.includes(customerSearch)
  );

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString() + Math.random(),
      itemName: '',
      weight: '',
      touch: '',
      wastage: '',
      makerCharge: '',
      remark: ''
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateItemValues = (item: any) => {
    const w = Number(item.weight) || 0;
    const t = Number(item.touch) || 0;
    const wst = Number(item.wastage) || 0;
    const mc = Number(item.makerCharge) || 0;
    
    let pure = 0;
    let gValue = 0;
    let fp = 0;

    if (w > 0) {
      pure = w * (t + wst) / 100;
      gValue = w * mc;
      fp = gstEnabled ? gValue * 1.18 : gValue;
    }

    return {
      pure: pure ? pure.toFixed(3) : '',
      gValue: gValue ? gValue.toFixed(2) : '',
      fp: fp ? fp.toFixed(2) : ''
    };
  };

  let grandTotal = 0;

  return (
    <form action={saveAction} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <input type="hidden" name="returnTo" value={returnTo} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <div className="md:col-span-2 relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
          <input type="hidden" name="customerId" value={selectedCustomerId} />
          
          <div className="relative">
            <input 
              ref={inputRef}
              type="text" 
              required
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setSelectedCustomerId('');
                e.target.setCustomValidity('Please select a customer from the dropdown.');
                setIsCustomerDropdownOpen(true);
              }}
              onFocus={() => setIsCustomerDropdownOpen(true)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
              placeholder="Search customer by name or mobile..." 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {isCustomerDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(c => (
                  <div 
                    key={c.id} 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col"
                    onClick={() => {
                      setSelectedCustomerId(c.id);
                      setCustomerSearch(`${c.name} (${c.mobile})`);
                      setIsCustomerDropdownOpen(false);
                      if (inputRef.current) {
                        inputRef.current.setCustomValidity('');
                      }
                    }}
                  >
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <span className="text-xs text-gray-500">{c.mobile}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No customers found.</div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select name="type" required defaultValue={initialData?.type || defaultType || "SALE"} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="SALE">Sale</option>
            <option value="PURCHASE">Purchase</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" name="date" required value={date} onChange={e => setDate(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        
      </div>
      
      {/* ITEMS LOOP */}
      <div className="space-y-8">
        {items.map((item, index) => {
          const { pure, gValue, fp } = calculateItemValues(item);
          if (fp) grandTotal += parseFloat(fp);

          return (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 relative">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Item #{index + 1}</h3>
                {!initialData && items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input type="text" name="itemName[]" required value={item.itemName} onChange={e => updateItem(index, 'itemName', e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Gold Ring 22K" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (Kg)</label>
                  <input type="number" step="0.001" name="weight[]" required value={item.weight} onChange={e => updateItem(index, 'weight', e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="0.000" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Touch (%)</label>
                  <input type="number" step="0.01" name="touch[]" required value={item.touch} onChange={e => updateItem(index, 'touch', e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wastage (%)</label>
                  <input type="number" step="0.01" name="wastage[]" required value={item.wastage} onChange={e => updateItem(index, 'wastage', e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maker charge per Kg</label>
                  <input type="number" step="0.01" name="makerCharge[]" required value={item.makerCharge} onChange={e => updateItem(index, 'makerCharge', e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="0.00" />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pure (Auto-Calculated)</label>
                    <input type="number" step="0.001" name="pure[]" value={pure} readOnly className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:outline-none" placeholder="0.000" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maker charge (Auto-Calculated)</label>
                    <input type="number" step="0.001" name="G[]" value={gValue} readOnly className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 focus:outline-none" placeholder="0.00" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remark (Optional)</label>
                  <textarea name="remark[]" value={item.remark} onChange={e => updateItem(index, 'remark', e.target.value)} rows={2} className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Add any remarks here..."></textarea>
                </div>
                
                {/* Hidden input for this item's final price */}
                <input type="hidden" name="finalPrice[]" value={fp} />
              </div>
            </div>
          );
        })}
      </div>
      
      {!initialData && (
        <div className="mt-4">
          <button type="button" onClick={addItem} className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5 mr-1" />
            Add More Items
          </button>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <input 
              type="checkbox" 
              id="gstEnabled" 
              name="gstEnabled" 
              checked={gstEnabled} 
              onChange={e => setGstEnabled(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="gstEnabled" className="text-sm font-medium text-gray-700 cursor-pointer">
              Apply 18% GST to all items
            </label>
          </div>
          
          <div className="text-right bg-gray-50 px-6 py-4 rounded-xl border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Grand Total {gstEnabled ? '(incl. 18% GST)' : '(excl. GST)'}</p>
            <p className="text-3xl font-bold text-gray-900">₹{grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="pt-6 mt-6 flex justify-end">
        <button type="submit" className="px-8 py-2.5 bg-[#111] text-white rounded-xl hover:bg-black font-bold shadow-lg shadow-black/10 transition-colors text-lg">
          {initialData ? 'Update Transaction' : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
}
