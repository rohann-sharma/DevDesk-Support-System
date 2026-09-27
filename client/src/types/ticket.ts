export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Bug' | 'Feature Request' | 'Billing' | 'Technical Support' | 'General Inquiry';

export interface ActivityLog {
  _id?: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  timeline: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export interface StatusBreakdown {
  name: string;
  count: number;
  color: string;
}

export interface StatsResponse {
  success: boolean;
  stats: TicketStats;
  statusBreakdown: StatusBreakdown[];
  priorityBreakdown: { _id: string; count: number }[];
  recentTickets: Ticket[];
}
