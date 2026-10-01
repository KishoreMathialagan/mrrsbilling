'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardBarChart({ monthlyData, year }: { monthlyData: { month: string, total: number }[], year: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', e.target.value);
    router.push(`?${params.toString()}`);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Fill in missing months with 0
  const dataPoints = months.map((m, i) => {
    const monthNum = (i + 1).toString().padStart(2, '0');
    const match = monthlyData.find(d => d.month === monthNum);
    return match ? match.total : 0;
  });

  const formatCompact = (val: number) => {
    if (val === 0) return '';
    return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(val);
  };

  const maxTotal = Math.max(...dataPoints.map(Math.abs)) || 1; // avoid division by 0

  return (
    <div className="bg-gradient-to-br from-[#FFF0B3] to-[#FFF9E6] rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-[#FFF9E6] p-5 sm:p-6 lg:p-8 w-full flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h3 className="text-base sm:text-[18px] lg:text-[20px] font-extrabold text-[#111]">Revenue</h3>
          <p className="text-[10px] sm:text-xs lg:text-sm font-bold text-[#111]/70 mt-1">Monthly performance</p>
        </div>
        <div className="w-full sm:w-auto flex justify-end">
          <select 
            value={year}
            onChange={handleYearChange}
            className="bg-[#111]/10 border-none text-[12px] sm:text-[13px] font-bold rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-[#111]/20 transition-colors focus:ring-2 focus:ring-[#111]/50 text-[#111]"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>
      
      {/* CSS Bar Chart */}
      <div className="w-full overflow-x-auto overflow-y-hidden pb-2 -mb-2 scrollbar-hide">
        <div className="min-w-[320px] sm:min-w-0 flex-1 h-[200px] w-full flex items-end gap-2 lg:gap-3 mt-4">
        {dataPoints.map((val, i) => {
          const percentage = Math.max((Math.abs(val) / maxTotal) * 85, 2);
          const displayPercentage = val === 0 ? 0 : percentage;
          const isMax = val === maxTotal && val > 0;
          return (
            <div key={i} className="flex-1 flex flex-col justify-end group h-full">
              <div className="relative w-full flex justify-center h-full items-end">
                {/* Permanent Label above bar */}
                <div 
                  className={`absolute text-[9px] sm:text-[10px] font-bold pb-1 pointer-events-none whitespace-nowrap z-10 drop-shadow-md transition-all duration-300 ${val < 0 ? 'text-red-500' : 'text-[#111]'}`}
                  style={{ bottom: `${displayPercentage}%` }}
                >
                  {formatCompact(val)}
                </div>
                {/* Bar */}
                <div 
                  className={`w-full rounded-t-xl transition-all duration-300 ${val < 0 ? 'bg-red-500/80 group-hover:bg-red-500' : (isMax ? 'bg-[#111]' : 'bg-[#FFE375] group-hover:bg-[#FFD233]')}`} 
                  style={{ height: `${displayPercentage}%` }}
                ></div>
              </div>
              <div className="text-center text-[9px] sm:text-[11px] text-[#111]/70 font-extrabold mt-3">
                {months[i]}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
