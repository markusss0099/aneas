
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TicketSearchProps {
  search: string;
  setSearch: (value: string) => void;
  isLoading: boolean;
  isMobile?: boolean;
}

const TicketSearch = ({ search, setSearch, isLoading, isMobile }: TicketSearchProps) => {
  // We'll use the prop passed from the parent component instead of using the hook directly
  // This makes the component more reusable
  const mobileView = isMobile ?? useIsMobile();
  
  return (
    <div className={`flex flex-col ${mobileView ? 'w-full' : 'md:flex-row'} gap-2 mb-4`}>
      <div className={mobileView ? "w-full" : "w-full md:w-64"}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca biglietti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
            disabled={isLoading}
          />
        </div>
      </div>
      {isLoading && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Elaborazione in corso...
        </div>
      )}
    </div>
  );
};

export default TicketSearch;
