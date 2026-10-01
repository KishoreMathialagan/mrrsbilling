'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        required
        className="block w-full pl-6 pr-12 py-3.5 bg-white border-2 border-gray-100 rounded-full text-[13px] font-bold text-[#111] placeholder:font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FFBC11]/30 focus:border-[#FFBC11] transition-all"
        placeholder="Password"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}
