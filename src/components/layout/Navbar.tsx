import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  BarChart3, 
  List, 
  Menu, 
  X,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from '../auth/UserMenu';
import { 
  Drawer, 
  DrawerContent, 
  DrawerTrigger,
  DrawerClose
} from '@/components/ui/drawer';

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

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/tickets", icon: <Ticket size={20} />, label: "Biglietti" },
    { to: "/pulling", icon: <ArrowUp size={20} />, label: "Pulling" },
    { to: "/analysis", icon: <BarChart3 size={20} />, label: "Analisi" },
    { to: "/summary", icon: <List size={20} />, label: "Sommario" },
  ];

  if (isMobile) {
    return (
      <div className="sticky top-0 z-40 w-full bg-background border-b flex items-center justify-end h-14 px-4">
        <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="Apri menu"
              className="h-8 w-8"
            >
              <Menu size={20} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-[75%] h-full max-w-[300px] p-0 rounded-none border-r">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="font-semibold text-lg">Cashflow Manager</div>
                <DrawerClose className="absolute right-4 top-4">
                  <Button variant="ghost" size="icon">
                    <X size={18} />
                  </Button>
                </DrawerClose>
              </div>
              <nav className="flex flex-col p-4 space-y-1 flex-1">
                {navItems.map((item) => (
                  <NavItem 
                    key={item.to} 
                    {...item} 
                    onClick={closeMenu} 
                  />
                ))}
              </nav>
              <div className="mt-auto border-t">
                <UserMenu />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

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

export default Navbar;
