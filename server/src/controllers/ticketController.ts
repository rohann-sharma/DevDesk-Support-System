import { Request, Response } from 'express';
import Ticket from '../models/Ticket';

// @desc    Get dashboard summary stats & metrics
// @route   GET /api/tickets/stats
export const getTicketStats = async (req: Request, res: Response) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'Open' });
    const inProgress = await Ticket.countDocuments({ status: 'In Progress' });
    const resolved = await Ticket.countDocuments({ status: 'Resolved' });

    const statusBreakdown = [
      { name: 'Open', count: open, color: '#3B82F6' },
      { name: 'In Progress', count: inProgress, color: '#F59E0B' },
      { name: 'Resolved', count: resolved, color: '#10B981' }
    ];

    const priorityBreakdown = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const recentTickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        total,
        open,
        inProgress,
        resolved
      },
      statusBreakdown,
      priorityBreakdown,
      recentTickets
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error retrieving statistics', error: error.message });
  }
};

// @desc    Get tickets with search, filtering, and sorting
// @route   GET /api/tickets
export const getTickets = async (req: Request, res: Response) => {
  try {
    const { search, status, priority, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query: any = {};

    if (search) {
      query.title = { $regex: search as string, $options: 'i' };
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const sortOptions: any = {};
    const field = (sortBy as string) || 'createdAt';
    sortOptions[field] = sortOrder === 'asc' ? 1 : -1;

    const tickets = await Ticket.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch tickets', error: error.message });
  }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, data: ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving ticket', error: error.message });
  }
};

// @desc    Create a new ticket
// @route   POST /api/tickets
export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const initialTimeline = [
      {
        action: 'Ticket Created',
        timestamp: new Date(),
        details: `Ticket submitted with priority: ${priority || 'Medium'} and category: ${category || 'Technical Support'}`
      }
    ];

    const ticket = new Ticket({
      title,
      description,
      category: category || 'Technical Support',
      priority: priority || 'Medium',
      status: 'Open',
      timeline: initialTimeline
    });

    const savedTicket = await ticket.save();
    res.status(201).json({ success: true, data: savedTicket, message: 'Ticket created successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Invalid ticket data', error: error.message });
  }
};

// @desc    Update ticket details (or update status/priority)
// @route   PUT /api/tickets/:id
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const { title, description, category, priority, status } = req.body;
    const timelineUpdates: any[] = [];

    if (status && status !== ticket.status) {
      timelineUpdates.push({
        action: 'Status Changed',
        timestamp: new Date(),
        details: `Status updated from ${ticket.status} to ${status}`
      });
      ticket.status = status;
    }

    if (priority && priority !== ticket.priority) {
      timelineUpdates.push({
        action: 'Priority Changed',
        timestamp: new Date(),
        details: `Priority updated from ${ticket.priority} to ${priority}`
      });
      ticket.priority = priority;
    }

    if (title && title !== ticket.title) {
      timelineUpdates.push({
        action: 'Title Updated',
        timestamp: new Date(),
        details: `Title modified`
      });
      ticket.title = title;
    }

    if (description) ticket.description = description;
    if (category) ticket.category = category;

    if (timelineUpdates.length > 0) {
      ticket.timeline.push(...timelineUpdates);
    }

    const updatedTicket = await ticket.save();
    res.json({ success: true, data: updatedTicket, message: 'Ticket updated successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Failed to update ticket', error: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to delete ticket', error: error.message });
  }
};
