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

  return (
    <div className="space-y-6">
      {incompleteTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Tasks ({incompleteTasks.length})
          </h2>
          <div className="space-y-2">
            {incompleteTasks.map((task) => (
              <TaskItem
                key={task.id}
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
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
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
