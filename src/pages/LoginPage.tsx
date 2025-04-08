
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn } from 'lucide-react';
import { login, isAuthenticated } from '@/services/authService';
import { useToast, toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { toast: toastUI } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Controlla se l'utente è già autenticato
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        console.log('Login page - user authenticated:', authenticated);
        if (authenticated) {
          // Reindirizza alla home o alla pagina precedente se disponibile
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Error checking authentication', error);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
    
    // Configura un listener per i cambiamenti di autenticazione
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toastUI({
        title: "Errore",
        description: "Inserisci email e password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(username, password);
      toast({
        title: "Login effettuato",
        description: `Benvenuto! I tuoi dati saranno sincronizzati in tempo reale su tutti i dispositivi.`,
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toastUI({
        title: "Errore di login",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante il login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Cashflow Manager</CardTitle>
            <CardDescription className="text-center">
              Accedi per gestire i tuoi flussi finanziari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="La tua email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="La tua password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accesso in corso...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Accedi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Se non hai un account, inserisci la tua email e una password per registrarti.
            </p>
            <p className="text-sm font-medium text-primary">
              Importante: I tuoi dati saranno sincronizzati in tempo reale su tutti i dispositivi dove accedi con lo stesso account.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
