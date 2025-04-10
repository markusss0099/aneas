
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
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({
          title: 'Errore',
          description: 'Impossibile scaricare il file.',
          variant: 'destructive'
        });
      }
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientDataFiles'] });
      toast({
        title: 'File eliminato',
        description: 'Il file dei dati cliente è stato eliminato con successo.',
      });
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
