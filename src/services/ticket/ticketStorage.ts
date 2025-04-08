
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
      id: ticket.id,
      eventName: ticket.event_name,
      quantity: ticket.quantity,
      purchaseDate: new Date(ticket.purchase_date),
      eventDate: new Date(ticket.event_date),
      expectedPaymentDate: new Date(ticket.expected_payment_date),
      ticketPrice: parseFloat(String(ticket.ticket_price)),
      additionalCosts: parseFloat(String(ticket.additional_costs)),
      expectedRevenue: parseFloat(String(ticket.expected_revenue)),
      notes: ticket.notes || undefined
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
  // Ensure we don't include undefined values that can cause issues
  return {
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
