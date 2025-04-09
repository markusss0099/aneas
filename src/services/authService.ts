
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';
import { debugLog } from '@/lib/debugUtils';

// Controlla se l'utente è autenticato
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication', error);
      return false;
    }
    
    const hasSession = data.session !== null;
    console.log('Auth check - Session exists:', hasSession);
    
    if (hasSession) {
      // Verifica se il token di sessione è valido
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('Session exists but user invalid:', userError);
        return false;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in isAuthenticated:', error);
    return false;
  }
};

// Ottieni l'utente corrente
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    
    return {
      id: data.session.user.id,
      username: data.session.user.email || 'Utente',
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

// Login con email e password
export const login = async (username: string, password: string): Promise<User> => {
  try {
    // Effettua il login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });
    
    if (error) {
      // Se l'utente non esiste o la password è errata
      if (error.message.includes('Invalid login credentials')) {
        // Proviamo prima a verificare se l'email esiste già provando a fare una registrazione
        const { error: signUpError } = await supabase.auth.signUp({
          email: username,
          password: "temporaryPassword123", // Password temporanea solo per verificare
          options: { 
            emailRedirectTo: window.location.origin 
          }
        });
        
        if (signUpError) {
          // Se la registrazione fallisce perché l'email esiste già
          if (signUpError.message.includes('already registered')) {
            // L'utente esiste ma la password è errata
            throw new Error('Email o Password errata');
          }
          throw new Error(signUpError.message);
        } else {
          // Se arriviamo qui, significa che l'email non esisteva e abbiamo registrato un nuovo utente
          // Eliminiamo questa registrazione temporanea e procediamo con la registrazione reale
          await supabase.auth.signOut();
          
          // Registriamo l'utente con la password reale
          const { data: signUpData, error: realSignUpError } = await supabase.auth.signUp({
            email: username,
            password: password,
          });
          
          if (realSignUpError) {
            throw new Error(realSignUpError.message);
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
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during logout:', error);
      throw error;
    }
    debugLog('Utente disconnesso');
  } catch (error) {
    console.error('Error in logout:', error);
    throw error;
  }
};
