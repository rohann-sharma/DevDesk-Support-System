import React from 'react';
import { LayoutDashboard, Ticket, PlusCircle, LifeBuoy, Layers } from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'tickets';
  setCurrentTab: (tab: 'dashboard' | 'tickets') => void;
  openCreateModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, openCreateModal }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">DevDesk</span>
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Support System</span>
          </div>
        </div>
      </div>

      {/* New Ticket Button */}
      <div className="p-4">
        <button
          onClick={openCreateModal}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-md hover:shadow-blue-500/25 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            currentTab === 'dashboard'
              ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('tickets')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            currentTab === 'tickets'
              ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Ticket Manager</span>
        </button>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 border border-slate-700/50">
          <div className="flex items-center space-x-2 text-slate-300 font-medium mb-1">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Developer Portfolio</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Full-stack Express & React TypeScript demo project.
          </p>
        </div>
      </div>
    </aside>
  );
};
