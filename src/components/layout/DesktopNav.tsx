
import React from 'react';
import NavItem from './NavItem';
import UserMenu from '../auth/UserMenu';
import { NavItemType } from '@/types/nav';

interface DesktopNavProps {
  navItems: NavItemType[];
}

const DesktopNav = ({ navItems }: DesktopNavProps) => {
  return (
    <div className="w-64 h-screen flex-shrink-0 border-r bg-card fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="font-bold text-xl">Cashflow Manager</h1>
      </div>
      <nav className="flex flex-col p-4 space-y-2 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
      <UserMenu />
    </div>
  );
};

export default DesktopNav;
