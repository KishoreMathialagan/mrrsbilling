import { redirect } from 'next/navigation';
import { logout } from '@/lib/auth';
import { LogOut, ChevronDown } from 'lucide-react';
import { SidebarNav } from '@/components/SidebarNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    'use server';
    await logout();
    redirect('/login');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full lg:w-[320px] flex flex-col py-6 lg:py-10 bg-white z-20 border-b lg:border-b-0 lg:border-r border-gray-100/50 lg:h-screen lg:sticky top-0 print:hidden">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6 lg:mb-10 px-8">
          <img src="/assets/logo.png" alt="MRS Logo" className="h-16 lg:h-20 w-auto object-contain" />
        </div>
        
        {/* Navigation */}
        <SidebarNav />
        
        {/* Bottom Area */}
        <div className="mt-6 lg:mt-auto px-6 mb-4 lg:mb-0">
          <form action={handleLogout}>
            <button type="submit" className="flex items-center w-full px-5 py-4 text-red-500 rounded-2xl hover:bg-red-50 transition-colors font-bold text-[15px]">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen lg:h-screen lg:overflow-y-auto bg-[#F9FAFB] py-6 px-4 lg:py-12 lg:pr-12 lg:pl-6 print:p-0 print:bg-white print:h-auto print:overflow-visible print:block">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
