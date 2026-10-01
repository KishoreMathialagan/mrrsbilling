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

  // Circumference of the circle (2 * PI * r)
  const radius = 40;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  const salesDash = (salesPercent / 100) * circumference;
  const purchaseDash = (purchasePercent / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-[#FFF0B3] to-[#FFF9E6] rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-[#FFF9E6] p-5 sm:p-6 lg:p-8 w-full flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h3 className="text-base sm:text-[18px] lg:text-[20px] font-extrabold text-[#111]">Sales & Purchase</h3>
          <p className="text-[10px] sm:text-xs lg:text-sm font-bold text-[#111]/70 mt-1">Sales vs Purchase</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#111]/10 border-none text-[13px] font-bold rounded-xl px-3 py-2 outline-none text-[#111]"
          />
          <span className="text-[#111]/70 font-bold">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#111]/10 border-none text-[13px] font-bold rounded-xl px-3 py-2 outline-none text-[#111]"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 min-h-[200px] w-full">
        {sales === 0 && purchase === 0 ? (
          <div className="text-[#111]/50 font-bold">
            No data for the selected period
          </div>
        ) : (
          <>
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Center Text */}
              <div className="absolute flex flex-col items-center justify-center z-10 pointer-events-none">
                <span className="text-[28px] font-black text-[#111] leading-none">
                  {Math.round(salesPercent)}<span className="text-lg text-[#111]/60">%</span>
                </span>
                <span className="text-[10px] font-bold text-[#111]/50 uppercase tracking-wider mt-1">Sales</span>
              </div>
              
              <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 drop-shadow-xl">
                <defs>
                  <linearGradient id="salesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#3b82f6" // rich blue for purchase
                  strokeWidth={strokeWidth}
                  strokeOpacity="0.25"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="url(#salesGradient)" // vibrant gradient for sales
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${salesDash} ${circumference}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#f43f5e] shadow-sm"></div>
                <div>
                  <div className="text-sm font-bold text-[#111]/70">Sales</div>
                  <div className="text-xl font-black text-[#111]">₹{sales.toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#3b82f6]/30 border border-[#3b82f6]/50"></div>
                <div>
                  <div className="text-sm font-bold text-[#111]/70">Purchase</div>
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
