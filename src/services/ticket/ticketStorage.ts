
import { Ticket } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/lib/debugUtils';

// Carica i biglietti da Supabase con ottimizzazione per performance
export const getTickets = async (): Promise<Ticket[]> => {
  try {
    // Ottieni l'utente corrente una sola volta e memorizza il risultato
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      debugLog('User not authenticated, cannot fetch tickets', userError);
      return [];
    }
    
    // Usa una query ottimizzata che seleziona solo i campi necessari
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
    
    // Usa una funzione di mappatura ottimizzata
    return data.map((ticket: any) => ({
      id: ticket.id,
      eventName: ticket.event_name,
      quantity: ticket.quantity,
      purchaseDate: new Date(ticket.purchase_date),
      eventDate: new Date(ticket.event_date),
      expectedPaymentDate: new Date(ticket.expected_payment_date),
      ticketPrice: parseFloat(String(ticket.ticket_price)),
      additionalCosts: parseFloat(String(ticket.additional_costs)),
      expectedRevenue: parseFloat(String(ticket.expected_revenue)),
      notes: ticket.notes || undefined,
      viagogoLink: ticket.viagogo_link || undefined
    }));
    
  } catch (error) {
    console.error('Error parsing tickets from Supabase', error);
    debugLog('Error loading tickets', error);
    return [];
  }
};

// Converti un Ticket per l'invio a Supabase - ottimizzato
export const ticketToSupabase = (ticket: Ticket): any => {
  // Definiamo direttamente l'oggetto completo per evitare operazioni aggiuntive
  return {
    event_name: ticket.eventName,
    quantity: ticket.quantity,
    purchase_date: ticket.purchaseDate.toISOString(),
    event_date: ticket.eventDate.toISOString(),
    expected_payment_date: ticket.expectedPaymentDate.toISOString(),
    ticket_price: ticket.ticketPrice,
    additional_costs: ticket.additionalCosts,
    expected_revenue: ticket.expectedRevenue,
    notes: ticket.notes || null,
    viagogo_link: ticket.viagogoLink || null
  };
};
