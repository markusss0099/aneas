
import React from 'react';
import NavItem from './NavItem';
import UserMenu from '../auth/UserMenu';
import { NavItem as NavItemType, NavItemProps } from '@/types/nav';
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DesktopNavProps {
  navItems: NavItemType[];
}

const DesktopNav = ({ navItems }: DesktopNavProps) => {
  return (
    <div className="w-64 h-screen flex-shrink-0 border-r bg-card fixed left-0 top-0 flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <h1 className="font-bold text-xl">Cashflow Manager</h1>
        <ThemeToggle />
      </div>
      <nav className="flex flex-col p-4 space-y-2 flex-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.href} 
            to={item.href} 
            label={item.title} 
            icon={<item.icon size={20} />} 
          />
        ))}
      </nav>
      <UserMenu />
    </div>
  );
};

export default DesktopNav;
