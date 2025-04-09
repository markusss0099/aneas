
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getFinancialSummary, 
  getTickets, 
  getCashflowByPeriod 
} from '@/services/ticket';
import { Period } from '@/types';

export const useSummaryData = (period: Period) => {
  // Use React Query for better caching and performance
  const ticketsQuery = useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const summaryQuery = useQuery({
    queryKey: ['financialSummary'],
    queryFn: getFinancialSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const cashflowQuery = useQuery({
    queryKey: ['cashflow', period],
    queryFn: () => getCashflowByPeriod(period),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Derived loading state
  const isLoading = ticketsQuery.isLoading || 
                    summaryQuery.isLoading || 
                    cashflowQuery.isLoading;

  // Return structured data
  return { 
    tickets: ticketsQuery.data || [],
    summary: summaryQuery.data,
    cashflowData: cashflowQuery.data || [],
    isLoading,
    error: ticketsQuery.error || summaryQuery.error || cashflowQuery.error,
    refetch: () => {
      ticketsQuery.refetch();
      summaryQuery.refetch();
      cashflowQuery.refetch();
    }
  };
};
