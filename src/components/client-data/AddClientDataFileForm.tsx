
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, FileUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AddClientDataFileFormProps {
  onAddFile: (title: string, file: File) => void;
  onCancel: () => void;
  isAdding: boolean;
}

const AddClientDataFileForm: React.FC<AddClientDataFileFormProps> = ({ 
  onAddFile, 
  onCancel,
  isAdding
}) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    if (!file) {
      setFileError('Seleziona un file CSV');
      return;
    }
    
    // Check if it's a CSV file
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setFileError('Il file deve essere in formato CSV');
      return;
    }
    
    onAddFile(title.trim(), file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileError('');
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="font-medium text-sm mb-2 text-primary">Nuovo file di dati clienti</h3>
          
          <div className="space-y-2">
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo del file"
              className="w-full"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">File CSV</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".csv"
                className="w-full"
              />
            </div>
            {fileError && (
              <p className="text-sm text-destructive">{fileError}</p>
            )}
            {file && (
              <p className="text-sm text-muted-foreground">
                File selezionato: {file.name}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={onCancel}
            >
              <X className="mr-1 h-4 w-4" />
              Annulla
            </Button>
            <Button 
              type="submit" 
              size="sm" 
              disabled={!title.trim() || !file || isAdding}
            >
              {isAdding ? (
                <span>Caricamento...</span>
              ) : (
                <>
                  <FileUp className="mr-1 h-4 w-4" />
                  Carica file
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddClientDataFileForm;
