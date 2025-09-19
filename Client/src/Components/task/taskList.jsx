"use client"

import React from "react";
import { TaskItem } from "./task-item";
import { EmptyState } from "./emptyState";

// Task type definition (should match task-item)
export function TaskList({ tasks, onToggleComplete, onEdit, onDelete, onCreateTask }) {
  if (tasks?.length === 0) {
    return <EmptyState onCreateTask={onCreateTask} />
  }

  const completedTasks = tasks?.filter((task) => task.completed)
  const incompleteTasks = tasks?.filter((task) => !task.completed)

  // Helper function to generate stable unique keys
  const generateKey = (task, index, type) => {
    if (task.id) return `${type}-${task.id}`;
    if (task._id) return `${type}-${task._id}`;
    if (task.title) return `${type}-${index}-${task.title.replace(/\s+/g, '-')}`;
    return `${type}-${index}-task-${index}`;
  };

  return (
    <div className="space-y-6">
      {incompleteTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Tasks ({incompleteTasks.length})
          </h2>
          <div className="space-y-2">
            {incompleteTasks.map((task, index) => (
              <TaskItem
                key={generateKey(task, index, 'incomplete')}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-500">
            Completed Tasks ({completedTasks.length})
          </h2>
          <div className="space-y-2">
            {completedTasks.map((task, index) => (
              <TaskItem
                key={generateKey(task, index, 'completed')}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
