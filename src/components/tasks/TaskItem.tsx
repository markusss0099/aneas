
import React, { useState } from 'react';
import { Task } from '@/services/taskService';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash, Edit, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onUpdate: (id: string, updates: { title?: string; description?: string }) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleStatus,
  onUpdate,
  onDelete,
  isEditing,
  onEditStart,
  onEditCancel
}) => {
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  
  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null
      });
    }
  };
  
  const formattedDate = format(
    new Date(task.created_at),
    "d MMMM yyyy, HH:mm",
    { locale: it }
  );

  if (isEditing) {
    return (
      <div className="p-4 border border-border rounded-lg bg-card mb-3">
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Titolo dell'attività"
            className="font-medium"
            autoFocus
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Descrizione (opzionale)"
            className="min-h-[80px]"
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditCancel}
            >
              <X className="mr-1 h-4 w-4" />
              Annulla
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveEdit}
              disabled={!editTitle.trim()}
            >
              <Check className="mr-1 h-4 w-4" />
              Salva
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border ${task.completed ? 'border-muted bg-muted/40' : 'border-border bg-card'} rounded-lg mb-3 transition-colors`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleStatus(task)}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? 'text-muted-foreground/70 line-through' : 'text-muted-foreground'}`}>
                  {task.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground/60 mt-2">
                Creata il {formattedDate}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onEditStart}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Modifica</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Elimina</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
