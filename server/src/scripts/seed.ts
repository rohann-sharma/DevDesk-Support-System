import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import Ticket from '../models/Ticket';
import mongoose from 'mongoose';

dotenv.config();

const sampleTickets = [
  {
    title: 'OAuth Login Failure on Safari Mobile',
    description: 'Users attempting to login via Google OAuth on iOS Safari report a white screen redirection loop after granting permissions.',
    category: 'Bug',
    priority: 'Critical',
    status: 'In Progress',
    timeline: [
      { action: 'Ticket Created', timestamp: new Date(Date.now() - 86400000 * 3), details: 'Submitted by QA Team' },
      { action: 'Priority Changed', timestamp: new Date(Date.now() - 86400000 * 2), details: 'Escalated from High to Critical due to impact' },
      { action: 'Status Changed', timestamp: new Date(Date.now() - 86400000 * 1), details: 'Assigned to Auth Subteam' }
    ]
  },
  {
    title: 'Export Ticket History to CSV / PDF',
    description: 'Support managers need the capability to export weekly ticket analytics and ticket resolution histories to CSV for executive reporting.',
    category: 'Feature Request',
    priority: 'Medium',
    status: 'Open',
    timeline: [
      { action: 'Ticket Created', timestamp: new Date(Date.now() - 86400000 * 2), details: 'Requested by Support Operations Manager' }
    ]
  },
  {
    title: 'Incorrect Billing Currency Symbol on Invoices',
    description: 'European customer accounts are receiving PDF invoices displayed with USD ($) instead of EUR (€) symbols.',
    category: 'Billing',
    priority: 'High',
    status: 'Resolved',
    timeline: [
      { action: 'Ticket Created', timestamp: new Date(Date.now() - 86400000 * 5), details: 'Reported by EU Account Representative' },
      { action: 'Status Changed', timestamp: new Date(Date.now() - 86400000 * 4), details: 'Moved to In Progress' },
      { action: 'Status Changed', timestamp: new Date(Date.now() - 86400000 * 1), details: 'Hotfix deployed to production. Status resolved.' }
    ]
  },
  {
    title: 'API Rate Limiting Returning 500 Internal Error',
    description: 'When API requests exceed 100 requests/minute, the gateway returns HTTP 500 instead of standard 429 Too Many Requests response.',
    category: 'Technical Support',
    priority: 'High',
    status: 'In Progress',
    timeline: [
      { action: 'Ticket Created', timestamp: new Date(Date.now() - 86400000 * 4), details: 'Reported by Enterprise Integration Partner' }
    ]
  },
  {
    title: 'Dark Mode UI Contrast Issues on Data Tables',
    description: 'Text contrast ratio in data table rows falls below WCAG AAA guidelines when viewing active status tags under dark mode.',
    category: 'Bug',
    priority: 'Low',
    status: 'Open',
    timeline: [
      { action: 'Ticket Created', timestamp: new Date(Date.now() - 86400000 * 1), details: 'UI/UX Accessibility Audit item' }
    ]
  },
  {
    title: 'Bulk Ticket Tagging & Action Bar',
    description: 'Request to add multi-select checkboxes on the ticket list table to allow mass assignment and bulk status updates.',
    category: 'Feature Request',
    priority: 'Medium',
    status: 'Open',
    timeline: [
      { action: 'Ticket Created', timestamp: new Date(Date.now() - 86400000 * 6), details: 'Product Backlog item' }
    ]
  }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing tickets...');
    await Ticket.deleteMany({});
    console.log('Inserting seed tickets...');
    await Ticket.insertMany(sampleTickets);
    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
