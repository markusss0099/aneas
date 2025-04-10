
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getTasks, 
  addTask, 
  updateTaskStatus, 
  updateTask, 
  deleteTask,
  Task
} from '@/services/taskService';

export const useTaskActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Query per ottenere tutte le attività
  const { 
    data: tasks = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  // Mutation per aggiungere una nuova attività
  const addTaskMutation = useMutation({
    mutationFn: ({ title, description }: { title: string, description?: string }) => 
      addTask(title, description),
    onSuccess: () => {
      toast({
        title: "Attività aggiunta",
        description: "La tua nuova attività è stata aggiunta con successo."
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsAdding(false);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile aggiungere l'attività. Riprova più tardi.",
        variant: "destructive"
      });
      console.error("Errore nell'aggiunta dell'attività:", error);
    }
  });

  // Mutation per aggiornare lo stato di un'attività
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string, completed: boolean }) => 
      updateTaskStatus(id, completed),
    onSuccess: (_, variables) => {
      toast({
        title: variables.completed ? "Attività completata" : "Attività riaperta",
        description: variables.completed 
          ? "L'attività è stata segnata come completata." 
          : "L'attività è stata segnata come non completata."
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato dell'attività. Riprova più tardi.",
        variant: "destructive"
      });
      console.error("Errore nell'aggiornamento dello stato dell'attività:", error);
    }
  });

  // Mutation per aggiornare i dettagli di un'attività
  const updateTaskMutation = useMutation({
    mutationFn: ({ 
      id, 
      updates 
    }: { 
      id: string, 
      updates: { title?: string; description?: string } 
    }) => updateTask(id, updates),
    onSuccess: () => {
      toast({
        title: "Attività aggiornata",
        description: "I dettagli dell'attività sono stati aggiornati con successo."
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditing(null);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare l'attività. Riprova più tardi.",
        variant: "destructive"
      });
      console.error("Errore nell'aggiornamento dell'attività:", error);
    }
  });

  // Mutation per eliminare un'attività
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      toast({
        title: "Attività eliminata",
        description: "L'attività è stata eliminata con successo."
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare l'attività. Riprova più tardi.",
        variant: "destructive"
      });
      console.error("Errore nell'eliminazione dell'attività:", error);
    }
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
    isAdding,
    setIsAdding,
    isEditing,
    setIsEditing,
    addTask: (title: string, description?: string) => 
      addTaskMutation.mutate({ title, description }),
    toggleTaskStatus: (task: Task) => 
      updateStatusMutation.mutate({ id: task.id, completed: !task.completed }),
    updateTask: (id: string, updates: { title?: string; description?: string }) => 
      updateTaskMutation.mutate({ id, updates }),
    deleteTask: (id: string) => deleteTaskMutation.mutate(id),
  };
};
