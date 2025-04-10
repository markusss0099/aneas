
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, File } from 'lucide-react';
import ClientDataFileItem from './ClientDataFileItem';
import AddClientDataFileForm from './AddClientDataFileForm';
import { useClientDataActions } from '@/hooks/useClientDataActions';

const ClientDataFileList: React.FC = () => {
  const {
    clientDataFiles,
    isLoadingFiles,
    isAddingFile,
    setIsAddingFile,
    addFile,
    isAddingFilePending,
    downloadFile,
    isDownloading,
    deleteFile,
    isDeleting
  } = useClientDataActions();

  const handleAddFile = (title: string, file: File) => {
    addFile({ title, file });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dati clienti</h2>
        {!isAddingFile && (
          <Button onClick={() => setIsAddingFile(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo file
          </Button>
        )}
      </div>

      {isAddingFile && (
        <AddClientDataFileForm 
          onAddFile={handleAddFile}
          onCancel={() => setIsAddingFile(false)}
          isAdding={isAddingFilePending}
        />
      )}

      {isLoadingFiles ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      ) : clientDataFiles && clientDataFiles.length > 0 ? (
        <div className="mt-4">
          {clientDataFiles.map((file) => (
            <ClientDataFileItem 
              key={file.id}
              file={file}
              onDownload={downloadFile}
              onDelete={(id, filename) => deleteFile({ id, filename })}
              isDownloading={isDownloading}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border rounded-lg border-dashed">
          <File className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
          <h3 className="mt-2 text-lg font-medium">Nessun file di dati clienti</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Carica file CSV contenenti i dati dei tuoi clienti.
          </p>
          {!isAddingFile && (
            <Button
              onClick={() => setIsAddingFile(true)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Carica primo file
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientDataFileList;
