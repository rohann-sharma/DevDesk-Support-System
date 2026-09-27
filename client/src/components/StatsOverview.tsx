import React from 'react';
import { TicketStats } from '../types/ticket';
import { Ticket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatsOverviewProps {
  stats: TicketStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Total Tickets',
      value: stats.total,
      icon: Ticket,
      borderColor: 'border-l-slate-600',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-900',
    },
    {
      label: 'Open Tickets',
      value: stats.open,
      icon: AlertCircle,
      borderColor: 'border-l-blue-600',
      bgColor: 'bg-blue-50/50',
      textColor: 'text-blue-700',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      borderColor: 'border-l-amber-500',
      bgColor: 'bg-amber-50/50',
      textColor: 'text-amber-700',
    },
    {
      label: 'Resolved Tickets',
      value: stats.resolved,
      icon: CheckCircle2,
      borderColor: 'border-l-emerald-500',
      bgColor: 'bg-emerald-50/50',
      textColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-xl border border-slate-200 border-l-4 ${card.borderColor} p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
                <p className={`text-3xl font-bold mt-1.5 ${card.textColor}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor} ${card.textColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
