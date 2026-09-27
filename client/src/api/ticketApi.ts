import axios from 'axios';
import { Ticket, StatsResponse, TicketStatus, TicketPriority, TicketCategory } from '../types/ticket';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ticketApi = {
  // Get stats for dashboard
  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get<StatsResponse>('/tickets/stats');
    return response.data;
  },

  // Get all tickets with filters
  getTickets: async (params?: {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ success: boolean; count: number; data: Ticket[] }> => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  // Get single ticket by ID
  getTicketById: async (id: string): Promise<{ success: boolean; data: Ticket }> => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Create ticket
  createTicket: async (ticketData: {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
  }): Promise<{ success: boolean; data: Ticket; message: string }> => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  // Update ticket
  updateTicket: async (
    id: string,
    ticketData: Partial<{
      title: string;
      description: string;
      category: TicketCategory;
      priority: TicketPriority;
      status: TicketStatus;
    }>
  ): Promise<{ success: boolean; data: Ticket; message: string }> => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
};
