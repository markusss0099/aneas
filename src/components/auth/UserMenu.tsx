
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { getCurrentUser, logout } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

const UserMenu = () => {
  const user = getCurrentUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout effettuato",
      description: "Hai effettuato il logout con successo",
    });
    navigate('/login');
  };
  
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-2 mt-auto mb-4 px-4">
      <div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
        <User size={18} />
        <span className="text-sm font-medium">{user.username}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
        <LogOut size={18} />
      </Button>
    </div>
  );
};

export default UserMenu;
