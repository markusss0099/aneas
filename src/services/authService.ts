
// Servizio semplice di autenticazione che utilizza localStorage per persistere l'utente
import { debugLog } from "@/lib/debugUtils";

export interface User {
  id: string;
  username: string;
}

const AUTH_KEY = 'cashflow_auth_user';

// Controlla se l'utente è autenticato
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) !== null;
};

// Ottieni l'utente corrente
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(AUTH_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    debugLog('Errore nel parsing dell\'utente salvato', error);
    return null;
  }
};

// Genera una chiave utente per localStorage
export const getUserStorageKey = (key: string): string => {
  const user = getCurrentUser();
  if (!user) return key;
  return `${key}_${user.id}`;
};

// Login semplice con username/password
export const login = (username: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simuliamo un ritardo come per le altre operazioni
    setTimeout(() => {
      // Semplice validazione - nella realtà, dovrebbe controllare 
      // le credenziali con un server
      if (!username || !password) {
        reject(new Error('Username e password richiesti'));
        return;
      }
      
      // Per questo esempio, accettiamo qualsiasi username/password 
      // Se vuoi un controllo più realistico, puoi usare credenziali hardcoded
      if (password.length < 4) {
        reject(new Error('La password deve essere di almeno 4 caratteri'));
        return;
      }
      
      // Genera un ID deterministico basato sull'username e password
      // In questo modo lo stesso utente avrà sempre lo stesso ID su ogni dispositivo
      const hash = btoa(`${username}:${password}`);
      const id = `user_${hash.substring(0, 10)}`;
      
      const user: User = {
        id,
        username
      };
      
      // Salva l'utente nel localStorage
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      
      resolve(user);
    }, 800); // Ritardo di 800ms per simulare una richiesta al server
  });
};

// Logout
export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
