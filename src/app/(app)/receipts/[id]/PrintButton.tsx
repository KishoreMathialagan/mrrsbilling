'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black font-medium shadow-sm transition-colors"
    >
      <Printer className="w-5 h-5 mr-2" />
      Print / Save as PDF
    </button>
  );
}
