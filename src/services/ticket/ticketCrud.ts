
import { Ticket } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { ticketToSupabase, getTickets } from './ticketStorage';
import { debugLog } from '@/lib/debugUtils';

// Aggiungi un nuovo biglietto
export const addTicket = async (ticket: Omit<Ticket, 'id'>): Promise<Ticket> => {
  try {
    // Ottieni l'utente corrente
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      debugLog('Error getting user', userError);
      throw new Error("Utente non autenticato");
    }
    
    const user_id = userData.user.id;
    
    const ticketData = {
      ...ticketToSupabase(ticket as Ticket),
      user_id
    };
    
    debugLog('Adding ticket with data', ticketData);
    
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select()
      .single();
    
    if (error) {
      debugLog('Error adding ticket', error);
      throw new Error(`Errore nell'aggiunta del biglietto: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Nessun dato restituito dopo l'aggiunta del biglietto");
    }
    
    // Converti il risultato nel formato Ticket
    const newTicket: Ticket = {
      id: data.id,
      eventName: data.event_name,
      quantity: data.quantity,
      purchaseDate: new Date(data.purchase_date),
      eventDate: new Date(data.event_date),
      expectedPaymentDate: new Date(data.expected_payment_date),
      ticketPrice: parseFloat(String(data.ticket_price)),
      additionalCosts: parseFloat(String(data.additional_costs)),
      expectedRevenue: parseFloat(String(data.expected_revenue)),
      notes: data.notes || undefined
    };
    
    debugLog('Added new ticket', newTicket);
    return newTicket;
  } catch (error) {
    debugLog('Exception adding ticket', error);
    throw error;
  }
};

// Elimina un biglietto
export const deleteTicket = async (id: string): Promise<void> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("Utente non autenticato");
    }
    
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);
    
    if (error) {
      debugLog('Error deleting ticket', error);
      throw new Error(`Errore nell'eliminazione del biglietto: ${error.message}`);
    }
    
    debugLog('Deleted ticket', { id });
  } catch (error) {
    debugLog('Exception deleting ticket', error);
    throw error;
  }
};

// Aggiorna un biglietto esistente
export const updateTicket = async (updatedTicket: Ticket): Promise<void> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("Utente non autenticato");
    }
    
    const user_id = userData.user.id;
    
    const ticketData = {
      ...ticketToSupabase(updatedTicket),
      user_id
    };
    
    const { error } = await supabase
      .from('tickets')
      .update(ticketData)
      .eq('id', updatedTicket.id)
      .eq('user_id', user_id);
    
    if (error) {
      debugLog('Error updating ticket', error);
      throw new Error(`Errore nell'aggiornamento del biglietto: ${error.message}`);
    }
    
    debugLog('Updated ticket', updatedTicket);
  } catch (error) {
    debugLog('Exception updating ticket', error);
    throw error;
  }
};
