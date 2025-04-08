
import { Ticket } from '../../types';
import { getTickets, saveTickets } from './ticketStorage';
import { debugLog } from '@/lib/debugUtils';

// Aggiungi un nuovo biglietto
export const addTicket = (ticket: Omit<Ticket, 'id'>): Ticket => {
  const tickets = getTickets();
  const newTicket = {
    ...ticket,
    id: Date.now().toString(),
  };
  
  saveTickets([...tickets, newTicket]);
  debugLog('Added new ticket', newTicket);
  return newTicket;
};

// Elimina un biglietto
export const deleteTicket = (id: string): void => {
  const tickets = getTickets();
  const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
  saveTickets(updatedTickets);
  debugLog('Deleted ticket', { id });
};

// Aggiorna un biglietto esistente
export const updateTicket = (updatedTicket: Ticket): void => {
  const tickets = getTickets();
  const updatedTickets = tickets.map((ticket) => 
    ticket.id === updatedTicket.id ? updatedTicket : ticket
  );
  saveTickets(updatedTickets);
  debugLog('Updated ticket', updatedTicket);
};
