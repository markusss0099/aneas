
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ServiceStatsProps {
  servicesCount: number;
  totalRevenue: number;
  isLoadingRevenue: boolean;
}

const ServiceStats = ({ servicesCount, totalRevenue, isLoadingRevenue }: ServiceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Totale Servizi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{servicesCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Servizi registrati
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ricavi Totali
          </CardTitle>
          <div className="rounded-full p-1 text-success">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoadingRevenue ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              formatCurrency(totalRevenue)
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Guadagni da tutti i servizi
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceStats;
