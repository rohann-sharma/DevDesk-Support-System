import React from 'react';
import { Search, Bell, ShieldCheck } from 'lucide-react';

interface TopNavProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchSubmit: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ searchTerm, setSearchTerm, onSearchSubmit }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      {/* Quick Search */}
      <div className="relative w-72">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search tickets by title..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all placeholder-slate-400"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Profile & Controls */}
      <div className="flex items-center space-x-4">
        <button
          title="Notifications"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            AD
          </div>
          <div className="text-left hidden md:block">
            <span className="block text-xs font-semibold text-slate-700 leading-none">Support Admin</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center mt-0.5">
              <ShieldCheck className="w-3 h-3 mr-0.5" /> Active Session
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
