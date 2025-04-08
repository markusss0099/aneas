
import { Service } from '../types';
import { debugLog } from '@/lib/debugUtils';
import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import { it } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

// Carica i servizi da Supabase
export const getServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching services from Supabase', error);
      debugLog('Error loading services', error);
      return [];
    }
    
    // Converti stringhe di date in oggetti Date
    const parsedServices = data.map((service: any) => ({
      id: service.id,
      name: service.name,
      revenue: parseFloat(service.revenue),
      date: new Date(service.date),
      description: service.description,
    }));
    
    debugLog('Retrieved services from Supabase', parsedServices);
    return parsedServices;
  } catch (error) {
    console.error('Error parsing services from Supabase', error);
    debugLog('Error loading services', error);
    return [];
  }
};

// Converte un Service per l'invio a Supabase
const serviceToSupabase = (service: Service): any => {
  return {
    id: service.id,
    name: service.name,
    revenue: service.revenue,
    date: service.date.toISOString(),
    description: service.description || null,
  };
};

// Aggiungi un nuovo servizio
export const addService = async (service: Omit<Service, 'id'>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceToSupabase(service as Service)])
    .select()
    .single();
  
  if (error) {
    debugLog('Error adding service', error);
    throw new Error(`Errore nell'aggiunta del servizio: ${error.message}`);
  }
  
  const newService: Service = {
    ...service,
    id: data.id,
  };
  
  debugLog('Added new service', newService);
  return newService;
};

// Elimina un servizio
export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    debugLog('Error deleting service', error);
    throw new Error(`Errore nell'eliminazione del servizio: ${error.message}`);
  }
  
  debugLog('Deleted service', { id });
};

// Aggiorna un servizio esistente
export const updateService = async (updatedService: Service): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .update(serviceToSupabase(updatedService))
    .eq('id', updatedService.id);
  
  if (error) {
    debugLog('Error updating service', error);
    throw new Error(`Errore nell'aggiornamento del servizio: ${error.message}`);
  }
  
  debugLog('Updated service', updatedService);
};

// Calcola il totale dei ricavi dai servizi
export const getTotalServiceRevenue = async (): Promise<number> => {
  const services = await getServices();
  return services.reduce((sum, service) => sum + service.revenue, 0);
};

// Ottieni il numero totale di servizi
export const getTotalServices = async (): Promise<number> => {
  const services = await getServices();
  return services.length;
};

// Ottieni i ricavi dei servizi per periodo
export const getServiceRevenueByPeriod = async (period: 'week' | 'month' | 'quarter' | 'year'): Promise<Record<string, number>> => {
  const services = await getServices();
  const revenueByPeriod: Record<string, number> = {};
  
  // Funzioni di raggruppamento per periodo
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
  
  // Processa i dati dei servizi
  services.forEach(service => {
    const periodKey = formatPeriod(getPeriodStart(service.date));
    
    if (!revenueByPeriod[periodKey]) {
      revenueByPeriod[periodKey] = 0;
    }
    
    revenueByPeriod[periodKey] += service.revenue;
  });
  
  return revenueByPeriod;
};
