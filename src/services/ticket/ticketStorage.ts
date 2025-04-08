
import { Ticket } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/lib/debugUtils';

// Carica i biglietti da Supabase
export const getTickets = async (): Promise<Ticket[]> => {
  try {
    // Ottieni l'utente corrente
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      debugLog('User not authenticated, cannot fetch tickets', userError);
      return [];
    }
    
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tickets from Supabase', error);
      debugLog('Error loading tickets', error);
      return [];
    }
    
    // Converti stringhe di date in oggetti Date
    const parsedTickets = data.map((ticket: any) => ({
      ...ticket,
      id: ticket.id,
      purchaseDate: new Date(ticket.purchase_date),
      eventDate: new Date(ticket.event_date),
      expectedPaymentDate: new Date(ticket.expected_payment_date),
      eventName: ticket.event_name,
      ticketPrice: parseFloat(ticket.ticket_price),
      additionalCosts: parseFloat(ticket.additional_costs),
      expectedRevenue: parseFloat(ticket.expected_revenue),
    }));
    
    debugLog('Retrieved tickets from Supabase', parsedTickets);
    return parsedTickets;
  } catch (error) {
    console.error('Error parsing tickets from Supabase', error);
    debugLog('Error loading tickets', error);
    return [];
  }
};

// Converte un Ticket per l'invio a Supabase
export const ticketToSupabase = (ticket: Ticket): any => {
  return {
    id: ticket.id,
    event_name: ticket.eventName,
    quantity: ticket.quantity,
    purchase_date: ticket.purchaseDate.toISOString(),
    event_date: ticket.eventDate.toISOString(),
    expected_payment_date: ticket.expectedPaymentDate.toISOString(),
    ticket_price: ticket.ticketPrice,
    additional_costs: ticket.additionalCosts,
    expected_revenue: ticket.expectedRevenue,
    notes: ticket.notes || null
  };
};
