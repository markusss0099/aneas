
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import UserMenu from '../auth/UserMenu';
import NavItem from './NavItem';
import { NavItem as NavItemType } from '@/types/nav';
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: NavItemType[];
  closeMenu: () => void;
}

const MobileNav = ({ isOpen, setIsOpen, navItems, closeMenu }: MobileNavProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="Apri menu"
          className="fixed top-4 left-4 z-50 h-8 w-8 bg-background/80 backdrop-blur-sm"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[75%] max-w-[300px] p-0 rounded-none border-r">
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <h1 className="font-bold text-xl">Cashflow Manager</h1>
            <ThemeToggle />
          </div>
          <nav className="flex flex-col p-4 space-y-1 flex-1">
            {navItems.map((item) => (
              <NavItem 
                key={item.href} 
                to={item.href} 
                label={item.title} 
                icon={<item.icon size={20} />} 
                onClick={closeMenu} 
              />
            ))}
          </nav>
          <div className="mt-auto border-t">
            <UserMenu />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
