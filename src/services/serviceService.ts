
import { Service } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/lib/debugUtils';

// Ottieni tutti i servizi
export const getServices = async (): Promise<Service[]> => {
  try {
    // Ottieni l'utente corrente
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      debugLog('User not authenticated, cannot fetch services', userError);
      return [];
    }
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching services', error);
      return [];
    }
    
    return data.map((service: any) => ({
      id: service.id,
      name: service.name,
      revenue: parseFloat(service.revenue),
      date: new Date(service.date),
      description: service.description,
    }));
  } catch (error) {
    console.error('Error in getServices', error);
    return [];
  }
};

// Aggiungi un nuovo servizio
export const addService = async (service: Omit<Service, 'id'>): Promise<Service> => {
  // Ottieni l'utente corrente
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    debugLog('Error getting user', userError);
    throw new Error("Utente non autenticato");
  }
  
  const { data, error } = await supabase
    .from('services')
    .insert([{
      name: service.name,
      revenue: service.revenue,
      date: service.date.toISOString(),
      description: service.description || null,
      user_id: userData.user.id
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding service', error);
    throw new Error(`Errore nell'aggiunta del servizio: ${error.message}`);
  }
  
  return {
    id: data.id,
    name: data.name,
    revenue: parseFloat(data.revenue),
    date: new Date(data.date),
    description: data.description,
  };
};

// Aggiorna un servizio esistente
export const updateService = async (service: Service): Promise<void> => {
  // Ottieni l'utente corrente
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    debugLog('Error getting user', userError);
    throw new Error("Utente non autenticato");
  }
  
  const { error } = await supabase
    .from('services')
    .update({
      name: service.name,
      revenue: service.revenue,
      date: service.date.toISOString(),
      description: service.description || null
    })
    .eq('id', service.id)
    .eq('user_id', userData.user.id);
  
  if (error) {
    console.error('Error updating service', error);
    throw new Error(`Errore nell'aggiornamento del servizio: ${error.message}`);
  }
};

// Elimina un servizio
export const deleteService = async (id: string): Promise<void> => {
  // Ottieni l'utente corrente
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    debugLog('Error getting user', userError);
    throw new Error("Utente non autenticato");
  }
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id);
  
  if (error) {
    console.error('Error deleting service', error);
    throw new Error(`Errore nell'eliminazione del servizio: ${error.message}`);
  }
};
