
import { Ticket } from '../../types';

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

// Calcola il margine percentuale per un singolo biglietto
export const calculateTicketMargin = (ticket: Ticket): number => {
  const totalCost = calculateTicketTotalCost(ticket);
  const totalRevenue = calculateTicketTotalRevenue(ticket);
  
  // Per evitare divisione per zero e calcolare il margine sul ricavo invece che sul costo
  return totalRevenue > 0 ? (calculateTicketProfit(ticket) / totalRevenue) * 100 : 0;
};
