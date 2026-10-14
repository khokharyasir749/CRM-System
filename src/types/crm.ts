export type PaymentStatus = 'Paid' | 'Partial' | 'Unpaid';
export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Completed' | 'No-show' | 'Cancelled' | 'Pending Payment';
export type PaymentMethod = 'Cash' | 'Card' | 'Bank Transfer' | 'POS Terminal';
export type RoleMode = 'admin' | 'staff';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  gender?: 'Female' | 'Male' | 'Other';
  visitsCount: number;
  totalSpent: number;
  outstandingBalance: number;
  lastVisitDate: string;
  preferredStylistId?: string;
  preferredStylistName?: string;
  skinHairNotes?: string;
  allergies?: string;
  category: 'VIP' | 'Frequent' | 'Standard';
  joinedDate: string;
}

export interface Stylist {
  id: string;
  name: string;
  avatar: string;
  role: string;
  specialty: string;
  rating: number;
  activeBookings: number;
}

export interface StaffMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Administrator / Owner' | 'Staff Stylist / Front Desk';
  email: string;
  phone: string;
  specialization: string;
  status: 'Active' | 'Inactive';
  assignedAppointmentsCount: number;
  revenueGenerated: number;
  rating: number;
  joinedDate: string;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  customer: Customer;
  service: string;
  category: 'Bridal' | 'Facial & Skin' | 'Hair & Styling' | 'Nails & Spa' | 'Color & Balayage';
  stylist: Stylist;
  date: string;
  timeSlot: string;
  startTime: string; // e.g., "11:30"
  endTime: string;   // e.g., "14:00"
  amount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  durationMinutes: number;
  notes?: string;
}

export type ComplaintCategory =
  | 'Service Quality'
  | 'Skin Irritation'
  | 'Long Wait Time'
  | 'Staff Behavior'
  | 'Billing Issue';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface ComplaintTicket {
  id: string;
  ticketCode: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  serviceName: string;
  category: ComplaintCategory;
  issue: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedStaffName: string;
  createdAt: string;
  closedAt?: string;
  resolutionNotes?: string;
  compensationGiven?: string;
}

export type FollowUpStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface FollowUpTask {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  serviceName: string;
  scheduledDate: string;
  type: string;
  reason: string;
  status: FollowUpStatus;
  assignedStaffName: string;
  notes: string;
  isOverdue?: boolean;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  appointmentId?: string;
  serviceName: string;
  totalAmount: number;
  paidAmount: number;
  dueBalance: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  recordedDate: string;
  staffName: string;
  notes?: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  category: 'Confirmation' | 'Reminder' | 'Payment' | 'Review' | 'Promo';
  content: string;
  variables: string[];
  status: 'Active' | 'Inactive';
}

export interface OmnichannelMessage {
  id: string;
  sender: 'customer' | 'salon';
  text: string;
  time: string;
}

export interface OmnichannelConversation {
  id: string;
  customerName: string;
  customerPhone: string;
  avatar: string;
  channel: 'WhatsApp' | 'Instagram';
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  assignedStaff: string;
  messages: OmnichannelMessage[];
}

export interface SalonServiceItem {
  id: string;
  name: string;
  category: 'Bridal' | 'Facial & Skin' | 'Hair & Styling' | 'Nails & Spa' | 'Color & Balayage';
  price: number;
  duration: number;
  status: 'Active' | 'Inactive';
}

export interface SalonProfileSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  whatsappReminderTiming: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  numericValue: number;
  trend: string;
  isPositive: boolean;
  subtext: string;
  badgeType: 'positive' | 'negative' | 'neutral';
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  serviceCost: number;
  appointments: number;
}
