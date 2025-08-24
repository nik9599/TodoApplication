import React, { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const ExampleUsage = () => {
  const { get, post, put, del, loading, error, clearError } = useApi();
  const [tasks, setTasks] = useState([]);

  // Example: Fetch tasks using the authenticated API
  const fetchTasks = async () => {
    try {
      const response = await get('/task/get');
      setTasks(response.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  // Example: Create a new task
  const createTask = async () => {
    try {
      const newTask = {
        title: 'Example Task',
        description: 'This is an example task created using the useApi hook',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      };
      
      const response = await post('/task/create', newTask);
      console.log('Task created:', response);
      
      // Refresh the task list
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  // Example: Update a task
  const updateTask = async (taskId) => {
    try {
      const updatedTask = {
        title: 'Updated Example Task',
        description: 'This task has been updated using the useApi hook',
        priority: 'high',
      };
      
      const response = await put(`/task/update/${taskId}`, updatedTask);
      console.log('Task updated:', response);
      
      // Refresh the task list
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // Example: Delete a task
  const deleteTask = async (taskId) => {
    try {
      const response = await del(`/task/delete/${taskId}`);
      console.log('Task deleted:', response);
      
      // Refresh the task list
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>useApi Hook Example</CardTitle>
        <p className="text-sm text-gray-600">
          This component demonstrates how to use the useApi hook for authenticated API calls.
          The hook automatically handles authentication tokens and provides loading/error states.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-800">Error: {error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={fetchTasks} disabled={loading}>
            Refresh Tasks
          </Button>
          <Button onClick={createTask} disabled={loading}>
            Create Example Task
          </Button>
        </div>

        {/* Tasks Display */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Current Tasks:</h3>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found. Create one to get started!</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTask(task.id)}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• The useApi hook automatically includes authentication tokens from cookies</li>
            <li>• All requests are made to the configured base URL (http://localhost:8000)</li>
            <li>• Loading and error states are managed automatically</li>
            <li>• 401 errors trigger automatic logout and redirect to login</li>
            <li>• The hook provides methods for GET, POST, PUT, DELETE, and PATCH requests</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExampleUsage;
