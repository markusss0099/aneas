
import { Ticket } from '../../types';
import { getUserStorageKey } from '../authService';
import { debugLog } from '@/lib/debugUtils';

// Base key for tickets storage
const BASE_STORAGE_KEY = 'cashflow-tickets';

// Carica i biglietti dal localStorage
export const getTickets = (): Ticket[] => {
  const STORAGE_KEY = getUserStorageKey(BASE_STORAGE_KEY);
  const ticketsJson = localStorage.getItem(STORAGE_KEY);
  if (!ticketsJson) return [];
  
  try {
    const tickets = JSON.parse(ticketsJson);
    // Converti stringhe di date in oggetti Date
    const parsedTickets = tickets.map((ticket: any) => ({
      ...ticket,
      purchaseDate: new Date(ticket.purchaseDate),
      eventDate: new Date(ticket.eventDate),
      expectedPaymentDate: new Date(ticket.expectedPaymentDate),
    }));
    
    debugLog('Retrieved tickets from storage', parsedTickets);
    return parsedTickets;
  } catch (error) {
    console.error('Error parsing tickets from localStorage', error);
    debugLog('Error loading tickets', error);
    return [];
  }
};

// Salva i biglietti nel localStorage
export const saveTickets = (tickets: Ticket[]): void => {
  const STORAGE_KEY = getUserStorageKey(BASE_STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  debugLog('Saved tickets to storage', tickets);
};
