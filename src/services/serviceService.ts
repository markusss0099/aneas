
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types';
import { format, startOfWeek, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import { it } from 'date-fns/locale';

export const getAllServices = async (): Promise<Service[]> => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*');

    if (error) {
      console.error("Error fetching services:", error);
      throw error;
    }

    return services || [];
  } catch (error) {
    console.error("Failed to fetch all services:", error);
    return [];
  }
};

// Alias for getAllServices to maintain compatibility
export const getServices = getAllServices;

export const createService = async (service: Omit<Service, 'id' | 'created_at'>): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select('*')
      .single();

    if (error) {
      console.error("Error creating service:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to create service:", error);
    return null;
  }
};

// Alias for createService to maintain compatibility
export const addService = createService;

export const updateService = async (id: string, updates: Partial<Omit<Service, 'id' | 'created_at'>>): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating service:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Failed to update service:", error);
    return null;
  }
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting service:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Failed to delete service:", error);
    return false;
  }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    return null;
  }
};

// Calculate total revenue from all services
export const getTotalServiceRevenue = async (): Promise<number> => {
  try {
    const services = await getAllServices();
    return services.reduce((total, service) => total + (service.revenue || 0), 0);
  } catch (error) {
    console.error('Error calculating total service revenue:', error);
    return 0;
  }
};

// Get service revenue grouped by period (week, month, quarter, year)
export const getServiceRevenueByPeriod = async (period: 'week' | 'month' | 'quarter' | 'year'): Promise<Record<string, number>> => {
  try {
    const services = await getAllServices();
    const revenueByPeriod: Record<string, number> = {};
    
    // Helper to get the start of a period
    const getPeriodStart = (date: Date): Date => {
      switch(period) {
        case 'week': return startOfWeek(date, { locale: it });
        case 'month': return startOfMonth(date);
        case 'quarter': return startOfQuarter(date);
        case 'year': return startOfYear(date);
      }
    };
    
    // Format period key
    const formatPeriod = (date: Date): string => {
      switch(period) {
        case 'week': return `Settimana ${format(date, 'w')} - ${format(date, 'yyyy')}`;
        case 'month': return format(date, 'MMMM yyyy', { locale: it });
        case 'quarter': return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
        case 'year': return format(date, 'yyyy');
      }
    };
    
    services.forEach(service => {
      const serviceDate = new Date(service.date);
      const periodKey = formatPeriod(getPeriodStart(serviceDate));
      
      if (!revenueByPeriod[periodKey]) {
        revenueByPeriod[periodKey] = 0;
      }
      
      revenueByPeriod[periodKey] += service.revenue;
    });
    
    return revenueByPeriod;
  } catch (error) {
    console.error('Error calculating service revenue by period:', error);
    return {};
  }
};
