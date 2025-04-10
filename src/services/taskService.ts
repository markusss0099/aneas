
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/lib/debugUtils';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Ottieni tutte le attività dell'utente corrente
export const getTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Errore nel recupero delle attività:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Errore in getTasks:', error);
    return [];
  }
};

// Aggiungi una nuova attività
export const addTask = async (title: string, description?: string): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          title, 
          description: description || null
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Errore nella creazione dell\'attività:', error);
      throw error;
    }
    
    debugLog('Attività creata', data);
    return data;
  } catch (error) {
    console.error('Errore in addTask:', error);
    return null;
  }
};

// Aggiorna lo stato di un'attività (completata o non completata)
export const updateTaskStatus = async (id: string, completed: boolean): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Errore nell\'aggiornamento dello stato dell\'attività:', error);
      throw error;
    }
    
    debugLog('Stato attività aggiornato', { id, completed });
    return data;
  } catch (error) {
    console.error('Errore in updateTaskStatus:', error);
    return null;
  }
};

// Aggiorna i dettagli di un'attività
export const updateTask = async (id: string, updates: { title?: string; description?: string }): Promise<Task | null> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Errore nell\'aggiornamento dell\'attività:', error);
      throw error;
    }
    
    debugLog('Attività aggiornata', { id, updates });
    return data;
  } catch (error) {
    console.error('Errore in updateTask:', error);
    return null;
  }
};

// Elimina un'attività
export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Errore nell\'eliminazione dell\'attività:', error);
      throw error;
    }
    
    debugLog('Attività eliminata', { id });
    return true;
  } catch (error) {
    console.error('Errore in deleteTask:', error);
    return false;
  }
};
