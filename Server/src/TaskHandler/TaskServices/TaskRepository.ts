import pool from "../../Databases/pgDB.js";
import { Task } from "../TaskInterface/TaskInterface.js";

class TaskRepository {
  async checkIfTableExists() {
    const result = await pool.query("SELECT * FROM tasks");
    return result.rows;
  }

  async createTable() {
    const result = await pool.query(
      "CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, title VARCHAR(255), description VARCHAR(255), completed BOOLEAN, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, priority VARCHAR(255), userId VARCHAR(255), \"dueDate\" TIMESTAMP NULL)"
    );
    return result.rows;
  }

  async createTask(task: Task) {
    const result = await pool.query(
      "INSERT INTO tasks (id, title, description, completed, createdAt, updatedAt, priority, userId, \"dueDate\") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        task.id,
        task.title,
        task.description,
        task.completed,
        task.createdAt,
        task.updatedAt,
        task.priority,
        task.userId,
        task.dueDate ?? null,
      ]
    );
    return result.rows;
  }

  async getTaskByUserId(userId: string) {
    const result = await pool.query("SELECT * FROM tasks WHERE userId = $1", [
      userId,
    ]);
    return result.rows;
  }

  async getAllTasks() {
    const result = await pool.query("SELECT * FROM tasks");
    return result.rows;
  }

  async getAllTaskLength() {
    const result = await pool.query("SELECT * FROM tasks");
    return result.rows?.length + 1;
  }
  async updateTask(task: Task) {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, completed = $3, updatedAt = $4, priority = $5, userId = $6, \"dueDate\" = $7 WHERE id = $8 RETURNING *",
      [
        task.title,
        task.description,
        task.completed,
        task.updatedAt,
        task.priority,
        task.userId,
        task.dueDate ?? null,
        task.id
      ]
    );
    return result.rows;
  }
  async deleteTask(id: string) {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    return result.rows;
  }
  async getTaskById(id: string) {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
  }
}

export default TaskRepository;
