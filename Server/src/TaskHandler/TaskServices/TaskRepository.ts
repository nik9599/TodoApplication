import pool from "../../Databases/pgDB";
import { Task } from "../TaskInterface/TaskInterface";

class TaskRepository {
  async checkIfTableExists() {
    const result = await pool.query("SELECT * FROM tasks");
    return result.rows;
  }

  async createTable() {
    const result = await pool.query(
      "CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, title VARCHAR(255), description VARCHAR(255), completed BOOLEAN, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, priority VARCHAR(255), userId VARCHAR(255))"
    );
    return result.rows;
  }

  async createTask(task: Task) {
    const result = await pool.query(
      "INSERT INTO tasks (id, title, description, completed, createdAt, updatedAt, priority, userId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        task.id,
        task.title,
        task.description,
        task.completed,
        task.createdAt,
        task.updatedAt,
        task.priority,
        task.userId,
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

  async getAllTaskLength() {
    const result = await pool.query("SELECT * FROM tasks");
    return result.rows?.length;
  }
  async updateTask(task: Task) {
    const result = await pool.query(
      "UPDATE task SET id = $1, title = $2, description = $3, completed = $4, updatedAt = $5, priority = $6, userId = $7 WHERE id = $1",
      [
        task.id,
        task.title,
        task.description,
        task.completed,
        task.updatedAt,
        task.priority,
        task.userId,
      ]
    );
    return result.rows;
  }
  async deleteTask(id: string) {
    const result = await pool.query("DELETE FROM task WHERE id = $1", [id]);
    return result.rows;
  }
}

export default TaskRepository;
