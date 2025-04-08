
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

// Calcola il margine per un singolo biglietto
export const calculateTicketMargin = (ticket: Ticket): number => {
  const totalCost = calculateTicketTotalCost(ticket);
  const profit = calculateTicketProfit(ticket);
  return totalCost > 0 ? (profit / totalCost) * 100 : 0;
};
