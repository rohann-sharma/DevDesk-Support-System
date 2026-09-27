import React, { useEffect, useState } from 'react';
import { ticketApi } from '../api/ticketApi';
import { Ticket, TicketStatus } from '../types/ticket';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { ArrowLeft, Clock, Calendar, Edit3, Trash2, Tag, CheckCircle, CircleAlert, Loader2 } from 'lucide-react';

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticket: Ticket) => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({
  ticketId,
  onBack,
  onEditTicket,
  onDeleteTicket,
}) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await ticketApi.getTicketById(ticketId);
      setTicket(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket || ticket.status === newStatus) return;
    try {
      setUpdatingStatus(true);
      const res = await ticketApi.updateTicket(ticket._id, { status: newStatus });
      setTicket(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center my-8">
        <p className="text-sm font-semibold text-rose-700 mb-2">{error || 'Ticket not found'}</p>
        <button
          onClick={onBack}
          className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ticket Manager</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEditTicket(ticket)}
            className="inline-flex items-center space-x-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm transition-all"
          >
            <Edit3 className="w-4 h-4 text-amber-600" />
            <span>Edit Ticket</span>
          </button>
          <button
            onClick={() => onDeleteTicket(ticket)}
            className="inline-flex items-center space-x-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Ticket Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Content & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="text-xs font-medium text-slate-500 flex items-center bg-slate-100 px-2.5 py-0.5 rounded-md">
                <Tag className="w-3 h-3 mr-1" />
                {ticket.category}
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 leading-snug">{ticket.title}</h1>

            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-lg border border-slate-100 font-normal">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-800">Activity Timeline</h3>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {ticket.timeline && ticket.timeline.length > 0 ? (
                ticket.timeline.map((log, index) => (
                  <div key={log._id || index} className="relative group">
                    {/* Circle Node */}
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></span>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{log.action}</span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        {new Date(log.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {log.details && (
                        <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Status Changer & Metadata Sidebar */}
        <div className="space-y-6">
          {/* Quick Status Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Update Ticket Status</h3>
            <div className="space-y-2">
              {(['Open', 'In Progress', 'Resolved'] as TicketStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  disabled={updatingStatus}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                    ticket.status === st
                      ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {st === 'Resolved' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : st === 'In Progress' ? (
                      <Clock className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CircleAlert className="w-4 h-4 text-blue-600" />
                    )}
                    <span>{st}</span>
                  </div>
                  {ticket.status === st && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Metadata Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Ticket Information</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold text-slate-500">Ticket ID</span>
                <span className="font-mono text-slate-700 text-[11px] bg-slate-100 px-2 py-0.5 rounded">{ticket._id}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold text-slate-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Created
                </span>
                <span className="text-slate-700">
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" /> Last Updated
                </span>
                <span className="text-slate-700">
                  {new Date(ticket.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
