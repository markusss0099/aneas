
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';
import { debugLog } from '@/lib/debugUtils';

// Controlla se l'utente è autenticato
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return data.session !== null;
};

// Ottieni l'utente corrente
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  
  return {
    id: data.session.user.id,
    username: data.session.user.email || 'Utente',
  };
};

// Login con email e password
export const login = async (username: string, password: string): Promise<User> => {
  try {
    // Proviamo prima a effettuare il login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });
    
    if (error) {
      // Se l'utente non esiste, proviamo a registrarlo
      if (error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: username,
          password: password,
        });
        
        if (signUpError) {
          throw new Error(signUpError.message);
        }
        
        // Se l'utente è stato creato correttamente
        if (signUpData.user) {
          debugLog('Nuovo utente registrato', { email: username, id: signUpData.user.id });
          return {
            id: signUpData.user.id,
            username: username,
          };
        }
      }
      
      throw new Error(error.message);
    }
    
    // Login effettuato con successo
    if (data.user) {
      debugLog('Utente loggato', { email: username, id: data.user.id });
      return {
        id: data.user.id,
        username: username,
      };
    }
    
    throw new Error('Login fallito per motivi sconosciuti');
  } catch (error) {
    debugLog('Errore nel login', error);
    throw error;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  debugLog('Utente disconnesso');
};

// Non è più necessario getUserStorageKey poiché utilizziamo il user_id nel database
// con Row Level Security per filtrare i dati
