
import { Ticket, FinancialSummary, CashflowByPeriod, Period } from '../../types';
import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear, isSameWeek, isSameMonth, isSameQuarter, isSameYear } from 'date-fns';
import { it } from 'date-fns/locale';
import { debugLog } from '@/lib/debugUtils';
import { getServices, getTotalServiceRevenue, getServiceRevenueByPeriod } from '../serviceService';
import { getTickets } from './ticketStorage';
import { calculateTicketTotalCost, calculateTicketTotalRevenue, calculateTicketProfit } from './ticketCalculations';

// Ottieni il sommario finanziario
export const getFinancialSummary = async (): Promise<FinancialSummary> => {
  const tickets = await getTickets();
  const services = await getServices();
  const totalServiceRevenue = await getTotalServiceRevenue();
  
  const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const totalInvested = tickets.reduce((sum, ticket) => 
    sum + calculateTicketTotalCost(ticket), 0);
  const totalRevenue = tickets.reduce((sum, ticket) => 
    sum + calculateTicketTotalRevenue(ticket), 0);
  const totalProfit = totalRevenue - totalInvested;
  const profitMargin = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  
  const totalServices = services.length;
  
  const summary: FinancialSummary = {
    totalTickets,
    totalInvested,
    totalRevenue,
    totalProfit,
    profitMargin,
    totalServices,
    totalServiceRevenue,
  };
  
  debugLog('Generated financial summary', summary);
  return summary;
};

// Ottieni i dati del cashflow per periodo
export const getCashflowByPeriod = async (period: Period): Promise<CashflowByPeriod[]> => {
  const tickets = await getTickets();
  const result: Record<string, CashflowByPeriod> = {};
  
  const getPeriodStart = (date: Date): Date => {
    switch(period) {
      case 'week': return startOfWeek(date, { locale: it });
      case 'month': return startOfMonth(date);
      case 'quarter': return startOfQuarter(date);
      case 'year': return startOfYear(date);
    }
  };
  
  const formatPeriod = (date: Date): string => {
    switch(period) {
      case 'week': return `Settimana ${format(date, 'w')} - ${format(date, 'yyyy')}`;
      case 'month': return format(date, 'MMMM yyyy', { locale: it });
      case 'quarter': return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      case 'year': return format(date, 'yyyy');
    }
  };
  
  const isSamePeriod = (date1: Date, date2: Date): boolean => {
    switch(period) {
      case 'week': return isSameWeek(date1, date2, { locale: it });
      case 'month': return isSameMonth(date1, date2);
      case 'quarter': return isSameQuarter(date1, date2);
      case 'year': return isSameYear(date1, date2);
    }
  };
  
  tickets.forEach(ticket => {
    const purchasePeriod = formatPeriod(getPeriodStart(ticket.purchaseDate));
    const eventPeriod = formatPeriod(getPeriodStart(ticket.eventDate));
    const paymentPeriod = formatPeriod(getPeriodStart(ticket.expectedPaymentDate));
    
    if (!result[purchasePeriod]) {
      result[purchasePeriod] = { 
        period: purchasePeriod, 
        invested: 0, 
        revenue: 0, 
        profit: 0,
        serviceRevenue: 0 
      };
    }
    
    if (!result[paymentPeriod]) {
      result[paymentPeriod] = { 
        period: paymentPeriod, 
        invested: 0, 
        revenue: 0, 
        profit: 0,
        serviceRevenue: 0 
      };
    }
    
    result[purchasePeriod].invested += calculateTicketTotalCost(ticket);
    
    result[paymentPeriod].revenue += calculateTicketTotalRevenue(ticket);
    result[paymentPeriod].profit += calculateTicketProfit(ticket);
  });
  
  const serviceRevenueByPeriod = await getServiceRevenueByPeriod(period);
  
  Object.entries(serviceRevenueByPeriod).forEach(([periodKey, revenue]) => {
    if (!result[periodKey]) {
      result[periodKey] = { 
        period: periodKey, 
        invested: 0, 
        revenue: 0, 
        profit: 0,
        serviceRevenue: 0
      };
    }
    
    result[periodKey].serviceRevenue = revenue;
  });
  
  return Object.values(result).sort((a, b) => a.period.localeCompare(b.period));
};
