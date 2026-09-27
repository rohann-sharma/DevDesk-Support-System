import React from 'react';
import { Ticket } from '../types/ticket';
import { StatusBadge, PriorityBadge } from './Badges';
import { Eye, Edit3, Trash2, ArrowUpRight } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  onView: (id: string) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  onQuickStatusChange?: (id: string, newStatus: any) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onView,
  onEdit,
  onDelete,
  onQuickStatusChange
}) => {
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
          <ArrowUpRight className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-700">No Tickets Found</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No support tickets match your active filter and search options. Try clearing your filters or create a new ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              <th className="px-6 py-3.5">Ticket Title & Category</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Priority</th>
              <th className="px-4 py-3.5">Created Date</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <button
                      onClick={() => onView(ticket._id)}
                      className="text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {ticket.title}
                    </button>
                    <span className="text-xs text-slate-400 mt-0.5 font-medium">
                      {ticket.category}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  {onQuickStatusChange ? (
                    <select
                      value={ticket.status}
                      onChange={(e) => onQuickStatusChange(ticket._id, e.target.value)}
                      className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer rounded px-1 py-0.5 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    <StatusBadge status={ticket.status} />
                  )}
                </td>

                <td className="px-4 py-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>

                <td className="px-4 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>

                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(ticket._id)}
                      title="View Details"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(ticket)}
                      title="Edit Ticket"
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(ticket)}
                      title="Delete Ticket"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
