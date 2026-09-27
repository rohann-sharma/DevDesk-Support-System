import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './views/Dashboard';
import { TicketList } from './views/TicketList';
import { TicketDetail } from './views/TicketDetail';
import { TicketFormModal } from './components/TicketFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Ticket } from './types/ticket';
import { ticketApi } from './api/ticketApi';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tickets'>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicket, setDeletingTicket] = useState<Ticket | null>(null);

  // Search State for top bar search action
  const [globalSearch, setGlobalSearch] = useState('');

  // Handlers
  const handleViewTicket = (id: string) => {
    setSelectedTicketId(id);
  };

  const handleBackFromDetail = () => {
    setSelectedTicketId(null);
  };

  const handleGlobalSearchSubmit = () => {
    setSelectedTicketId(null);
    setCurrentTab('tickets');
  };

  const handleCreateSubmit = async (data: any) => {
    await ticketApi.createTicket(data);
    // Refresh active view
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingTicket) return;
    await ticketApi.updateTicket(editingTicket._id, data);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTicket) return;
    await ticketApi.deleteTicket(deletingTicket._id);
    if (selectedTicketId === deletingTicket._id) {
      setSelectedTicketId(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Inter',sans-serif]">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedTicketId(null);
          setCurrentTab(tab);
        }}
        openCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Right Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNav
          searchTerm={globalSearch}
          setSearchTerm={setGlobalSearch}
          onSearchSubmit={handleGlobalSearchSubmit}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
          {selectedTicketId ? (
            <TicketDetail
              ticketId={selectedTicketId}
              onBack={handleBackFromDetail}
              onEditTicket={(ticket) => setEditingTicket(ticket)}
              onDeleteTicket={(ticket) => setDeletingTicket(ticket)}
            />
          ) : currentTab === 'dashboard' ? (
            <Dashboard
              onViewTicket={handleViewTicket}
              onEditTicket={(ticket) => setEditingTicket(ticket)}
              onDeleteTicket={(ticket) => setDeletingTicket(ticket)}
              openCreateModal={() => setIsCreateModalOpen(true)}
              goToTicketList={() => setCurrentTab('tickets')}
            />
          ) : (
            <TicketList
              onViewTicket={handleViewTicket}
              onEditTicket={(ticket) => setEditingTicket(ticket)}
              onDeleteTicket={(ticket) => setDeletingTicket(ticket)}
              openCreateModal={() => setIsCreateModalOpen(true)}
              initialSearch={globalSearch}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <TicketFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        titleText="Create Support Ticket"
      />

      {editingTicket && (
        <TicketFormModal
          isOpen={!!editingTicket}
          onClose={() => setEditingTicket(null)}
          onSubmit={handleEditSubmit}
          initialData={editingTicket}
          titleText="Edit Support Ticket"
        />
      )}

      {deletingTicket && (
        <DeleteConfirmModal
          isOpen={!!deletingTicket}
          ticketTitle={deletingTicket.title}
          onClose={() => setDeletingTicket(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default App;
