
import { Service } from '../types';
import { debugLog } from '@/lib/debugUtils';
import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import { it } from 'date-fns/locale';

// Chiave per il localStorage
const STORAGE_KEY = 'cashflow-services';

// Carica i servizi dal localStorage
export const getServices = (): Service[] => {
  const servicesJson = localStorage.getItem(STORAGE_KEY);
  if (!servicesJson) return [];
  
  try {
    const services = JSON.parse(servicesJson);
    // Converti stringhe di date in oggetti Date
    const parsedServices = services.map((service: any) => ({
      ...service,
      date: new Date(service.date),
    }));
    
    debugLog('Retrieved services from storage', parsedServices);
    return parsedServices;
  } catch (error) {
    console.error('Error parsing services from localStorage', error);
    debugLog('Error loading services', error);
    return [];
  }
};

// Salva i servizi nel localStorage
export const saveServices = (services: Service[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  debugLog('Saved services to storage', services);
};

// Aggiungi un nuovo servizio
export const addService = (service: Omit<Service, 'id'>): Service => {
  const services = getServices();
  const newService = {
    ...service,
    id: Date.now().toString(),
  };
  
  saveServices([...services, newService]);
  debugLog('Added new service', newService);
  return newService;
};

// Elimina un servizio
export const deleteService = (id: string): void => {
  const services = getServices();
  const updatedServices = services.filter((service) => service.id !== id);
  saveServices(updatedServices);
  debugLog('Deleted service', { id });
};

// Aggiorna un servizio esistente
export const updateService = (updatedService: Service): void => {
  const services = getServices();
  const updatedServices = services.map((service) => 
    service.id === updatedService.id ? updatedService : service
  );
  saveServices(updatedServices);
  debugLog('Updated service', updatedService);
};

// Calcola il totale dei ricavi dai servizi
export const getTotalServiceRevenue = (): number => {
  const services = getServices();
  return services.reduce((sum, service) => sum + service.revenue, 0);
};

// Ottieni il numero totale di servizi
export const getTotalServices = (): number => {
  return getServices().length;
};

// Ottieni i ricavi dei servizi per periodo
export const getServiceRevenueByPeriod = (period: 'week' | 'month' | 'quarter' | 'year'): Record<string, number> => {
  const services = getServices();
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
