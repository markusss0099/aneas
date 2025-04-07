
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { getServices } from '@/services/serviceService';
import { formatCurrency, formatDate } from '@/lib/utils';

const ServiceSummarySection = () => {
  // Ordina i servizi per data (più recenti per primi)
  const services = [...getServices()].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Prendi solo i 5 servizi più recenti
  const recentServices = services.slice(0, 5);
  
  const totalRevenue = services.reduce((sum, service) => sum + service.revenue, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Servizi Pulling</CardTitle>
        <CardDescription>
          Riepilogo dei servizi e relativi guadagni
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">Totale Servizi</h3>
            <p className="text-sm text-muted-foreground">{services.length} servizi registrati</p>
          </div>
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-success" />
            <span className="text-xl font-semibold text-success">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Servizio</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ricavo</TableHead>
              <TableHead>Descrizione</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nessun servizio trovato.
                </TableCell>
              </TableRow>
            ) : (
              recentServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{formatDate(service.date)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-success">
                      {formatCurrency(service.revenue)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {service.description || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ServiceSummarySection;
