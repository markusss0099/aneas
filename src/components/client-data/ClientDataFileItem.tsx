
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash, File, FileText } from 'lucide-react';
import { ClientDataFile } from '@/services/clientDataService';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClientDataFileItemProps {
  file: ClientDataFile;
  onDownload: (filename: string) => void;
  onDelete: (id: string, filename: string) => void;
  isDownloading: boolean;
  isDeleting: boolean;
}

const ClientDataFileItem: React.FC<ClientDataFileItemProps> = ({ 
  file, 
  onDownload, 
  onDelete,
  isDownloading,
  isDeleting
}) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Display filename without timestamp
  const displayFilename = file.filename.substring(file.filename.indexOf('_') + 1);
  
  // Determine the file icon based on extension
  const getFileIcon = () => {
    if (displayFilename.toLowerCase().endsWith('.csv')) {
      return <FileText className="h-8 w-8 text-primary" />;
    }
    return <File className="h-8 w-8 text-primary" />;
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <h3 className="font-medium">{file.title}</h3>
              <p className="text-sm text-muted-foreground">
                {displayFilename} • Caricato il {formatDate(file.created_at)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(file.filename)}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-1" />
              Scarica
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione eliminerà permanentemente il file "{file.title}". Questa azione non può essere annullata.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(file.id, file.filename)}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Eliminazione...' : 'Elimina'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDataFileItem;
