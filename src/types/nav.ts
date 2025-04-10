
import {
  HomeIcon,
  TicketIcon,
  DollarSignIcon,
  BarChartIcon,
  ListIcon,
  CheckSquareIcon,
  File as FileIcon,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
}

// Alias for backward compatibility
export type NavItemType = NavItem;

// For components that use the old format with 'to' and 'label' properties
export interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: HomeIcon,
  },
  {
    title: 'Tickets',
    href: '/tickets',
    icon: TicketIcon,
  },
  {
    title: 'Pulling',
    href: '/pulling',
    icon: DollarSignIcon,
  },
  {
    title: 'Analisi',
    href: '/analysis',
    icon: BarChartIcon,
  },
  {
    title: 'Riepilogo',
    href: '/summary',
    icon: ListIcon,
  },
  {
    title: 'Attività',
    href: '/tasks',
    icon: CheckSquareIcon,
  },
  {
    title: 'Dati clienti',
    href: '/client-data',
    icon: FileIcon,
  }
];
