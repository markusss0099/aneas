
import { Service } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/lib/debugUtils';
import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear, isSameWeek, isSameMonth, isSameQuarter, isSameYear } from 'date-fns';
import { it } from 'date-fns/locale';

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

// Calcola il totale dei ricavi dei servizi
export const getTotalServiceRevenue = async (): Promise<number> => {
  try {
    const services = await getServices();
    return services.reduce((total, service) => total + service.revenue, 0);
  } catch (error) {
    debugLog('Error getting total service revenue', error);
    return 0;
  }
};

// Ottieni i ricavi dei servizi suddivisi per periodo
export const getServiceRevenueByPeriod = async (period: 'week' | 'month' | 'quarter' | 'year'): Promise<Record<string, number>> => {
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
    
    const isSamePeriod = (date1: Date, date2: Date): boolean => {
      switch(period) {
        case 'week': return isSameWeek(date1, date2, { locale: it });
        case 'month': return isSameMonth(date1, date2);
        case 'quarter': return isSameQuarter(date1, date2);
        case 'year': return isSameYear(date1, date2);
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
    debugLog('Error getting service revenue by period', error);
    return {};
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

// Delete service - ensure id is always a string
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
