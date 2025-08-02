import pool from "../../Databases/pgDB.js"

class UserRepository {

 async checkIfTableExists() {
        const result = await pool.query("SELECT * FROM users");
        return result.rows;
    }

    async createTable() {
        const result = await pool.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255))");
        return result.rows;
    }


    async getAllUsers() {
        const result = await pool.query("SELECT * FROM users");
        return result.rows;
    }

    async getUserByEmail(email:string) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    }

    async createUser(username:string, email:string, password:string, id:string) {
        const result = await pool.query(
            "INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [id, username, email, password]
        );
        return Number(result.rowCount) > 0 ? true : false;
    }

    async deleteUser(id:string) {
        const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
        return Number(result.rowCount) > 0 ? true : false;
    }
    async updateUser(id:string, username:string, email:string, password:string) {
        const result = await pool.query("UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4", [username, email, password, id]);
        return Number(result.rowCount) > 0 ? true : false;
    }
    async getUserById(id:string) {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    }
}

export default UserRepository;
