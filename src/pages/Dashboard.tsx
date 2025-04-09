
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, ArrowUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useDashboardData } from '@/hooks/useDashboardData';
import { isDebugEnabled } from '@/lib/debugUtils';
import DebugPanel from '@/components/debug/DebugPanel';
import ServiceSummary from '@/components/dashboard/ServiceSummary';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import CashflowChart from '@/components/dashboard/CashflowChart';
import ProfitChart from '@/components/dashboard/ProfitChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const debugMode = isDebugEnabled();
  const queryClient = useQueryClient();
  
  // Use our custom hook for data fetching with React Query
  const { summary, cashflow } = useDashboardData();
  
  // Combined loading state
  const isLoading = summary.isLoading || cashflow.isLoading;
  
  // Handle refresh explicitly if needed
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['financialSummary'] });
    queryClient.invalidateQueries({ queryKey: ['cashflowMonthly'] });
  };

  if (isLoading || !summary.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Caricamento dashboard...</span>
      </div>
    );
  }
  
  return (
    <div className="animate-in space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Panoramica della gestione dei flussi finanziari</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Button 
            onClick={() => navigate('/tickets')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuovo Biglietto
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/pulling')}
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Nuovo Servizio
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardSummaryCards summary={summary.data} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashflowChart data={cashflow.data || []} />
        <ServiceSummary />
      </div>
      
      {/* Profit Chart */}
      <ProfitChart data={cashflow.data || []} />
      
      {/* Debug Panel */}
      {debugMode && <DebugPanel />}
    </div>
  );
};

export default Dashboard;
