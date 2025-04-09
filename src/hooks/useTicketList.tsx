
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '@/services/ticket';
import { Ticket } from '@/types';

export const useTicketList = () => {
  const [search, setSearch] = useState('');
  
  // Fetch tickets with React Query for better caching
  const { 
    data: tickets = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
  
  // Memoize filtered tickets to avoid recalculation on each render
  const filteredTickets = useMemo(() => {
    if (!search.trim()) return tickets;
    
    return tickets.filter(ticket => 
      ticket.eventName.toLowerCase().includes(search.toLowerCase())
    );
  }, [tickets, search]);
  
  return {
    tickets,
    filteredTickets,
    search,
    setSearch,
    isLoading,
    error,
    refetch
  };
};
