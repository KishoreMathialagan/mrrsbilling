import { redirect } from 'next/navigation';
import { logout } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { SidebarNav } from '@/components/SidebarNav';
import MobileNav from '@/components/MobileNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    'use server';
    await logout();
    redirect('/login');
  };

  const LogoutButton = (
    <form action={handleLogout}>
      <button type="submit" className="flex items-center w-full px-5 py-4 text-red-500 rounded-2xl hover:bg-red-50 transition-colors font-bold text-[15px]">
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Mobile Header & Nav */}
      <MobileNav logoutButton={LogoutButton}>
        <SidebarNav />
      </MobileNav>

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-[320px] flex-col py-10 bg-white z-20 border-r border-gray-100/50 h-screen sticky top-0 print:hidden">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10 px-8">
          <img src="/assets/logo.png" alt="MRS Logo" className="h-20 w-auto object-contain" />
        </div>
        
        {/* Navigation */}
        <SidebarNav />
        
        {/* Bottom Area */}
        <div className="mt-auto px-6">
          {LogoutButton}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-[calc(100vh-73px)] lg:min-h-screen lg:h-screen lg:overflow-y-auto bg-[#F9FAFB] py-6 px-4 lg:py-12 lg:pr-12 lg:pl-6 print:p-0 print:bg-white print:h-auto print:overflow-visible print:block">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
