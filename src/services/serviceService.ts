import { supabase } from '@/lib/supabase';
import { Service } from '@/types';

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

// Fix the type error on line 138 by converting the number to string
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
