
import { Ticket, FinancialSummary, CashflowByPeriod, Period } from '../types';
import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear, isSameWeek, isSameMonth, isSameQuarter, isSameYear } from 'date-fns';
import { it } from 'date-fns/locale';

// Simuliamo la persistenza dei dati con localStorage
const STORAGE_KEY = 'cashflow-tickets';

// Carica i biglietti dal localStorage
export const getTickets = (): Ticket[] => {
  const ticketsJson = localStorage.getItem(STORAGE_KEY);
  if (!ticketsJson) return [];
  
  try {
    const tickets = JSON.parse(ticketsJson);
    // Converti stringhe di date in oggetti Date
    return tickets.map((ticket: any) => ({
      ...ticket,
      purchaseDate: new Date(ticket.purchaseDate),
      eventDate: new Date(ticket.eventDate),
      expectedPaymentDate: new Date(ticket.expectedPaymentDate),
    }));
  } catch (error) {
    console.error('Error parsing tickets from localStorage', error);
    return [];
  }
};

// Salva i biglietti nel localStorage
export const saveTickets = (tickets: Ticket[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

// Aggiungi un nuovo biglietto
export const addTicket = (ticket: Omit<Ticket, 'id'>): Ticket => {
  const tickets = getTickets();
  const newTicket = {
    ...ticket,
    id: Date.now().toString(),
  };
  
  saveTickets([...tickets, newTicket]);
  return newTicket;
};

// Elimina un biglietto
export const deleteTicket = (id: string): void => {
  const tickets = getTickets();
  const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
  saveTickets(updatedTickets);
};

// Aggiorna un biglietto esistente
export const updateTicket = (updatedTicket: Ticket): void => {
  const tickets = getTickets();
  const updatedTickets = tickets.map((ticket) => 
    ticket.id === updatedTicket.id ? updatedTicket : ticket
  );
  saveTickets(updatedTickets);
};

// Calcola il costo totale per un singolo biglietto (considerando la quantità)
export const calculateTicketTotalCost = (ticket: Ticket): number => {
  return (ticket.ticketPrice + ticket.additionalCosts) * ticket.quantity;
};

// Calcola il ricavo totale per un singolo biglietto (considerando la quantità)
export const calculateTicketTotalRevenue = (ticket: Ticket): number => {
  return ticket.expectedRevenue * ticket.quantity;
};

// Calcola il profitto per un singolo biglietto (considerando la quantità)
export const calculateTicketProfit = (ticket: Ticket): number => {
  return calculateTicketTotalRevenue(ticket) - calculateTicketTotalCost(ticket);
};

// Calcola il margine per un singolo biglietto
export const calculateTicketMargin = (ticket: Ticket): number => {
  const totalCost = calculateTicketTotalCost(ticket);
  const profit = calculateTicketProfit(ticket);
  return totalCost > 0 ? (profit / totalCost) * 100 : 0;
};

// Ottieni il sommario finanziario
export const getFinancialSummary = (): FinancialSummary => {
  const tickets = getTickets();
  
  const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const totalInvested = tickets.reduce((sum, ticket) => 
    sum + calculateTicketTotalCost(ticket), 0);
  const totalRevenue = tickets.reduce((sum, ticket) => 
    sum + calculateTicketTotalRevenue(ticket), 0);
  const totalProfit = totalRevenue - totalInvested;
  const profitMargin = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  
  return {
    totalTickets,
    totalInvested,
    totalRevenue,
    totalProfit,
    profitMargin,
  };
};

// Ottieni i dati del cashflow per periodo
export const getCashflowByPeriod = (period: Period): CashflowByPeriod[] => {
  const tickets = getTickets();
  const result: Record<string, CashflowByPeriod> = {};
  
  // Funzioni di raggruppamento per periodo
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
  
  // Processa i dati dei biglietti
  tickets.forEach(ticket => {
    // Calcola i periodi per ogni data importante
    const purchasePeriod = formatPeriod(getPeriodStart(ticket.purchaseDate));
    const eventPeriod = formatPeriod(getPeriodStart(ticket.eventDate));
    const paymentPeriod = formatPeriod(getPeriodStart(ticket.expectedPaymentDate));
    
    // Inizializza periodi se non esistono
    if (!result[purchasePeriod]) {
      result[purchasePeriod] = { 
        period: purchasePeriod, 
        invested: 0, 
        revenue: 0, 
        profit: 0 
      };
    }
    
    if (!result[paymentPeriod]) {
      result[paymentPeriod] = { 
        period: paymentPeriod, 
        invested: 0, 
        revenue: 0, 
        profit: 0 
      };
    }
    
    // Aggiorna investimenti nel periodo di acquisto
    result[purchasePeriod].invested += calculateTicketTotalCost(ticket);
    
    // Aggiorna ricavi e profitti nel periodo di pagamento atteso
    result[paymentPeriod].revenue += calculateTicketTotalRevenue(ticket);
    result[paymentPeriod].profit += calculateTicketProfit(ticket);
  });
  
  // Converti l'oggetto in array e ordina per periodo
  return Object.values(result).sort((a, b) => a.period.localeCompare(b.period));
};
