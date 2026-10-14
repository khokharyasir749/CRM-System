# Regular CRM — Luxury Salon Operations & Client Management Suite

A modern, production-ready frontend for **Regular CRM**, a premier salon management SaaS platform built with **Next.js (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

Inspired by clean, minimalist Dribbble/Cemdash SaaS aesthetics with generous whitespace, subtle `#E2E8F0` borders, crisp pill badges, micro-animations, and full currency localization in **Pakistani Rupee (PKR)**.

---

## 🌟 Modules & Features Overview

### 1. Main Dashboard & Persistent Shell
- **KPI Metrics Strip:** Live tracking of Total Revenue (`PKR 485,000`), Total Appointments (`342`), Outstanding Balances (`PKR 38,500`), and Active Customers (`1,280`).
- **Revenue & Booking Trends:** Interactive monthly receipts vs. service cost bar chart with animated tooltips.
- **Operations & Team Performance:** Live target progress (`82%`), staff workload capacity (`74%`), and verified client satisfaction score (`96%`).
- **Live Appointments Overview:** Searchable table with check-in shortcuts, payment badges, and CSV export.

### 2. Customers Module
- **Searchable Client Directory:** Real-time search across names, phone numbers, and emails with filter pills (*All*, *VIP*, *Frequent*, *Has Balance*).
- **Comprehensive 360° Profile Drawer:** 6 tabbed navigation views:
  1. *Overview:* Beauty notes, skin/hair precautions, preferred stylist, and salon visit timeline.
  2. *Appointments:* Booking history with status tags.
  3. *Visits & Services:* Detailed breakdown of past treatments and assigned staff.
  4. *Payments:* Invoices, settled amounts, remaining balance, and payment methods.
  5. *Complaints:* Linked resolution tickets with priority tags.
  6. *Follow-ups:* Scheduled client care check-ins and due dates.
- **Add Customer Modal:** Record beauty characteristics, allergies, gender, and preferred stylist.

### 3. Appointments Module
- **Calendar & Time-Grid View:** Time slots from 09:00 AM to 08:00 PM with staff cards.
- **Double-Booking & Conflict Detection:** Automatic overlapping time check highlighting double-booked staff with an amber warning banner (`⚠️ Schedule Conflict: Staff Double-Booked`).
- **Table List View:** Detailed schedule list with status pills and actions.
- **Multi-Service Booking Modal:** Bundles multiple services (e.g. Bridal Hair + Facial) with automatic duration and bill calculation.

### 4. Payments & Balances Module
- **Top Metrics Row:** Total Collected Today, Total Outstanding Balances, and Settled Invoices.
- **Payments Ledger Table:** Date filters, settlement status pills, payment method tags (*Cash*, *Card*, *Bank Transfer*, *POS Terminal*).
- **Record Payment Modal:** Supports full vs. partial payments with dynamic remaining balance updates.
- **Printable Salon Receipt Modal:** Branded receipt with tax breakdown and print command.

### 5. Complaints Management
- **Metrics Strip:** Open, in-progress, and resolved issue counts.
- **Complaints Table:** Categories (*Service Quality*, *Skin Irritation*, *Long Wait Time*, *Staff Behavior*, *Billing Issue*), priority levels, assigned staff handlers, and resolution notes.
- **Log & Resolve Dialogs:** Capture incident reports and record client compensation/discount vouchers.

### 6. Follow-ups Management
- **Task Tracking:** Filters for *All*, *Due Today*, *Overdue* (highlighted in soft rose-red), *Upcoming*, and *Completed*.
- **1-Click WhatsApp Concierge:** Directly opens WhatsApp with custom salon greetings tailored to treatment follow-up protocols.

### 7. Staff & Role-Based Access Control
- **10-Account Seat Limit:** Counter displaying current capacity (e.g. `7 / 10 Staff Seats Used`), preventing additions once the limit is reached.
- **Role Permissions Simulator:** Interactive toggle between **"View as Administrator"** and **"View as Staff"**.
  - In Staff mode, financial metrics and administrative staff seat management are automatically restricted.

### 8. Messages & Templates
- **Template Editor (In-Scope):** WhatsApp templates with variable tags (`{{customer_name}}`, `{{service_name}}`, `{{appointment_time}}`, `{{amount_due}}`) and a live mobile preview bubble.
- **Shared Inbox (Pending Scope Approval):** Functional demonstration of a two-way WhatsApp & Instagram shared inbox with the mandatory scope notice.

### 9. Reports & Analytics
- Executive date range filters (*Today*, *Last 7 Days*, *This Month*, *Last Month*).
- Appointment completion vs. cancellation rates, collection summaries, client retention ratios, and stylist productivity rankings.

### 10. Salon Settings
- Salon branding details, weekly operating hours schedule, service menu catalog with price management, and automated notification triggers.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Design:** Cemdash / Dribbble SaaS Aesthetic

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/khokharyasir749/CRM-System.git
cd CRM-System

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```
