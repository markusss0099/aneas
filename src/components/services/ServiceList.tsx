
import React, { useState } from 'react';
import { Service } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
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
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import ServiceForm from './ServiceForm';

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
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{formatDate(service.date)}</TableCell>
                    <TableCell>{formatCurrency(service.revenue)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {service.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(service)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(service)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog di Modifica */}
      {editingService && (
        <AlertDialog open={!!editingService} onOpenChange={() => !isProcessing && setEditingService(null)}>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Modifica Servizio</AlertDialogTitle>
              <AlertDialogDescription>
                Aggiorna i dettagli del servizio
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ServiceForm
              initialData={editingService}
              onSubmit={handleUpdate}
              onCancel={() => setEditingService(null)}
              isLoading={isProcessing}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Dialog di Conferma Eliminazione */}
      <AlertDialog open={!!deletingService} onOpenChange={() => !isProcessing && setDeletingService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo servizio? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isProcessing}>
              {isProcessing ? 
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminazione...
                </> : 'Elimina'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceList;
