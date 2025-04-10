
import React, { useState } from 'react';
import { Task } from '@/services/taskService';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { Plus, ListChecks } from 'lucide-react';
import AddTaskForm from './AddTaskForm';
import { useTaskActions } from '@/hooks/useTaskActions';

const TaskList: React.FC = () => {
  const { 
    tasks, 
    isLoading, 
    isAdding,
    setIsAdding,
    isEditing,
    setIsEditing,
    addTask,
    toggleTaskStatus,
    updateTask,
    deleteTask
  } = useTaskActions();

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(null);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Attività</h2>
        </div>
        <div className="space-y-4">
          <div className="h-20 rounded-lg border border-border animate-pulse"></div>
          <div className="h-20 rounded-lg border border-border animate-pulse"></div>
          <div className="h-20 rounded-lg border border-border animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ListChecks className="h-6 w-6" />
          Attività
        </h2>
        {!isAdding && (
          <Button onClick={handleAddClick}>
            <Plus className="mr-1 h-4 w-4" />
            Nuova attività
          </Button>
        )}
      </div>

      {isAdding && (
        <AddTaskForm 
          onAddTask={addTask} 
          onCancel={() => setIsAdding(false)} 
        />
      )}

      {pendingTasks.length === 0 && completedTasks.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Non hai ancora aggiunto attività</p>
          <Button onClick={handleAddClick}>
            <Plus className="mr-1 h-4 w-4" />
            Aggiungi la prima attività
          </Button>
        </div>
      )}

      {pendingTasks.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Da completare ({pendingTasks.length})</h3>
          <div>
            {pendingTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={toggleTaskStatus}
                onUpdate={updateTask}
                onDelete={deleteTask}
                isEditing={isEditing === task.id}
                onEditStart={() => setIsEditing(task.id)}
                onEditCancel={() => setIsEditing(null)}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Completate ({completedTasks.length})</h3>
          <div>
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={toggleTaskStatus}
                onUpdate={updateTask}
                onDelete={deleteTask}
                isEditing={isEditing === task.id}
                onEditStart={() => setIsEditing(task.id)}
                onEditCancel={() => setIsEditing(null)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
