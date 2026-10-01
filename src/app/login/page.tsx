import { handleLogin } from './actions';
import PasswordInput from './PasswordInput';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen w-screen font-sans bg-white overflow-hidden relative">
      {/* Left Content */}
      <div className="relative z-10 w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 lg:pl-32 lg:py-16 h-screen bg-transparent">
        
        {/* Top: Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img src="/assets/logo.png" alt="MRS Logo" className="h-24 w-auto object-contain" />
        </div>

        {/* Center: Login Form */}
        <div className="w-full max-w-[340px] relative z-10 mt-12 mb-auto">
          
          <h2 className="text-[28px] font-extrabold text-[#111] mb-8">Login</h2>

          {params.error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[13px] font-bold text-center border border-red-100 flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {params.error}
            </div>
          )}
          
          <form action={handleLogin} className="space-y-4">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full px-6 py-3.5 bg-white border-2 border-gray-100 rounded-full text-[13px] font-bold text-[#111] placeholder:font-bold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FFBC11]/30 focus:border-[#FFBC11] transition-all"
                placeholder="User ID"
              />
            </div>
            <div>
              <PasswordInput />
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 mt-8 rounded-full shadow-lg shadow-black/10 text-[13px] font-extrabold text-white bg-[#111] hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all active:scale-[0.98]"
            >
              Sign In to MRS Billing
            </button>
          </form>
        </div>

        {/* Bottom: Footer */}
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 relative z-10 mt-8">
          <div className="flex items-center gap-2 text-[#111]">
            <img src="/assets/logo.png" alt="MRS Logo" className="h-5 w-auto object-contain" />
          </div>
          <span>&copy; {new Date().getFullYear()} MRS Billing</span>
        </div>

      </div>

      {/* Right Content (Image inside a massive circle) */}
      <div className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 translate-x-[20%] w-[110vh] h-[110vh] rounded-full overflow-hidden shadow-2xl bg-[#521320]">
        <img 
          src="/jewelry.jpg" 
          alt="Login Background" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
