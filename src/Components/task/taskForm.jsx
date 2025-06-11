"use client"

import React from "react"
import { Form, Field } from "react-final-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textArea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Ensure this matches the structure used in task-item.jsx
export function TaskForm({ task, onSave, onCancel }) {
  const initialValues = {
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate || "",
    completed: task?.completed || false,
  }

  const onSubmit = (values) => {
    if (!values.title.trim()) return

    onSave({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate || undefined,
    })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        <DialogDescription>
          {task ? "Make changes to your task here." : "Add a new task to your list."}
        </DialogDescription>
      </DialogHeader>

      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Field name="title">
                {({ input }) => (
                  <Input id="title" placeholder="Enter task title" required {...input} />
                )}
              </Field>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Field name="description">
                {({ input }) => (
                  <Textarea
                    id="description"
                    placeholder="Enter task description (optional)"
                    rows={3}
                    {...input}
                  />
                )}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Field name="priority">
                  {({ input }) => (
                    <Select value={input.value} onValueChange={input.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </Field>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Field name="dueDate">
                  {({ input }) => (
                    <Input id="dueDate" type="date" {...input} />
                  )}
                </Field>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
            </DialogFooter>
          </form>
        )}
      </Form>
    </DialogContent>
  )
}
