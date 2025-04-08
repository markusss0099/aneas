
export interface Ticket {
  id: string;
  eventName: string;
  quantity: number;
  purchaseDate: Date;
  eventDate: Date;
  expectedPaymentDate: Date;
  ticketPrice: number;
  additionalCosts: number;
  expectedRevenue: number;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  revenue: number;
  date: Date;
  description?: string;
}

export interface FinancialSummary {
  totalTickets: number;
  totalInvested: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  totalServices: number;
  totalServiceRevenue: number;
}

export interface CashflowByPeriod {
  period: string;
  invested: number;
  revenue: number;
  profit: number;
  serviceRevenue: number;
}

export type Period = 'week' | 'month' | 'quarter' | 'year';

export interface User {
  id: string;
  username: string;
}
