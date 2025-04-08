
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/services/authService';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        console.log('Authentication status:', authenticated);
        setIsUserAuthenticated(authenticated);
      } catch (error) {
        console.error('Error checking authentication', error);
        setIsUserAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [location.pathname]); // Ricontrolla l'auth quando l'URL cambia
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isUserAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
