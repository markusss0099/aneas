
import React from 'react';
import { Service } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

interface ServiceItemProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  isProcessing: boolean;
}

const ServiceItem = ({ service, onEdit, onDelete, isProcessing }: ServiceItemProps) => {
  return (
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
            onClick={() => onEdit(service)}
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
            onClick={() => onDelete(service)}
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
  );
};

export default ServiceItem;
