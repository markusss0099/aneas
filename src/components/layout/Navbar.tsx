
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import { NavItem } from '@/types/nav';
import { 
  LayoutDashboard, 
  Ticket, 
  BarChart3, 
  List, 
  ArrowUp,
  CheckSquare,
  File
} from 'lucide-react';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const navItems: NavItem[] = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/tickets", icon: <Ticket size={20} />, label: "Biglietti" },
    { to: "/pulling", icon: <ArrowUp size={20} />, label: "Pulling" },
    { to: "/analysis", icon: <BarChart3 size={20} />, label: "Analisi" },
    { to: "/summary", icon: <List size={20} />, label: "Sommario" },
    { to: "/tasks", icon: <CheckSquare size={20} />, label: "Attività" },
    { to: "/client-data", icon: <File size={20} />, label: "Dati Clienti" },
  ];

  if (isMobile) {
    return (
      <MobileNav 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
        navItems={navItems}
        closeMenu={closeMenu}
      />
    );
  }

  return <DesktopNav navItems={navItems} />;
};

export default Navbar;
