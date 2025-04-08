
import React, { useState } from 'react';
import { Service } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ServiceItem from './ServiceItem';
import ServiceEditDialog from './ServiceEditDialog';
import ServiceDeleteDialog from './ServiceDeleteDialog';

interface ServiceListProps {
  services: Service[];
  onDelete: (id: string) => void;
  onUpdate: (service: Service) => void;
  isLoading?: boolean;
}

const ServiceList = ({ services, onDelete, onUpdate, isLoading = false }: ServiceListProps) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  // Combined loading state
  const isProcessing = isLoading || localLoading;

  const handleEdit = (service: Service) => {
    if (isProcessing) return;
    setEditingService(service);
  };

  const handleUpdate = (data: Omit<Service, 'id'>) => {
    if (editingService && !isProcessing) {
      setLocalLoading(true);
      try {
        onUpdate({ ...data, id: editingService.id });
        setEditingService(null);
      } finally {
        // Delay setting loading to false to ensure UI updates properly
        setTimeout(() => {
          setLocalLoading(false);
        }, 100);
      }
    }
  };

  const handleDelete = (service: Service) => {
    if (isProcessing) return;
    setDeletingService(service);
  };

  const confirmDelete = () => {
    if (deletingService && !isProcessing) {
      setLocalLoading(true);
      try {
        onDelete(deletingService.id);
        setDeletingService(null);
      } finally {
        // Delay setting loading to false to ensure UI updates properly
        setTimeout(() => {
          setLocalLoading(false);
        }, 100);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista Servizi</CardTitle>
          <CardDescription>
            Tutti i servizi registrati e i relativi guadagni
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProcessing && services.length === 0 ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nessun servizio registrato.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Servizio</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ricavo</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isProcessing={isProcessing}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ServiceEditDialog
        service={editingService}
        onOpenChange={() => !isProcessing && setEditingService(null)}
        onSubmit={handleUpdate}
        onCancel={() => setEditingService(null)}
        isProcessing={isProcessing}
      />

      <ServiceDeleteDialog
        service={deletingService}
        onOpenChange={() => !isProcessing && setDeletingService(null)}
        onConfirm={confirmDelete}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default ServiceList;
