
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, onClick }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
        "active:bg-muted-foreground/10", // Feedback tattile per dispositivi mobili
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary"
      )}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default NavItem;
