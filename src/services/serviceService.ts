
import { Service } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/lib/debugUtils';
import { Period } from '@/types';
import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear, isSameWeek, isSameMonth, isSameQuarter, isSameYear } from 'date-fns';
import { it } from 'date-fns/locale';

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

// Delete service with explicit string type for id
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

// Ottieni il totale dei ricavi dai servizi
export const getTotalServiceRevenue = async (): Promise<number> => {
  try {
    const services = await getServices();
    const totalRevenue = services.reduce((sum, service) => sum + service.revenue, 0);
    return totalRevenue;
  } catch (error) {
    console.error('Error calculating total service revenue', error);
    return 0;
  }
};

// Ottieni i ricavi dei servizi per periodo (settimana, mese, trimestre, anno)
export const getServiceRevenueByPeriod = async (period: Period): Promise<Record<string, number>> => {
  try {
    const services = await getServices();
    const result: Record<string, number> = {};
    
    const getPeriodStart = (date: Date): Date => {
      switch(period) {
        case 'week': return startOfWeek(date, { locale: it });
        case 'month': return startOfMonth(date);
        case 'quarter': return startOfQuarter(date);
        case 'year': return startOfYear(date);
      }
    };
    
    const formatPeriod = (date: Date): string => {
      switch(period) {
        case 'week': return `Settimana ${format(date, 'w')} - ${format(date, 'yyyy')}`;
        case 'month': return format(date, 'MMMM yyyy', { locale: it });
        case 'quarter': return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
        case 'year': return format(date, 'yyyy');
      }
    };
    
    services.forEach(service => {
      const periodKey = formatPeriod(getPeriodStart(service.date));
      
      if (!result[periodKey]) {
        result[periodKey] = 0;
      }
      
      result[periodKey] += service.revenue;
    });
    
    return result;
  } catch (error) {
    console.error('Error calculating service revenue by period', error);
    return {};
  }
};
