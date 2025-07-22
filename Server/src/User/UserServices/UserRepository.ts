import pool from "../../Databases/pgDB.js"

class UserRepository {
    static async getAllUsers() {
        const result = await pool.query("SELECT * FROM users");
        return result.rows;
    }

    static async getUserById(id) {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async createUser(username, email) {
        const result = await pool.query(
            "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
            [username, email]
        );
        return result.rows[0];
    }

    static async deleteUser(id) {
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
    }
}

export default UserRepository;
