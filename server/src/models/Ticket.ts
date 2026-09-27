import mongoose, { Schema, Document } from 'mongoose';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Bug' | 'Feature Request' | 'Billing' | 'Technical Support' | 'General Inquiry';

export interface IActivityLog {
  action: string;
  timestamp: Date;
  details?: string;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  timeline: IActivityLog[];
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
});

const TicketSchema: Schema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Bug', 'Feature Request', 'Billing', 'Technical Support', 'General Inquiry'],
      default: 'Technical Support'
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open'
    },
    timeline: [ActivityLogSchema]
  },
  {
    timestamps: true
  }
);

// Index fields frequently queried for performant search & sorting
TicketSchema.index({ title: 'text', description: 'text' });
TicketSchema.index({ status: 1, priority: 1, category: 1 });
TicketSchema.index({ createdAt: -1 });

export default mongoose.model<ITicket>('Ticket', TicketSchema);
