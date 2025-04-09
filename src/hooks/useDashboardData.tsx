
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFinancialSummary, getCashflowByPeriod } from '@/services/ticket';
import { FinancialSummary, CashflowByPeriod } from '@/types';

export const useDashboardData = () => {
  return {
    summary: useQuery({
      queryKey: ['financialSummary'],
      queryFn: getFinancialSummary,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    
    cashflow: useQuery({
      queryKey: ['cashflowMonthly'],
      queryFn: () => getCashflowByPeriod('month'),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  };
};
