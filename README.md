# DevDesk — Support Ticket Management System

DevDesk is a complete, production-ready SaaS Support Ticket Management application designed for technical interview evaluation and developer portfolio submission.

---

## 🌟 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons, Recharts
- **Backend**: Node.js, Express.js, TypeScript, Mongoose ODM
- **Database**: MongoDB Atlas (with in-memory fallback for local development)

---

## 📁 Project Structure

```
devdesk/
├── client/              # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── api/        # Axios API client wrapper
│   │   ├── components/ # Stats Cards, Chart, Ticket Table, Modals
│   │   ├── types/      # TypeScript interfaces
│   │   └── views/      # Dashboard, TicketList, TicketDetail views
│   ├── package.json
│   └── vite.config.ts
├── server/              # Express + Node.js + TypeScript REST API
│   ├── src/
│   │   ├── config/     # MongoDB Atlas / local DB connector
│   │   ├── controllers/# CRUD handlers & dashboard metrics logic
│   │   ├── models/     # Ticket Mongoose Schema & timeline schema
│   │   ├── routes/     # REST API routes
│   │   └── scripts/    # Seed script
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

---

## ✨ Features Summary

1. **Dashboard Overview**: Metrics overview cards (Total, Open, In Progress, Resolved), interactive status pie chart, and recent tickets table.
2. **Ticket CRUD Operations**: Create new support tickets, view details, edit fields, and delete with a confirmation modal.
3. **Filter, Search & Sort**: Title search bar, status/priority/category filters, and dynamic sorting (date, priority, title).
4. **Ticket Detail & Timeline**: Dedicated view with complete metadata and an activity log timeline tracking status changes.
5. **Backend REST API & MongoDB Atlas Integration**: Secured database config with automated URI credential redaction.

---

## 🛠️ Setup & Running Instructions

### 1. Backend Setup (`/server`)

```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Create your .env file using .env.example as a template
# Set process.env.MONGODB_URI to your MongoDB Atlas connection string

# Seed sample support tickets into MongoDB
npm run seed

# Run backend development server
npm run dev
```

The API runs on **`http://localhost:5000`**.

### 2. Frontend Setup (`/client`)

```bash
# Navigate to the client folder in a new terminal window
cd client

# Install dependencies
npm install

# Run Vite React development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | API health check |
| `GET` | `/api/tickets/stats` | Dashboard statistics & chart breakdown |
| `GET` | `/api/tickets` | Query tickets (supports search, status, priority, category, sortBy, sortOrder) |
| `GET` | `/api/tickets/:id` | Get single ticket with timeline |
| `POST` | `/api/tickets` | Create a new ticket |
| `PUT` | `/api/tickets/:id` | Update ticket details/status/priority |
| `DELETE` | `/api/tickets/:id` | Delete a ticket |
