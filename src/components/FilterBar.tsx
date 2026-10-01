'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';

export default function FilterBar({
  defaultSearch = '',
  defaultStartDate = '',
  defaultEndDate = '',
  defaultSort = 'desc',
  searchPlaceholder = 'Search...'
}: {
  defaultSearch?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultSort?: string;
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(defaultSearch);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [sortOrder, setSortOrder] = useState(defaultSort);

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const handler = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (search) params.set('search', search); else params.delete('search');
      if (startDate) params.set('startDate', startDate); else params.delete('startDate');
      if (endDate) params.set('endDate', endDate); else params.delete('endDate');
      params.set('sort', sortOrder);
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [search, startDate, endDate, sortOrder, pathname, router]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-50">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-100 shadow-sm rounded-full py-3 pl-12 pr-4 text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFE375] transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-white border border-gray-100 shadow-sm rounded-full px-4 py-3 text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFE375] transition-all"
        />
        <span className="text-gray-400 text-[13px] font-bold px-1">to</span>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-white border border-gray-100 shadow-sm rounded-full px-4 py-3 text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFE375] transition-all"
        />
        <button 
          type="button" 
          onClick={() => {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
          }}
          className="flex items-center px-5 py-3 bg-white border border-gray-100 shadow-sm text-[#111] rounded-full hover:bg-gray-50 text-[13px] font-bold transition-colors"
        >
          {sortOrder === 'desc' ? <ArrowDownWideNarrow className="w-4 h-4 mr-2"/> : <ArrowUpNarrowWide className="w-4 h-4 mr-2"/>}
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>
    </div>
  );
}
