
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServices, getTotalServiceRevenue } from '@/services/serviceService';
import { useServiceActions } from '@/hooks/useServiceActions';
import ServiceHeader from '@/components/services/ServiceHeader';
import ServiceStats from '@/components/services/ServiceStats';
import ServiceList from '@/components/services/ServiceList';
import ServiceDialog from '@/components/services/ServiceDialog';

const PullingPage = () => {
  // Use React Query for state and loading
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const { data: totalRevenue = 0, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['serviceRevenue'],
    queryFn: getTotalServiceRevenue,
  });
  
  // Use custom hook for service actions
  const {
    isAddingService,
    setIsAddingService,
    handleAddService,
    handleUpdateService,
    handleDeleteService,
    isProcessing,
    addServiceMutation
  } = useServiceActions();
  
  // Combine loading states
  const isPageLoading = isLoading || isLoadingRevenue || isProcessing;
  
  return (
    <div className="animate-in space-y-6">
      <ServiceHeader 
        onAddClick={() => setIsAddingService(true)}
        isProcessing={isPageLoading}
      />
      
      <ServiceStats 
        servicesCount={services.length}
        totalRevenue={totalRevenue}
        isLoadingRevenue={isLoadingRevenue}
      />
      
      <ServiceList 
        services={services}
        onDelete={handleDeleteService}
        onUpdate={handleUpdateService}
        isLoading={isPageLoading}
      />
      
      <ServiceDialog 
        isOpen={isAddingService}
        onOpenChange={(open) => !isProcessing && setIsAddingService(open)}
        onSubmit={handleAddService}
        onCancel={() => setIsAddingService(false)}
        isLoading={addServiceMutation.isPending}
      />
    </div>
  );
};

export default PullingPage;
