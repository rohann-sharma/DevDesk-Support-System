import React, { useEffect, useState } from 'react';
import { ticketApi } from '../api/ticketApi';
import { StatsResponse, Ticket } from '../types/ticket';
import { StatsOverview } from '../components/StatsOverview';
import { TicketChart } from '../components/TicketChart';
import { TicketTable } from '../components/TicketTable';
import { Loader2, Plus, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onViewTicket: (id: string) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticket: Ticket) => void;
  openCreateModal: () => void;
  goToTicketList: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  openCreateModal,
  goToTicketList,
}) => {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await ticketApi.getStats();
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading system overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center my-8">
        <p className="text-sm font-semibold text-rose-700 mb-2">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of active support requests and team metrics
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Stats Cards */}
      {data && <StatsOverview stats={data.stats} />}

      {/* Grid Section: Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Status Breakdown Chart */}
        <div className="lg:col-span-1">
          {data && <TicketChart data={data.statusBreakdown} />}
        </div>

        {/* Recently Created Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">Recently Created Tickets</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest support requests needing review</p>
            </div>
            <button
              onClick={goToTicketList}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 hover:underline"
            >
              <span>View All Tickets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {data && (
            <TicketTable
              tickets={data.recentTickets}
              onView={onViewTicket}
              onEdit={onEditTicket}
              onDelete={onDeleteTicket}
            />
          )}
        </div>
      </div>
    </div>
  );
};
