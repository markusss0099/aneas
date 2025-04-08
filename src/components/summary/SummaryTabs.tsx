
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, CashflowByPeriod } from '@/types';
import RecentEventsTab from './RecentEventsTab';
import ServiceSummarySection from './ServiceSummarySection';
import CashflowTab from './CashflowTab';

interface SummaryTabsProps {
  tickets: Ticket[];
  cashflowData: CashflowByPeriod[];
}

const SummaryTabs = ({ tickets, cashflowData }: SummaryTabsProps) => {
  return (
    <Tabs defaultValue="recent-tickets">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recent-tickets">Eventi Recenti</TabsTrigger>
        <TabsTrigger value="services">Servizi Pulling</TabsTrigger>
        <TabsTrigger value="cashflow">Cashflow Recente</TabsTrigger>
      </TabsList>
      
      <TabsContent value="recent-tickets" className="space-y-4">
        <RecentEventsTab tickets={tickets} />
      </TabsContent>
      
      <TabsContent value="services" className="space-y-4">
        <ServiceSummarySection />
      </TabsContent>
      
      <TabsContent value="cashflow" className="space-y-4">
        <CashflowTab cashflowData={cashflowData} />
      </TabsContent>
    </Tabs>
  );
};

export default SummaryTabs;
