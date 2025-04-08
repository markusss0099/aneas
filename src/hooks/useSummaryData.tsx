
import { useState, useEffect } from 'react';
import { 
  getFinancialSummary, 
  getTickets, 
  getCashflowByPeriod 
} from '@/services/ticket';
import { Period, Ticket, FinancialSummary, CashflowByPeriod } from '@/types';

export const useSummaryData = (period: Period) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [cashflowData, setCashflowData] = useState<CashflowByPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const ticketsData = await getTickets();
        const summaryData = await getFinancialSummary();
        const cashflow = await getCashflowByPeriod(period);
        
        setTickets(ticketsData);
        setSummary(summaryData);
        setCashflowData(cashflow);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  return { tickets, summary, cashflowData, isLoading };
};
