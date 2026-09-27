import React from 'react';
import { TicketStatus, TicketPriority } from '../types/ticket';

export const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  let badgeStyle = '';
  switch (status) {
    case 'Open':
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'In Progress':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Resolved':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    default:
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'Open' ? 'bg-blue-500' : status === 'In Progress' ? 'bg-amber-500' : 'bg-emerald-500'
      }`}></span>
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
  let badgeStyle = '';
  switch (priority) {
    case 'Low':
      badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
    case 'Medium':
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'High':
      badgeStyle = 'bg-orange-50 text-orange-700 border-orange-200';
      break;
    case 'Critical':
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse';
      break;
    default:
      badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${badgeStyle}`}>
      {priority}
    </span>
  );
};
