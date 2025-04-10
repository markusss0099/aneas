
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addClientDataFile, getClientDataFiles, downloadClientDataFile, deleteClientDataFile, ClientDataFile } from '@/services/clientDataService';
import { useToast } from '@/hooks/use-toast';

export const useClientDataActions = () => {
  const [isAddingFile, setIsAddingFile] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch all client data files
  const { 
    data: clientDataFiles, 
    isLoading: isLoadingFiles,
    error: filesError,
    refetch: refetchFiles
  } = useQuery({
    queryKey: ['clientDataFiles'],
    queryFn: getClientDataFiles
  });

  // Mutation to add a new client data file
  const { mutate: addFile, isPending: isAddingFilePending } = useMutation({
    mutationFn: ({ title, file }: { title: string, file: File }) => 
      addClientDataFile(title, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientDataFiles'] });
      toast({
        title: 'File aggiunto',
        description: 'Il file dei dati cliente è stato caricato con successo.',
      });
      setIsAddingFile(false);
    },
    onError: (error) => {
      console.error('Errore durante l\'aggiunta del file:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante il caricamento del file.',
        variant: 'destructive'
      });
    }
  });

  // Mutation to download a client data file
  const { mutate: downloadFile, isPending: isDownloading } = useMutation({
    mutationFn: (filename: string) => downloadClientDataFile(filename),
    onSuccess: (url, filename) => {
      if (!url) {
        toast({
          title: 'Errore',
          description: 'Impossibile scaricare il file.',
          variant: 'destructive'
        });
        return;
      }
      
      // Force download using Blob to ensure it works across all devices
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          // Create a Blob URL
          const blobUrl = window.URL.createObjectURL(blob);
          
          // Setup proper filename without timestamp
          const displayName = filename.substring(filename.indexOf('_') + 1);
          
          // Create and trigger download
          const link = document.createElement('a');
          link.href = blobUrl;
          link.setAttribute('download', displayName);
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          }, 200);
          
          toast({
            title: 'Download avviato',
            description: `Download di "${displayName}" avviato.`,
          });
        })
        .catch(error => {
          console.error('Errore durante il download del file:', error);
          toast({
            title: 'Errore',
            description: 'Si è verificato un errore durante il download del file.',
            variant: 'destructive'
          });
        });
    },
    onError: (error) => {
      console.error('Errore durante il download del file:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante il download del file.',
        variant: 'destructive'
      });
    }
  });

  // Mutation to delete a client data file
  const { mutate: deleteFile, isPending: isDeleting } = useMutation({
    mutationFn: ({ id, filename }: { id: string, filename: string }) => 
      deleteClientDataFile(id, filename),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['clientDataFiles'] });
        toast({
          title: 'File eliminato',
          description: 'Il file dei dati cliente è stato eliminato con successo.',
        });
      } else {
        toast({
          title: 'Errore',
          description: 'Non è stato possibile eliminare il file.',
          variant: 'destructive'
        });
      }
    },
    onError: (error) => {
      console.error('Errore durante l\'eliminazione del file:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante l\'eliminazione del file.',
        variant: 'destructive'
      });
    }
  });

  return {
    clientDataFiles,
    isLoadingFiles,
    filesError,
    refetchFiles,
    isAddingFile,
    setIsAddingFile,
    addFile,
    isAddingFilePending,
    downloadFile,
    isDownloading,
    deleteFile,
    isDeleting
  };
};
