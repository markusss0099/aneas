
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
import { Pencil, Trash2 } from 'lucide-react';
import ServiceForm from './ServiceForm';

interface ServiceListProps {
  services: Service[];
  onDelete: (id: string) => void;
  onUpdate: (service: Service) => void;
}

const ServiceList = ({ services, onDelete, onUpdate }: ServiceListProps) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleUpdate = (data: Omit<Service, 'id'>) => {
    if (editingService) {
      setIsLoading(true);
      setTimeout(() => {
        onUpdate({ ...data, id: editingService.id });
        setEditingService(null);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleDelete = (service: Service) => {
    setDeletingService(service);
  };

  const confirmDelete = () => {
    if (deletingService) {
      setIsLoading(true);
      setTimeout(() => {
        onDelete(deletingService.id);
        setDeletingService(null);
        setIsLoading(false);
      }, 500);
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
          {services.length === 0 ? (
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
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(service)}
                        >
                          <Trash2 className="h-4 w-4" />
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
        <AlertDialog open={!!editingService} onOpenChange={() => !isLoading && setEditingService(null)}>
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
              isLoading={isLoading}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Dialog di Conferma Eliminazione */}
      <AlertDialog open={!!deletingService} onOpenChange={() => !isLoading && setDeletingService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo servizio? Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? 'Eliminazione...' : 'Elimina'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServiceList;
