
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { getServices, getTotalServiceRevenue } from '@/services/serviceService';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Service } from '@/types';

const ServiceSummary = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const servicesData = await getServices();
        const revenue = await getTotalServiceRevenue();
        
        setServices(servicesData);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Error fetching service data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Prendi solo i 3 servizi più recenti
  const recentServices = [...services]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Pulling - Servizi</CardTitle>
            <CardDescription>
              Riepilogo dei guadagni dai servizi
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/pulling')}
          >
            Vedi tutti
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Ricavi Totali</h3>
                <p className="text-sm text-muted-foreground">Dai servizi</p>
              </div>
              <div className="flex items-center text-xl font-semibold text-success">
                <ArrowUpRight className="mr-1 h-5 w-5" />
                {formatCurrency(totalRevenue)}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Servizi Recenti</h3>
              {recentServices.length > 0 ? (
                <div className="space-y-2">
                  {recentServices.map((service) => (
                    <div 
                      key={service.id} 
                      className="flex justify-between items-center p-2 rounded-md bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(service.date)}
                        </p>
                      </div>
                      <p className="font-medium text-success">
                        {formatCurrency(service.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nessun servizio registrato.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceSummary;
