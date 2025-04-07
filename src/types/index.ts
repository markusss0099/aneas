
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

export interface FinancialSummary {
  totalTickets: number;
  totalInvested: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
}

export interface CashflowByPeriod {
  period: string;
  invested: number;
  revenue: number;
  profit: number;
}

export type Period = 'week' | 'month' | 'quarter' | 'year';
