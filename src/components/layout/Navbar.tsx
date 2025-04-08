
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  BarChart3, 
  List, 
  ArrowUp
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import { NavItemType } from '@/types/nav';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const navItems: NavItemType[] = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/tickets", icon: <Ticket size={20} />, label: "Biglietti" },
    { to: "/pulling", icon: <ArrowUp size={20} />, label: "Pulling" },
    { to: "/analysis", icon: <BarChart3 size={20} />, label: "Analisi" },
    { to: "/summary", icon: <List size={20} />, label: "Sommario" },
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
