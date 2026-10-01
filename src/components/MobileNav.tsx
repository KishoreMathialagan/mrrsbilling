'use client';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MobileNav({ children, logoutButton }: { children: React.ReactNode, logoutButton: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="flex lg:hidden items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-40 print:hidden">
        <img src="/assets/logo.png" alt="MRS Logo" className="h-10 w-auto object-contain" />
        <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 text-[#111] hover:bg-gray-100 rounded-lg transition-colors">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-sm flex justify-end">
          <div 
            className="w-[280px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <span className="font-bold text-xl text-[#111]">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-gray-500 hover:text-black bg-gray-50 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6">
              {children}
            </div>
            
            <div className="p-6 border-t border-gray-100">
              {logoutButton}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
