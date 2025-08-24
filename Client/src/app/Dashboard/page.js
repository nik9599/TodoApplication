"use client"

import { useState, useEffect, useContext } from "react"
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
import { useDispatch, useSelector } from "react-redux"
import { createTask, getTasks } from "@/app/TaskReducer/TaskReducer.reducer"
import { ProtectedRoute } from "@/Components/api/ProtectedRoute"
import { UserContext } from "@/Components/ContextualStore/UserContext"

export default function Dashboard() {
  const dispatch = useDispatch()
  const { data, isLoading, error, getTasksSuccess, createTaskSuccess } = useSelector((state) => state.task)
  const {data: userData} = useSelector((state) => state.login)
  const { userDataResp } = useContext(UserContext)

  // Get userId from multiple sources with localStorage fallback
  const userId = userData?.data?.id || userDataResp?.id || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || '{}').id : null)

  useEffect(() => {
    if (userId) {
      dispatch(getTasks({ userId }));
    }
  }, [createTaskSuccess, userId, userData, userDataResp])

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if(data?.data){
      setTasks(data?.data)
    }
  }, [data, createTaskSuccess])

  const [filteredTasks, setFilteredTasks] = useState(tasks || [])
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
        userId: userId,
      }
      dispatch(createTask(newTask))
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
    total: tasks?.length,
    completed: tasks?.filter((t) => t.completed).length,
    active: tasks?.filter((t) => !t.completed).length,
    overdue: tasks?.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    ).length,
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {["Total", "Completed", "Active", "Overdue"].map((label, index) => {
              const colors = ["blue", "green", "orange", "red"]
              const values = [
                tasks?.length,
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
    </ProtectedRoute>
  )
}
