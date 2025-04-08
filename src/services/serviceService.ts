
import { Service } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/lib/debugUtils';

// Ottieni i servizi
export const getServices = async (): Promise<Service[]> => {
  try {
    // Ottieni l'utente corrente
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("Utente non autenticato");
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('date', { ascending: false });

    if (error) {
      debugLog('Error getting services', error);
      throw error;
    }

    // Converti il risultato nella struttura Service
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      revenue: parseFloat(item.revenue),
      date: new Date(item.date),
      description: item.description
    }));

  } catch (error) {
    debugLog('Exception getting services', error);
    throw error;
  }
};

// Aggiungi un nuovo servizio
export const addService = async (service: Omit<Service, 'id'>): Promise<Service> => {
  try {
    // Ottieni l'utente corrente
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("Utente non autenticato");
    }

    const user_id = userData.user.id;

    // Prepara i dati per Supabase
    const serviceData = {
      name: service.name,
      revenue: service.revenue,
      date: service.date.toISOString(),
      description: service.description || null,
      user_id
    };

    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      debugLog('Error adding service', error);
      throw error;
    }

    // Converti il risultato nella struttura Service
    return {
      id: data.id,
      name: data.name,
      revenue: parseFloat(data.revenue),
      date: new Date(data.date),
      description: data.description
    };

  } catch (error) {
    debugLog('Exception adding service', error);
    throw error;
  }
};

// Aggiorna un servizio esistente
export const updateService = async (service: Service): Promise<void> => {
  try {
    // Ottieni l'utente corrente
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("Utente non autenticato");
    }

    // Prepara i dati per Supabase
    const serviceData = {
      name: service.name,
      revenue: service.revenue,
      date: service.date.toISOString(),
      description: service.description || null
    };

    const { error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', service.id)
      .eq('user_id', userData.user.id);

    if (error) {
      debugLog('Error updating service', error);
      throw error;
    }
  } catch (error) {
    debugLog('Exception updating service', error);
    throw error;
  }
};

// Delete service with explicit string type for id
export const deleteService = async (id: string): Promise<void> => {
  try {
    // Ottieni l'utente corrente
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("Utente non autenticato");
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);

    if (error) {
      debugLog('Error deleting service', error);
      throw error;
    }
  } catch (error) {
    debugLog('Exception deleting service', error);
    throw error;
  }
};
