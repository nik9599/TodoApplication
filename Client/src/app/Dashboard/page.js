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
import { createTask, deleteTask, getTasks, updateTask } from "@/app/TaskReducer/TaskReducer.reducer"
// Removed ProtectedRoute import - using UserProvider for auth instead
import { UserContext } from "@/Components/ContextualStore/UserContext"
import LoaderWrapper from "@/Components/ui/LoaderWrapper"

export default function Dashboard() {
  const dispatch = useDispatch()
  const { data,createTaskSuccess, deleteTaskSuccess, loading } = useSelector((state) => state.task)
  const {data: userData} = useSelector((state) => state.login)
  const { userDataResp } = useContext(UserContext)

  // Get userId from multiple sources with localStorage fallback
  const userId = userData?.data?.id || userDataResp?.id || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || '{}').id : null)

  useEffect(() => {
    if (userId) {
      dispatch(getTasks({ userId }));
    }
  }, [userId, dispatch]) // Initial load and when userId changes

  // Separate effect for refreshing tasks after create/delete operations
  useEffect(() => {
    if (userId && (createTaskSuccess || deleteTaskSuccess)) {
      dispatch(getTasks({ userId }));
    }
  }, [createTaskSuccess, deleteTaskSuccess, userId, dispatch])

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if(data?.data && !loading){
      // Ensure data.data is an array before setting it
      const tasksData = Array.isArray(data.data) ? data.data : [];
      setTasks(tasksData)
    }
  }, [data, createTaskSuccess, loading])

  const [filteredTasks, setFilteredTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isEditTask, setIsEditTask] = useState(false)
  useEffect(() => {
    // Ensure tasks is always an array
    let filtered = Array.isArray(tasks) ? tasks : [];

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    setIsEditTask(false)
  }

  const handleEditTask = (task) => {    
    setEditingTask(task)
    setIsDialogOpen(true)
    setIsEditTask(true)
  }

  const handleSaveTask = (taskData) => {
    console.log("da1 taskData",taskData)
    console.log("da1 editingTask",editingTask)
    if (editingTask) {
      // setTasks((prev) =>
      //   prev.map((task) =>
      //     task.id === editingTask.id ? { ...task, ...taskData } : task
      //   )
      // )
      const updatedTask = {
        ...taskData,
        userId: userId,
      }
      dispatch(updateTask(updatedTask))
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
    dispatch(deleteTask(id))

  }
  useEffect(() => {
    if(deleteTaskSuccess){
      dispatch(getTasks({ userId }))
    }
  }, [deleteTaskSuccess])


  const taskStats = {
    total: Array.isArray(tasks) ? tasks.length : 0,
    completed: Array.isArray(tasks) ? tasks.filter((t) => t.completed).length : 0,
    active: Array.isArray(tasks) ? tasks.filter((t) => !t.completed).length : 0,
    overdue: Array.isArray(tasks) ? tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
    ).length : 0,
  }

  // Check if user is authenticated, redirect if not
  if (!userDataResp && typeof window !== 'undefined') {
    window.location.href = '/Auth/Login';
    return null;
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
                  isEditTask={isEditTask}
                  onSave={handleSaveTask}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </Dialog>
            </div>
          </div>

          {/* Task List */}
          <LoaderWrapper loading={loading}>
          <div className="bg-white rounded-lg border p-6 w-full">
            <TaskList
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onCreateTask={handleCreateTask}
            />
          </div>
          </LoaderWrapper>
        </main>
      </div>
  )
}
