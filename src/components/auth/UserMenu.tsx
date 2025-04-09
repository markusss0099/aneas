
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Info, Loader2 } from 'lucide-react';
import { getCurrentUser, logout } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

const UserMenu = () => {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Carica l'utente all'avvio
    loadUser();
    
    // Configura un listener per i cambiamenti di autenticazione
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during logout', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-auto mb-4 px-4 py-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="flex flex-col gap-2 mt-auto mb-4 px-4 py-2 bg-secondary/30 rounded-md">
      <div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
        <User size={18} />
        <span className="text-sm font-medium">{user.username}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={16} className="text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px]">
              <p>I dati sono sincronizzati in tempo reale su tutti i dispositivi grazie a Supabase.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLogout} 
        className="w-full flex items-center justify-center gap-2"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default UserMenu;
