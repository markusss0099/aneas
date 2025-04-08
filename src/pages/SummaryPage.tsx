
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Period } from '@/types';
import { useSummaryData } from '@/hooks/useSummaryData';
import SummaryHeader from '@/components/summary/SummaryHeader';
import SummaryCards from '@/components/summary/SummaryCards';
import CostAnalysisChart from '@/components/summary/CostAnalysisChart';
import ProfitAnalysisChart from '@/components/summary/ProfitAnalysisChart';
import SummaryTabs from '@/components/summary/SummaryTabs';

const SummaryPage = () => {
  const [period, setPeriod] = useState<Period>('month');
  const { tickets, summary, cashflowData, isLoading } = useSummaryData(period);

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Caricamento riepilogo...</span>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-6">
      <SummaryHeader />

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostAnalysisChart tickets={tickets} />
        <ProfitAnalysisChart summary={summary} />
      </div>

      <SummaryTabs tickets={tickets} cashflowData={cashflowData} />
    </div>
  );
};

export default SummaryPage;
