"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { TaskList } from "@/components/task/taskList"
import { TaskForm } from "@/components/task/taskForm"
import { Plus, LogOut, Search, User } from "lucide-react"

export default function Dashboard() {

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project proposal",
      description: "Finish the Q4 project proposal and send it to the team for review",
      completed: false,
      priority: "high",
      dueDate: "2024-12-15",
      createdAt: "2024-12-01",
    },
    {
      id: 2,
      title: "Schedule team meeting",
      description: "Set up a meeting with the development team to discuss the new features",
      completed: true,
      priority: "medium",
      dueDate: "2024-12-10",
      createdAt: "2024-11-28",
    },
    {
      id: 3,
      title: "Research new technologies",
      description: "Look into React 19 features and Next.js 15 updates",
      completed: false,
      priority: "low",
      dueDate: "2024-12-20",
      createdAt: "2024-12-02",
    },
  ])

  const [filteredTasks, setFilteredTasks] = useState(tasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    let filtered = tasks

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => {
        if (filterStatus === "completed") return task.completed
        if (filterStatus === "active") return !task.completed
        return true
      })
    }

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, filterPriority, filterStatus])

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsDialogOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      )
    } else {
      const newTask = {
        ...taskData,
        id: Math.max(...tasks.map((t) => t.id), 0) + 1,
        createdAt: new Date().toISOString(),
      }
      setTasks((prev) => [newTask, ...prev])
    }

    setIsDialogOpen(false)
    setEditingTask(null)
  }

  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }


  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    ).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {["Total", "Completed", "Active", "Overdue"].map((label, index) => {
            const colors = ["blue", "green", "orange", "red"]
            const values = [
              taskStats.total,
              taskStats.completed,
              taskStats.active,
              taskStats.overdue,
            ]
            return (
              <div key={label} className="bg-white p-4 rounded-lg border">
                <div className={`text-2xl font-bold text-${colors[index]}-600`}>
                  {values[index]}
                </div>
                <div className="text-sm text-gray-600">{label} Tasks</div>
              </div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg border mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateTask} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <TaskForm
                task={editingTask}
                onSave={handleSaveTask}
                onCancel={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg border p-6">
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onCreateTask={handleCreateTask}
          />
        </div>
      </main>
    </div>
  )
}
