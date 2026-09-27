import React, { useEffect, useState } from 'react';
import { ticketApi } from '../api/ticketApi';
import { Ticket } from '../types/ticket';
import { TicketTable } from '../components/TicketTable';
import { Search, Plus, RotateCcw, Filter, ArrowUpDown, Loader2 } from 'lucide-react';

interface TicketListProps {
  onViewTicket: (id: string) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticket: Ticket) => void;
  openCreateModal: () => void;
  initialSearch?: string;
}

export const TicketList: React.FC<TicketListProps> = ({
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  openCreateModal,
  initialSearch = '',
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await ticketApi.getTickets({
        search,
        status,
        priority,
        category,
        sortBy,
        sortOrder,
      });
      setTickets(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch ticket records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, priority, category, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setCategory('All');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const handleQuickStatusChange = async (id: string, newStatus: any) => {
    try {
      await ticketApi.updateTicket(id, { status: newStatus });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ticket Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Search, filter, edit, and track resolution status across all support issues.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Control Bar: Search & Filter Inputs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Search</span>
          </button>
        </form>

        {/* Filter Badges & Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-slate-500 font-medium space-x-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters:</span>
            </div>

            {/* Status Select */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Priority Select */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Category Select */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Bug">Bug</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Billing">Billing</option>
              <option value="Technical Support">Technical Support</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-slate-500 font-medium space-x-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span>Sort:</span>
            </div>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="priority-desc">Highest Priority</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>

            <button
              onClick={handleResetFilters}
              title="Reset All Filters"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Fetching tickets...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center">
          <p className="text-sm font-semibold text-rose-700 mb-2">{error}</p>
          <button
            onClick={fetchTickets}
            className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-500"
          >
            Retry
          </button>
        </div>
      ) : (
        <TicketTable
          tickets={tickets}
          onView={onViewTicket}
          onEdit={onEditTicket}
          onDelete={onDeleteTicket}
          onQuickStatusChange={handleQuickStatusChange}
        />
      )}
    </div>
  );
};
