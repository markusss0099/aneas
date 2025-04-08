
import { Ticket } from '../../types';

// Calcola il costo totale per un singolo biglietto (considerando la quantità)
export const calculateTicketTotalCost = (ticket: Ticket): number => {
  return (ticket.ticketPrice + ticket.additionalCosts) * ticket.quantity;
};

// Calcola il ricavo totale
// Importante: expectedRevenue è già il valore totale, non va moltiplicato per la quantità
export const calculateTicketTotalRevenue = (ticket: Ticket): number => {
  return ticket.expectedRevenue;
};

// Calcola il profitto per un biglietto (considerando la quantità per i costi)
export const calculateTicketProfit = (ticket: Ticket): number => {
  return calculateTicketTotalRevenue(ticket) - calculateTicketTotalCost(ticket);
};

// Calcola il margine percentuale
export const calculateTicketMargin = (ticket: Ticket): number => {
  const totalCost = calculateTicketTotalCost(ticket);
  const totalRevenue = calculateTicketTotalRevenue(ticket);
  
  // Per evitare divisione per zero e calcolare il margine sul ricavo invece che sul costo
  return totalRevenue > 0 ? (calculateTicketProfit(ticket) / totalRevenue) * 100 : 0;
};
