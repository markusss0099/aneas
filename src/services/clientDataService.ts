
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/lib/debugUtils';

export interface ClientDataFile {
  id: string;
  title: string;
  filename: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Get all client data files for the current user
 * @returns Promise with array of client data files
 */
export const getClientDataFiles = async (): Promise<ClientDataFile[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Nessun utente autenticato');
      return [];
    }
    
    const { data, error } = await supabase
      .from('client_data_files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Errore nel recupero dei file di dati cliente:', error);
      throw error;
    }
    
    return data as ClientDataFile[] || [];
  } catch (error) {
    console.error('Errore in getClientDataFiles:', error);
    return [];
  }
};

/**
 * Add a new client data file
 * @param title Title of the file
 * @param file File to upload
 * @returns Promise with the created client data file
 */
export const addClientDataFile = async (title: string, file: File): Promise<ClientDataFile | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Nessun utente autenticato');
      return null;
    }

    // Create a unique filename with timestamp
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${user.id}/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('client_data')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Errore nel caricamento del file:', uploadError);
      throw uploadError;
    }

    // Create database record
    const { data, error } = await supabase
      .from('client_data_files')
      .insert([
        { 
          title,
          filename: fileName,
          user_id: user.id,
        }
      ])
      .select()
      .single();
    
    if (error) {
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage
        .from('client_data')
        .remove([filePath]);
        
      console.error('Errore nella creazione del record del file:', error);
      throw error;
    }
    
    debugLog('File dati cliente creato', data);
    return data as ClientDataFile;
  } catch (error) {
    console.error('Errore in addClientDataFile:', error);
    return null;
  }
};

/**
 * Download a client data file
 * @param filename Filename to download
 * @returns Promise with the download URL
 */
export const downloadClientDataFile = async (filename: string): Promise<string | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Nessun utente autenticato');
      return null;
    }

    // Create a download URL that expires in 10 minutes with download flag
    const { data, error } = await supabase.storage
      .from('client_data')
      .createSignedUrl(`${user.id}/${filename}`, 600, {
        download: filename.substring(filename.indexOf('_') + 1),
        transform: {}, // No transformations
      });
    
    if (error) {
      console.error('Errore nella creazione del link di download:', error);
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Errore in downloadClientDataFile:', error);
    return null;
  }
};

/**
 * Delete a client data file
 * @param id ID of the file record
 * @param filename Filename to delete
 * @returns Promise with deletion success status
 */
export const deleteClientDataFile = async (id: string, filename: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Nessun utente autenticato');
      return false;
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('client_data')
      .remove([`${user.id}/${filename}`]);
    
    if (storageError) {
      console.error('Errore nell\'eliminazione del file dallo storage:', storageError);
      throw storageError;
    }

    // Delete database record
    const { error } = await supabase
      .from('client_data_files')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Additional security check
    
    if (error) {
      console.error('Errore nell\'eliminazione del record del file:', error);
      throw error;
    }
    
    debugLog('File dati cliente eliminato', { id, filename });
    return true;
  } catch (error) {
    console.error('Errore in deleteClientDataFile:', error);
    return false;
  }
};
