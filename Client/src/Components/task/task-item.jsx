"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar, Flag } from "lucide-react"

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [isHovered, setIsHovered] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed

  const cardClass = [
    "transition-all",
    "duration-200",
    "hover:shadow-md",
    task.completed ? "bg-gray-50 border-gray-200" : "",
    isOverdue ? "border-red-200 bg-red-50" : "",
  ].join(" ")

  const labelClass = [
    "text-sm font-medium cursor-pointer block",
    task.completed ? "line-through text-gray-500" : "",
  ].join(" ")

  const descriptionClass = [
    "text-sm text-gray-600 mt-1",
    task.completed ? "text-gray-400" : "",
  ].join(" ")

  const actionButtonsClass = [
    "flex items-center gap-2 transition-opacity",
    isHovered ? "opacity-100" : "opacity-0",
  ].join(" ")

  const dueBadgeClass = isOverdue
    ? "bg-red-100 text-red-800 border-red-200"
    : ""

  return (
    <Card
      className={cardClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="mt-1"
            id={`task-${task.id}`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <label htmlFor={`task-${task.id}`} className={labelClass}>
                  {task.title}
                </label>
                {task.description && (
                  <p className={descriptionClass}>
                    {task.description}
                  </p>
                )}
              </div>

              <div className={actionButtonsClass}>
                <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>

              {task.dueDate && (
                <Badge variant="outline" className={dueBadgeClass}>
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(task.dueDate)}
                </Badge>
              )}

              <span className="text-xs text-gray-400 ml-auto">
                Created {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
