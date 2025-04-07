
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

  const toggleMenu = () => setIsOpen(!isOpen);
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
      <>
        <div className="sticky top-0 z-40 w-full bg-background border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="font-semibold text-lg">Cashflow Manager</div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-30 bg-background pt-16 animate-in">
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <NavItem 
                  key={item.to} 
                  {...item} 
                  onClick={closeMenu} 
                />
              ))}
            </nav>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="w-64 h-screen flex-shrink-0 border-r bg-card fixed left-0 top-0">
      <div className="p-6">
        <h1 className="font-bold text-xl">Cashflow Manager</h1>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
