'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      router.push(`/dashboard?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [query, router, searchParams]);

  return (
    <>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input 
        type="text" 
        placeholder="Search..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white border border-gray-100 shadow-sm rounded-full py-3 pl-12 pr-4 text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFE375] transition-all placeholder:text-gray-400"
      />
    </>
  );
}

export default function DashboardSearch() {
  return (
    <div className="relative w-64">
      <Suspense fallback={
        <>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white border border-gray-100 shadow-sm rounded-full py-3 pl-12 pr-4 text-[13px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFE375] transition-all placeholder:text-gray-400"
            readOnly
          />
        </>
      }>
        <SearchInput />
      </Suspense>
    </div>
  );
}
