
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (title: string, description?: string) => void;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), description.trim() || undefined);
      // Don't clear the form here - it will be cleared by the parent component after successful submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-primary/20 rounded-lg bg-card mb-4">
      <h3 className="font-medium text-sm mb-2 text-primary">Nuova attività</h3>
      <div className="space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titolo dell'attività"
          className="w-full"
          autoFocus
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione (opzionale)"
          className="w-full min-h-[80px]"
        />
        <div className="flex justify-end gap-2">
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
            disabled={!title.trim()}
          >
            <Plus className="mr-1 h-4 w-4" />
            Aggiungi
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
