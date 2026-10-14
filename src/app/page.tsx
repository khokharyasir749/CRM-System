"use client";

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { AnalyticsPerformance } from '@/components/dashboard/AnalyticsPerformance';
import { AppointmentsTable } from '@/components/dashboard/AppointmentsTable';
import { NewAppointmentModal } from '@/components/dashboard/NewAppointmentModal';
import { AppointmentDetailModal } from '@/components/dashboard/AppointmentDetailModal';
import { CustomizeWidgetsModal } from '@/components/dashboard/CustomizeWidgetsModal';
import { CustomerListView } from '@/components/customers/CustomerListView';
import { CustomerProfileDrawer } from '@/components/customers/CustomerProfileDrawer';
import { AddCustomerModal } from '@/components/customers/AddCustomerModal';
import { AppointmentsView } from '@/components/appointments/AppointmentsView';
import { PaymentsView } from '@/components/payments/PaymentsView';
import { RecordPaymentModal } from '@/components/payments/RecordPaymentModal';
import { ReceiptModal } from '@/components/payments/ReceiptModal';
import { ComplaintsView } from '@/components/complaints/ComplaintsView';
import { FollowUpsView } from '@/components/followups/FollowUpsView';
import { StaffView } from '@/components/staff/StaffView';
import { MessagesView } from '@/components/messages/MessagesView';
import { ReportsView } from '@/components/reports/ReportsView';
import { SettingsView } from '@/components/settings/SettingsView';
import { NewAppointmentPage } from '@/components/appointments/NewAppointmentPage';
import { AddCustomerPage } from '@/components/customers/AddCustomerPage';
import { CustomerDetailPage } from '@/components/customers/CustomerDetailPage';
import { RecordPaymentPage } from '@/components/payments/RecordPaymentPage';
import { LogComplaintPage } from '@/components/complaints/LogComplaintPage';
import { CreateFollowUpPage } from '@/components/followups/CreateFollowUpPage';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';

import {
  initialAppointments,
  initialCustomers,
  initialInvoices,
  initialComplaints,
  initialFollowUps,
  initialStaffMembers,
  initialMessageTemplates,
  initialOmnichannelChats,
  initialServicesCatalog,
  initialSalonSettings,
} from '@/data/salonData';
import {
  Appointment,
  BookingStatus,
  ComplaintTicket,
  Customer,
  FollowUpStatus,
  FollowUpTask,
  Invoice,
  MessageTemplate,
  PaymentMethod,
  PaymentStatus,
  RoleMode,
  SalonProfileSettings,
  SalonServiceItem,
  StaffMember,
} from '@/types/crm';
import { ShieldAlert } from 'lucide-react';

export type ActiveView =
  | { type: 'tab'; tab: string }
  | { type: 'new-appointment'; preselectedCustomerId?: string | null }
  | { type: 'add-customer' }
  | { type: 'customer-detail'; customerId: string }
  | { type: 'record-payment'; customerId?: string | null; invoiceId?: string | null }
  | { type: 'log-complaint'; customerId?: string | null }
  | { type: 'create-followup'; customerId?: string | null };

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'tab', tab: 'dashboard' });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentTab = useMemo(() => {
    if (activeView.type === 'tab') return activeView.tab;
    if (activeView.type === 'new-appointment') return 'appointments';
    if (activeView.type === 'add-customer' || activeView.type === 'customer-detail') return 'customers';
    if (activeView.type === 'record-payment') return 'payments';
    if (activeView.type === 'log-complaint') return 'complaints';
    if (activeView.type === 'create-followup') return 'follow-ups';
    return 'dashboard';
  }, [activeView]);

  // Role Permissions Simulation Mode ('admin' vs 'staff')
  const [roleMode, setRoleMode] = useState<RoleMode>('admin');

  // Primary Cross-Module State
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(initialComplaints);
  const [followUps, setFollowUps] = useState<FollowUpTask[]>(initialFollowUps);
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaffMembers);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(initialMessageTemplates);
  const [omnichannelChats, setOmnichannelChats] = useState(initialOmnichannelChats);
  const [salonServices, setSalonServices] = useState<SalonServiceItem[]>(initialServicesCatalog);
  const [salonSettings, setSalonSettings] = useState<SalonProfileSettings>(initialSalonSettings);

  // Modals & Drawers State
  const [selectedCustomerForDrawer, setSelectedCustomerForDrawer] = useState<Customer | null>(null);
  const [selectedAppointmentForDetail, setSelectedAppointmentForDetail] = useState<Appointment | null>(null);
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<Invoice | null>(null);

  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [preselectedCustomerForBooking, setPreselectedCustomerForBooking] = useState<Customer | null>(null);

  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [preselectedCustomerForPayment, setPreselectedCustomerForPayment] = useState<Customer | null>(null);

  const [isCustomizeWidgetsOpen, setIsCustomizeWidgetsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Widget visibility toggles
  const [widgets, setWidgets] = useState({
    kpiCards: true,
    revenueTrends: true,
    operationsTeam: true,
    appointmentsTable: true,
  });

  const showToast = (type: 'success' | 'warning' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronized Dynamic KPI Stats
  const stats = useMemo(() => {
    const initialPaidTotal = initialInvoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const dynamicRevenue = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const totalRevenue = 416500 + (dynamicRevenue - initialPaidTotal);

    const initialBalanceTotal = initialCustomers.reduce(
      (acc, curr) => acc + curr.outstandingBalance,
      0
    );
    const dynamicBalance = customers.reduce(
      (acc, curr) => acc + curr.outstandingBalance,
      0
    );
    const outstandingBalances = 38500 + (dynamicBalance - initialBalanceTotal);

    const totalAppointments = appointments.length + 334;
    const activeCustomers = customers.length + 1272;

    return {
      totalRevenue: roleMode === 'staff' ? 0 : totalRevenue,
      totalAppointments,
      outstandingBalances: roleMode === 'staff' ? 0 : outstandingBalances,
      activeCustomers,
    };
  }, [invoices, customers, appointments, roleMode]);

  // Handler: Add New Customer
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(
      'success',
      'Customer Registered!',
      `${newCustomer.name} has been added to the Salon Directory.`
    );
  };

  // Handler: Add New Appointment
  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments((prev) => [newApp, ...prev]);

    // Create corresponding invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceCode: `#INV-${Math.floor(8000 + Math.random() * 1999)}`,
      customerId: newApp.customer.id,
      customerName: newApp.customer.name,
      customerPhone: newApp.customer.phone,
      appointmentId: newApp.id,
      serviceName: newApp.service,
      totalAmount: newApp.amount,
      paidAmount: newApp.paidAmount,
      dueBalance: newApp.amount - newApp.paidAmount,
      paymentStatus: newApp.paymentStatus,
      paymentMethod: 'Cash',
      recordedDate: 'Today, Just Now',
      staffName: 'Admin User',
      notes: `Appointment booking: ${newApp.service}`,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Update customer's outstanding balance & visits
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === newApp.customer.id) {
          return {
            ...c,
            visitsCount: c.visitsCount + 1,
            totalSpent: c.totalSpent + newApp.paidAmount,
            outstandingBalance: c.outstandingBalance + (newApp.amount - newApp.paidAmount),
            lastVisitDate: 'Today, Oct 14',
          };
        }
        return c;
      })
    );

    // Update staff booking count
    setStaffList((prev) =>
      prev.map((st) => {
        if (st.name === newApp.stylist.name) {
          return {
            ...st,
            assignedAppointmentsCount: st.assignedAppointmentsCount + 1,
            revenueGenerated: st.revenueGenerated + newApp.amount,
          };
        }
        return st;
      })
    );

    showToast(
      'success',
      'Appointment Booked!',
      `${newApp.customer.name} scheduled for ${newApp.service}. Invoice generated.`
    );
  };

  // Handler: Update Appointment Status
  const handleUpdateAppointmentStatus = (id: string, newStatus: BookingStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast('success', 'Status Updated', `Appointment marked as ${newStatus}.`);
  };

  // Handler: Update Appointment Payment Status
  const handleUpdateAppointmentPayment = (id: string, newPaymentStatus: PaymentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const paidAmount = newPaymentStatus === 'Paid' ? a.amount : newPaymentStatus === 'Partial' ? a.amount / 2 : 0;
          return { ...a, paymentStatus: newPaymentStatus, paidAmount };
        }
        return a;
      })
    );

    // Also update matching invoice
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.appointmentId === id) {
          const paidAmount = newPaymentStatus === 'Paid' ? inv.totalAmount : newPaymentStatus === 'Partial' ? inv.totalAmount / 2 : 0;
          return {
            ...inv,
            paymentStatus: newPaymentStatus,
            paidAmount,
            dueBalance: inv.totalAmount - paidAmount,
          };
        }
        return inv;
      })
    );

    showToast('success', 'Payment Updated', `Booking payment marked as ${newPaymentStatus}.`);
  };

  // Handler: Delete/Cancel Appointment
  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('warning', 'Booking Cancelled', 'Appointment removed from schedule.');
  };

  // Handler: Record / Settle Payment from Modal
  const handleSavePayment = (
    customerId: string,
    invoiceId: string | null,
    amountPaying: number,
    paymentMethod: PaymentMethod,
    notes: string
  ) => {
    const customer = customers.find((c) => c.id === customerId);

    if (invoiceId) {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === invoiceId) {
            const newPaid = inv.paidAmount + amountPaying;
            const newDue = Math.max(0, inv.totalAmount - newPaid);
            return {
              ...inv,
              paidAmount: newPaid,
              dueBalance: newDue,
              paymentStatus: newDue === 0 ? 'Paid' : 'Partial',
              paymentMethod,
              notes,
            };
          }
          return inv;
        })
      );
    } else {
      const newInv: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceCode: `#INV-${Math.floor(8000 + Math.random() * 1999)}`,
        customerId,
        customerName: customer?.name || 'Customer',
        customerPhone: customer?.phone || '',
        serviceName: 'Counter Settlement / Dues Cleared',
        totalAmount: amountPaying,
        paidAmount: amountPaying,
        dueBalance: 0,
        paymentStatus: 'Paid',
        paymentMethod,
        recordedDate: 'Today, Just Now',
        staffName: 'Admin User',
        notes,
      };
      setInvoices((prev) => [newInv, ...prev]);
    }

    // Deduct from customer outstanding balance and add to lifetime spend
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBal = Math.max(0, c.outstandingBalance - amountPaying);
          return {
            ...c,
            outstandingBalance: newBal,
            totalSpent: c.totalSpent + amountPaying,
          };
        }
        return c;
      })
    );

    showToast(
      'success',
      'Payment Recorded',
      `PKR ${amountPaying.toLocaleString()} collected via ${paymentMethod}. Outstanding balance updated.`
    );
  };

  // Handler: Quick Settle from Table
  const handleSettleInvoice = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    handleSavePayment(
      inv.customerId,
      inv.id,
      inv.dueBalance,
      'Cash',
      'Full outstanding balance settled at reception counter'
    );
  };

  // Quick Book trigger from Customer profile
  const handleQuickBookCustomer = (customer: Customer) => {
    setPreselectedCustomerForBooking(customer);
    setIsNewAppointmentModalOpen(true);
  };

  // Record Payment trigger from Customer profile
  const handleRecordPaymentCustomer = (customer: Customer) => {
    setPreselectedCustomerForPayment(customer);
    setIsRecordPaymentModalOpen(true);
  };

  // Complaints Handlers
  const handleAddComplaint = (newComp: ComplaintTicket) => {
    setComplaints((prev) => [newComp, ...prev]);
    showToast('warning', 'Complaint Logged', `Ticket ${newComp.ticketCode} assigned to ${newComp.assignedStaffName}.`);
  };

  const handleUpdateComplaint = (updated: ComplaintTicket) => {
    setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast('success', 'Complaint Resolved', `Ticket ${updated.ticketCode} closed with resolution notes.`);
  };

  // Follow-ups Handlers
  const handleAddFollowUp = (newTask: FollowUpTask) => {
    setFollowUps((prev) => [newTask, ...prev]);
    showToast('success', 'Task Scheduled', `Follow-up for ${newTask.customerName} set for ${newTask.scheduledDate}.`);
  };

  const handleUpdateFollowUpStatus = (id: string, newStatus: FollowUpStatus) => {
    setFollowUps((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus, isOverdue: newStatus === 'Completed' ? false : t.isOverdue } : t))
    );
    showToast('info', 'Follow-up Updated', `Task status changed to ${newStatus}.`);
  };

  // Staff Handlers
  const handleAddStaff = (newStaff: StaffMember) => {
    setStaffList((prev) => [...prev, newStaff]);
    showToast('success', 'Staff Member Added', `${newStaff.name} has been enrolled in the salon team roster.`);
  };

  const handleToggleStaffStatus = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((st) => (st.id === staffId ? { ...st, status: st.status === 'Active' ? 'Inactive' : 'Active' } : st))
    );
    showToast('info', 'Staff Status Updated', 'Roster availability toggled.');
  };

  // Message Template Update
  const handleUpdateTemplate = (tpl: MessageTemplate) => {
    setMessageTemplates((prev) => prev.map((t) => (t.id === tpl.id ? tpl : t)));
    showToast('success', 'Template Saved', `"${tpl.title}" template updated successfully.`);
  };

  // Service Catalog Handlers
  const handleAddService = (srv: SalonServiceItem) => {
    setSalonServices((prev) => [...prev, srv]);
    showToast('success', 'Service Created', `Added ${srv.name} to the salon service menu.`);
  };

  const handleToggleServiceStatus = (srvId: string) => {
    setSalonServices((prev) =>
      prev.map((s) => (s.id === srvId ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
    );
    showToast('info', 'Service Menu Updated', 'Service status changed.');
  };

  // Export CSV handler
  const handleExport = (format: string = 'CSV') => {
    const headers = ['Booking ID,Customer,Phone,Service,Stylist,Date,Time,Amount,Status,Payment'];
    const rows = appointments.map(
      (a) =>
        `"${a.bookingCode}","${a.customer.name}","${a.customer.phone}","${a.service}","${a.stylist.name}","${a.date}","${a.timeSlot}",${a.amount},"${a.status}","${a.paymentStatus}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `regular_crm_appointments_${Date.now()}.${format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('info', `Export Completed`, `Exported salon data in ${format} format.`);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setActiveView({ type: 'tab', tab })}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        roleMode={roleMode}
        onToggleRoleMode={setRoleMode}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Persistent Top Navigation Bar */}
        <Header
          title={
            activeView.type === 'new-appointment'
              ? 'Book New Appointment'
              : activeView.type === 'add-customer'
              ? 'Add New Client'
              : activeView.type === 'customer-detail'
              ? 'Client 360° Profile'
              : activeView.type === 'record-payment'
              ? 'Settle Invoice & Payment'
              : activeView.type === 'log-complaint'
              ? 'Log Incident Ticket'
              : activeView.type === 'create-followup'
              ? 'Schedule Care Follow-up'
              : currentTab === 'dashboard'
              ? 'Dashboard'
              : currentTab === 'appointments'
              ? 'Appointments Schedule'
              : currentTab === 'customers'
              ? 'Customers Directory'
              : currentTab === 'payments'
              ? 'Payments & Ledger'
              : currentTab === 'complaints'
              ? 'Complaints & Resolutions'
              : currentTab === 'follow-ups'
              ? 'Client Care & Follow-ups'
              : currentTab === 'messages'
              ? 'Messages & Templates'
              : currentTab === 'staff'
              ? 'Staff & Role Permissions'
              : currentTab === 'reports'
              ? 'Reports & Salon Analytics'
              : currentTab === 'settings'
              ? 'Salon Configuration & Settings'
              : 'Regular CRM'
          }
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onNewAppointment={() => setActiveView({ type: 'new-appointment' })}
          onCustomizeWidgets={() => setIsCustomizeWidgetsOpen(true)}
          onExport={handleExport}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleMode={roleMode}
          onToggleRoleMode={setRoleMode}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Staff Mode Banner when viewing restricted modules */}
            {roleMode === 'staff' && (
              <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-blue-900 text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="h-4 w-4 text-blue-600" />
                  <span>
                    <strong>Staff Stylist Simulation Active:</strong> Sensitive financial metrics and administrative staff seat management are redacted.
                  </span>
                </div>
                <button
                  onClick={() => setRoleMode('admin')}
                  className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                >
                  Switch to Admin View
                </button>
              </div>
            )}

            {/* DEDICATED FULL-PAGE 1: BOOK NEW APPOINTMENT */}
            {activeView.type === 'new-appointment' && (
              <NewAppointmentPage
                onBack={() => setActiveView({ type: 'tab', tab: 'appointments' })}
                onAddAppointment={handleAddAppointment}
                customers={customers}
                existingAppointments={appointments}
                preselectedCustomerId={activeView.preselectedCustomerId}
                onNavigateAddCustomer={() => setActiveView({ type: 'add-customer' })}
              />
            )}

            {/* DEDICATED FULL-PAGE 2: ADD NEW CUSTOMER */}
            {activeView.type === 'add-customer' && (
              <AddCustomerPage
                onBack={() => setActiveView({ type: 'tab', tab: 'customers' })}
                onAddCustomer={handleAddCustomer}
              />
            )}

            {/* DEDICATED FULL-PAGE 3: CUSTOMER 360° PROFILE */}
            {activeView.type === 'customer-detail' && (() => {
              const cust = customers.find((c) => c.id === activeView.customerId) || customers[0];
              return (
                <CustomerDetailPage
                  customer={cust}
                  onBack={() => setActiveView({ type: 'tab', tab: 'customers' })}
                  appointments={appointments}
                  invoices={invoices}
                  complaints={complaints}
                  followUps={followUps}
                  onBookAppointment={(c) =>
                    setActiveView({ type: 'new-appointment', preselectedCustomerId: c.id })
                  }
                  onRecordPayment={(c) =>
                    setActiveView({ type: 'record-payment', customerId: c.id })
                  }
                />
              );
            })()}

            {/* DEDICATED FULL-PAGE 4: RECORD PAYMENT / SETTLE INVOICE */}
            {activeView.type === 'record-payment' && (
              <RecordPaymentPage
                onBack={() => setActiveView({ type: 'tab', tab: 'payments' })}
                customers={customers}
                invoices={invoices}
                preselectedCustomerId={activeView.customerId}
                preselectedInvoiceId={activeView.invoiceId}
                onSavePayment={handleSavePayment}
                onViewReceipt={(inv) => setSelectedInvoiceForReceipt(inv)}
              />
            )}

            {/* DEDICATED FULL-PAGE 5: LOG COMPLAINT */}
            {activeView.type === 'log-complaint' && (
              <LogComplaintPage
                onBack={() => setActiveView({ type: 'tab', tab: 'complaints' })}
                customers={customers}
                staffList={staffList}
                onAddComplaint={handleAddComplaint}
                preselectedCustomerId={activeView.customerId}
              />
            )}

            {/* DEDICATED FULL-PAGE 6: CREATE FOLLOW-UP */}
            {activeView.type === 'create-followup' && (
              <CreateFollowUpPage
                onBack={() => setActiveView({ type: 'tab', tab: 'follow-ups' })}
                customers={customers}
                staffList={staffList}
                onAddFollowUp={handleAddFollowUp}
                preselectedCustomerId={activeView.customerId}
              />
            )}

            {/* MAIN DASHBOARD */}
            {activeView.type === 'tab' && currentTab === 'dashboard' && (
              <>
                {widgets.kpiCards && <KpiCards stats={stats} />}

                {(widgets.revenueTrends || widgets.operationsTeam) && (
                  <AnalyticsPerformance />
                )}

                {widgets.appointmentsTable && (
                  <AppointmentsTable
                    appointments={appointments}
                    onViewDetails={(app) => setSelectedAppointmentForDetail(app)}
                    onViewCustomer={(cust) =>
                      setActiveView({ type: 'customer-detail', customerId: cust.id })
                    }
                    onUpdateStatus={handleUpdateAppointmentStatus}
                    onUpdatePayment={handleUpdateAppointmentPayment}
                    onDeleteAppointment={handleDeleteAppointment}
                    onExport={() => handleExport('CSV')}
                  />
                )}
              </>
            )}

            {/* APPOINTMENTS MODULE */}
            {activeView.type === 'tab' && currentTab === 'appointments' && (
              <AppointmentsView
                appointments={appointments}
                customers={customers}
                onOpenNewAppointment={() => setActiveView({ type: 'new-appointment' })}
                onViewAppointmentDetails={(app) => setSelectedAppointmentForDetail(app)}
                onViewCustomer={(cust) =>
                  setActiveView({ type: 'customer-detail', customerId: cust.id })
                }
                onUpdateStatus={handleUpdateAppointmentStatus}
              />
            )}

            {/* CUSTOMERS MODULE */}
            {activeView.type === 'tab' && currentTab === 'customers' && (
              <CustomerListView
                customers={customers}
                onSelectCustomer={(cust) =>
                  setActiveView({ type: 'customer-detail', customerId: cust.id })
                }
                onOpenAddModal={() => setActiveView({ type: 'add-customer' })}
                onQuickBook={(cust) =>
                  setActiveView({ type: 'new-appointment', preselectedCustomerId: cust.id })
                }
                onRecordPayment={(cust) =>
                  setActiveView({ type: 'record-payment', customerId: cust.id })
                }
              />
            )}

            {/* PAYMENTS & BALANCES MODULE */}
            {activeView.type === 'tab' && currentTab === 'payments' && (
              <PaymentsView
                invoices={invoices}
                customers={customers}
                onOpenRecordPayment={(cust) =>
                  setActiveView({ type: 'record-payment', customerId: cust?.id })
                }
                onViewReceipt={(inv) => setSelectedInvoiceForReceipt(inv)}
                onSettleInvoice={(invId) => {
                  const inv = invoices.find((i) => i.id === invId);
                  setActiveView({
                    type: 'record-payment',
                    customerId: inv?.customerId,
                    invoiceId: invId,
                  });
                }}
              />
            )}

            {/* COMPLAINTS MANAGEMENT */}
            {activeView.type === 'tab' && currentTab === 'complaints' && (
              <ComplaintsView
                complaints={complaints}
                customers={customers}
                staffList={staffList}
                onOpenCustomerProfile={(cust) =>
                  setActiveView({ type: 'customer-detail', customerId: cust.id })
                }
                onAddComplaint={handleAddComplaint}
                onUpdateComplaint={handleUpdateComplaint}
                onOpenLogComplaint={() => setActiveView({ type: 'log-complaint' })}
              />
            )}

            {/* FOLLOW-UPS MANAGEMENT */}
            {activeView.type === 'tab' && currentTab === 'follow-ups' && (
              <FollowUpsView
                followUps={followUps}
                customers={customers}
                staffList={staffList}
                onAddFollowUp={handleAddFollowUp}
                onUpdateStatus={handleUpdateFollowUpStatus}
                onOpenCustomerProfile={(cust) =>
                  setActiveView({ type: 'customer-detail', customerId: cust.id })
                }
                onOpenCreateTask={() => setActiveView({ type: 'create-followup' })}
              />
            )}

            {/* MESSAGES & TEMPLATES */}
            {activeView.type === 'tab' && currentTab === 'messages' && (
              <MessagesView
                templates={messageTemplates}
                conversations={omnichannelChats}
                onUpdateTemplate={handleUpdateTemplate}
                onAddTemplate={(tpl) => setMessageTemplates((prev) => [...prev, tpl])}
              />
            )}

            {/* STAFF & ROLES */}
            {activeView.type === 'tab' && currentTab === 'staff' && (
              <StaffView
                staffList={staffList}
                roleMode={roleMode}
                onToggleRoleMode={setRoleMode}
                onAddStaff={handleAddStaff}
                onToggleStaffStatus={handleToggleStaffStatus}
              />
            )}

            {/* REPORTS & ANALYTICS */}
            {activeView.type === 'tab' && currentTab === 'reports' && (
              <ReportsView
                staffList={staffList}
                roleMode={roleMode}
                onExport={handleExport}
              />
            )}

            {/* SETTINGS */}
            {activeView.type === 'tab' && currentTab === 'settings' && (
              <SettingsView
                settings={salonSettings}
                services={salonServices}
                onSaveSettings={(s) => {
                  setSalonSettings(s);
                  showToast('success', 'Settings Saved', 'Salon profile configuration updated.');
                }}
                onAddService={handleAddService}
                onToggleServiceStatus={handleToggleServiceStatus}
              />
            )}
          </div>
        </main>
      </div>

      {/* Appointment Detail Modal (Inspection only) */}
      <AppointmentDetailModal
        appointment={selectedAppointmentForDetail}
        onClose={() => setSelectedAppointmentForDetail(null)}
        onUpdateStatus={handleUpdateAppointmentStatus}
        onUpdatePayment={handleUpdateAppointmentPayment}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        invoice={selectedInvoiceForReceipt}
        onClose={() => setSelectedInvoiceForReceipt(null)}
      />

      {/* Customize Dashboard Widgets Modal */}
      <CustomizeWidgetsModal
        isOpen={isCustomizeWidgetsOpen}
        onClose={() => setIsCustomizeWidgetsOpen(false)}
        widgets={widgets}
        onToggleWidget={(key) => setWidgets((prev) => ({ ...prev, [key]: !prev[key] }))}
      />

      {/* Floating Action Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
