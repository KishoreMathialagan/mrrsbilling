import { 
  LayoutGrid, 
  PieChart, 
  Users, 
  FileText, 
  Settings, 
  Search,
  Play,
  Plus,
  Check,
  ChevronDown,
  MoreVertical
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-[230px] flex flex-col py-10 border-r border-gray-100/50 h-screen sticky top-0">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-14 px-8">
          <div className="w-8 h-8 bg-black rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm flex items-center justify-center text-white font-bold text-lg rotate-12">
            <div className="-rotate-12">t.</div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" active />
          <NavItem icon={<PieChart size={20} />} label="Analytics" />
          <NavItem icon={<Users size={20} />} label="Teams" />
          <NavItem icon={<FileText size={20} />} label="Documents" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>
        
        {/* Workspace */}
        <div className="mt-auto px-6">
          <div className="text-xs text-gray-400 font-bold mb-2 ml-2">Workspace</div>
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-full cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black"></div>
              </div>
              <span className="text-[11px] font-bold text-gray-800">Tino Digital Agency</span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col border-r border-gray-100/50 h-screen overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto py-12 px-8 xl:px-12">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-gray-400 font-bold text-[17px] mb-2 tracking-wide">Hello, Jessika!</h2>
            <h1 className="text-[40px] font-extrabold text-[#111] tracking-tight leading-[1.1]">
              You&apos;ve got<br/>8 tasks today 📝
            </h1>
          </div>

          {/* Search */}
          <div className="relative mb-12 w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search something..." 
              className="w-full bg-[#F5F6F8] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFBC11] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* My tasks Header */}
          <div className="mb-4">
            <h2 className="text-[26px] font-extrabold text-[#111]">My tasks</h2>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-6 mb-8">
            <div className="flex flex-col"><button className="text-[13px] font-bold text-[#FFBC11] mb-1">Recently</button><div className="h-0.5 bg-[#FFBC11] w-full rounded-full"></div></div>
            <button className="text-[13px] font-bold text-gray-300 hover:text-gray-500 transition">Today</button>
            <button className="text-[13px] font-bold text-gray-300 hover:text-gray-500 transition">Upcoming</button>
            <button className="text-[13px] font-bold text-gray-300 hover:text-gray-500 transition">Later</button>
          </div>

          {/* Task Cards - Stacked Vertically */}
          <div className="flex flex-col gap-6 w-full max-w-xl relative pb-12">
            {/* Light Card */}
            <div className="w-full bg-white rounded-3xl p-6 shadow-[0_15px_40px_rgb(0,0,0,0.06)] relative border border-gray-50 flex flex-col z-10">
              <button className="absolute top-6 right-5 text-gray-400 hover:text-black">
                <MoreVertical size={20} />
              </button>
              <h3 className="font-extrabold text-[#111] text-[17px] mb-1">Medical LP</h3>
              <p className="text-gray-400 text-xs font-bold mb-6">Make a landing page and mobile app</p>
              
              <div className="mt-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    <Avatar src="https://i.pravatar.cc/100?img=1" />
                    <Avatar src="https://i.pravatar.cc/100?img=2" />
                    <Avatar src="https://i.pravatar.cc/100?img=3" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-[11px] font-extrabold mb-2 text-[#111]">
                    <span>Progress</span>
                    <span className="text-[#FFBC11]">35%</span>
                  </div>
                  <div className="h-[5px] w-full bg-[#F5F6F8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFBC11] rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Card */}
            <div className="w-full bg-[#111] text-white rounded-3xl p-6 shadow-2xl relative flex flex-col z-20 -ml-4">
              <button className="absolute top-6 right-5 text-gray-400 hover:text-white">
                <MoreVertical size={20} />
              </button>
              <h3 className="font-extrabold text-white text-[17px] mb-1">Finance App</h3>
              <p className="text-gray-400 text-xs font-bold mb-6">Branding and mobile app development</p>
              
              <div className="mt-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    <Avatar src="https://i.pravatar.cc/100?img=4" />
                    <Avatar src="https://i.pravatar.cc/100?img=5" />
                    <Avatar src="https://i.pravatar.cc/100?img=6" />
                    <Avatar src="https://i.pravatar.cc/100?img=7" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-[11px] font-extrabold mb-2">
                    <span>Progress</span>
                    <span>60%</span>
                  </div>
                  <div className="h-[5px] w-full bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[380px] flex flex-col py-10 px-10 bg-white z-20 h-screen sticky top-0 overflow-y-auto">
        {/* Profile & Actions */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?img=9" alt="User" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-extrabold text-[15px] text-[#111]">Jessika Smith</div>
              <div className="text-[11px] font-bold text-gray-400">UI/UX Designer</div>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Notifications and Messages removed as requested */}
          </div>
        </div>

        {/* Time Tracker */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center justify-between mb-12">
          <div>
            <div className="font-extrabold text-[15px] text-[#111] mb-1">Project time tracker</div>
            <div className="text-[12px] font-bold text-gray-400">You can start tracking</div>
          </div>
          <button className="w-12 h-12 rounded-xl bg-[#FFBC11] flex items-center justify-center text-white shadow-lg shadow-[#FFBC11]/30 hover:bg-yellow-400 transition-colors">
            <Play size={18} fill="currentColor" className="ml-1 text-[#111]" />
          </button>
        </div>

        {/* Schedule Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-gray-400 text-[13px] font-bold mb-1">April 10, 2020</div>
            <div className="text-[26px] font-extrabold text-[#111]">Today</div>
          </div>
          <button className="bg-[#111] text-white px-5 py-3 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-black transition shadow-lg shadow-black/10">
            <Plus size={16} /> Add task
          </button>
        </div>

        {/* Calendar Dates Grid */}
        <div className="mb-10">
          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className={`text-[10px] font-extrabold ${i === 4 ? 'text-[#111]' : 'text-gray-400'}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['30', '31', '1', '2', '3', '4', '5'].map((date, i) => (
              <div key={date} className={`text-[13px] font-extrabold ${i < 2 ? 'text-gray-300' : 'text-gray-800'}`}>
                {date}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['6', '7', '8', '9', '10', '11', '12'].map((date, i) => (
              <div key={date} className={`text-[13px] font-extrabold flex items-center justify-center ${i === 4 ? 'text-[#FFBC11]' : 'text-gray-800'}`}>
                {date}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline & Meetings */}
        <div className="relative flex-1 -ml-2">
          {/* Vertical Line */}
          <div className="absolute left-[13px] top-2 bottom-0 w-[2px] bg-gray-100">
            <div className="absolute top-0 left-0 w-full h-[65%] bg-[#FFBC11]"></div>
          </div>

          {/* Meeting Item */}
          <div className="relative pl-12 mb-8">
            <div className="absolute left-[7px] top-4 w-[14px] h-[14px] rounded-full bg-white border-[3px] border-[#FFBC11] z-10 shadow-sm ring-4 ring-white"></div>
            
            <div className="bg-[#FFBC11] rounded-[24px] p-5 relative shadow-xl shadow-[#FFBC11]/20">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-extrabold text-[#111] text-[15px]">Meeting</h4>
                <span className="text-[11px] font-bold text-[#111] mt-0.5">9:00 AM</span>
              </div>
              <p className="text-[13px] font-bold text-[#111]/70 mb-5">Discuss team tasks for the day</p>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <Avatar src="https://i.pravatar.cc/100?img=11" />
                  <Avatar src="https://i.pravatar.cc/100?img=12" />
                  <Avatar src="https://i.pravatar.cc/100?img=13" />
                </div>
                <button className="w-8 h-8 rounded-full bg-[#111] text-white flex items-center justify-center shadow-lg shadow-black/20">
                  <Check size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* Next Item */}
          <div className="relative pl-12">
            <div className="absolute left-[7px] top-3 w-[14px] h-[14px] rounded-full bg-white border-[3px] border-gray-200 z-10 ring-4 ring-white"></div>
            
            <div className="py-2">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-extrabold text-[#111] text-[15px]">Icon set</h4>
                <span className="text-[11px] font-bold text-gray-400 mt-0.5">11:00 AM</span>
              </div>
              <p className="text-[13px] font-bold text-gray-400">Edit icons for Navi Project</p>
            </div>
          </div>
        </div>

      </aside>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 py-3 px-4 mx-4 cursor-pointer transition-all ${
      active 
        ? 'bg-[#111] text-white rounded-2xl shadow-md' 
        : 'text-gray-500 hover:text-[#111] hover:bg-gray-50 rounded-2xl'
    }`}>
      <div className={`${active ? 'text-[#FFBC11]' : ''}`}>
        {icon}
      </div>
      <span className="font-bold text-[14px] tracking-wide">{label}</span>
    </div>
  );
}

function Avatar({ src }: { src: string }) {
  return (
    <img src={src} alt="avatar" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
  );
}
