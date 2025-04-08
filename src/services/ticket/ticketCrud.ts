
import { Ticket } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { ticketToSupabase, getTickets } from './ticketStorage';
import { debugLog } from '@/lib/debugUtils';

// Aggiungi un nuovo biglietto
export const addTicket = async (ticket: Omit<Ticket, 'id'>): Promise<Ticket> => {
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;
  
  if (!user_id) {
    throw new Error("Utente non autenticato");
  }
  
  const ticketData = {
    ...ticketToSupabase(ticket as Ticket),
    user_id
  };
  
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticketData])
    .select()
    .single();
  
  if (error) {
    debugLog('Error adding ticket', error);
    throw new Error(`Errore nell'aggiunta del biglietto: ${error.message}`);
  }
  
  // Converti il risultato nel formato Ticket
  const newTicket: Ticket = {
    ...ticket,
    id: data?.id || '',
  };
  
  debugLog('Added new ticket', newTicket);
  return newTicket;
};

// Elimina un biglietto
export const deleteTicket = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', id);
  
  if (error) {
    debugLog('Error deleting ticket', error);
    throw new Error(`Errore nell'eliminazione del biglietto: ${error.message}`);
  }
  
  debugLog('Deleted ticket', { id });
};

// Aggiorna un biglietto esistente
export const updateTicket = async (updatedTicket: Ticket): Promise<void> => {
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;
  
  if (!user_id) {
    throw new Error("Utente non autenticato");
  }
  
  const ticketData = {
    ...ticketToSupabase(updatedTicket),
    user_id
  };
  
  const { error } = await supabase
    .from('tickets')
    .update(ticketData)
    .eq('id', updatedTicket.id);
  
  if (error) {
    debugLog('Error updating ticket', error);
    throw new Error(`Errore nell'aggiornamento del biglietto: ${error.message}`);
  }
  
  debugLog('Updated ticket', updatedTicket);
};
