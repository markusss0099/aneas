
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isUserAuthenticated = isAuthenticated();
  
  if (!isUserAuthenticated) {
    // Reindirizza alla pagina di login se l'utente non è autenticato
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
