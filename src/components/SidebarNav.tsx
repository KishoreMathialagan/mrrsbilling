'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ArrowRightLeft, FileText } from 'lucide-react';

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
    { href: '/customers', icon: <Users size={24} />, label: 'Customers' },
    { href: '/transactions', icon: <ArrowRightLeft size={24} />, label: 'Transactions' },
    { href: '/receipts', icon: <FileText size={24} />, label: 'Receipts' },
  ];

  return (
    <nav className="flex-1 px-4 lg:px-6 mb-4 lg:mb-0 overflow-x-auto lg:overflow-x-visible">
      <div className="flex flex-row lg:flex-col gap-2 min-w-max lg:min-w-0 pb-2 lg:pb-0">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center gap-2 lg:gap-4 py-3 lg:py-4 px-4 lg:px-5 cursor-pointer transition-all ${
              active 
                ? 'bg-[#111] text-white rounded-2xl shadow-md' 
                : 'text-gray-500 hover:text-[#111] hover:bg-gray-50 rounded-2xl'
            }`}>
              <div className={`${active ? 'text-[#FFBC11]' : ''}`}>
                {item.icon}
              </div>
              <span className="font-bold text-[14px] lg:text-[16px] tracking-wide">{item.label}</span>
            </div>
          </Link>
        );
      })}
      </div>
    </nav>
  );
}
