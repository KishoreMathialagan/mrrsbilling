'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, useRef } from 'react';

export default function DashboardAnalytics({ 
  pieData, 
  defaultStart, 
  defaultEnd 
}: { 
  pieData: { sales: number; purchase: number }, 
  defaultStart: string, 
  defaultEnd: string 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || defaultStart);
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || defaultEnd);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    router.push(`?${params.toString()}`);
  }, [startDate, endDate, router]);

  const { sales, purchase } = pieData;
  const total = sales + purchase || 1; // avoid division by zero
  const salesPercent = (sales / total) * 100;
  const purchasePercent = (purchase / total) * 100;
  
  // Circumference of the circle (2 * PI * r), with r=50 it's approx 314.159
  const radius = 30; // 30 + (60/2) = 60
  const circumference = 2 * Math.PI * radius;
  const salesDash = (salesPercent / 100) * circumference;
  const purchaseDash = (purchasePercent / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-50 p-6 sm:p-8 w-full flex flex-col h-full">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#111]">Sales & Purchase</h3>
          <p className="text-xs sm:text-sm font-bold text-gray-400 mt-1">Sales vs Purchase</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-50 border-none text-[13px] font-bold rounded-xl px-3 py-2 outline-none"
          />
          <span className="text-gray-400">to</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-50 border-none text-[13px] font-bold rounded-xl px-3 py-2 outline-none"
          />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 min-h-[200px] w-full">
        {sales === 0 && purchase === 0 ? (
          <div className="text-gray-400 font-bold">
            No data for the selected period
          </div>
        ) : (
          <>
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#3b82f6" // blue for purchase
                  strokeWidth="60"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#a855f7" // purple for sales
                  strokeWidth="60"
                  strokeDasharray={`${salesDash} ${circumference}`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <div>
                  <div className="text-sm font-bold text-gray-400">Sales</div>
                  <div className="text-xl font-black text-[#111]">₹{sales.toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <div>
                  <div className="text-sm font-bold text-gray-400">Purchase</div>
                  <div className="text-xl font-black text-[#111]">₹{purchase.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
