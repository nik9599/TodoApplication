import pool from "../../Databases/pgDB.js";
import { LogEntry, LoginLog, ApiCallLog } from "../LogInterface/LogInterface.js";

class LogRepository {
    
    // Create logs table
    async createLogsTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS logs (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                username VARCHAR(255),
                user_email VARCHAR(255),
                action VARCHAR(100) NOT NULL,
                route VARCHAR(500) NOT NULL,
                method VARCHAR(10) NOT NULL,
                request_data JSONB,
                response_data JSONB,
                status_code INTEGER NOT NULL,
                client_ip INET NOT NULL,
                user_agent TEXT,
                session_id VARCHAR(255),
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                duration INTEGER,
                error TEXT
            )
        `;
        const result = await pool.query(query);
        return result;
    }

    // Create user sessions table for tracking login/logout
    async createUserSessionsTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS user_sessions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                logout_time TIMESTAMP NULL,
                client_ip INET NOT NULL,
                user_agent TEXT,
                session_id VARCHAR(255) UNIQUE,
                is_active BOOLEAN DEFAULT TRUE
            )
        `;
        const result = await pool.query(query);
        return result;
    }

    // Create indexes for better performance
    async createIndexes() {
        const indexes = [
            "CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action)",
            "CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp)",
            "CREATE INDEX IF NOT EXISTS idx_logs_route ON logs(route)",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_login_time ON user_sessions(login_time)",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active)"
        ];

        for (const indexQuery of indexes) {
            await pool.query(indexQuery);
        }
    }

    // Initialize tables
    async initializeTables() {
        await this.createLogsTable();
        await this.createUserSessionsTable();
        await this.createIndexes();
    }

    // Log a general action
    async createLog(logEntry: LogEntry) {
        const query = `
            INSERT INTO logs (
                user_id, username, user_email, action, route, method,
                request_data, response_data, status_code, client_ip,
                user_agent, session_id, timestamp, duration, error
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `;
        const values = [
            logEntry.userId || null,
            logEntry.username || null,
            logEntry.userEmail || null,
            logEntry.action,
            logEntry.route,
            logEntry.method,
            logEntry.requestData ? JSON.stringify(logEntry.requestData) : null,
            logEntry.responseData ? JSON.stringify(logEntry.responseData) : null,
            logEntry.statusCode,
            logEntry.clientIp,
            logEntry.userAgent || null,
            logEntry.sessionId || null,
            logEntry.timestamp,
            logEntry.duration || null,
            logEntry.error || null
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Log user login
    async createLoginLog(loginLog: LoginLog) {
        const query = `
            INSERT INTO user_sessions (
                user_id, username, user_email, login_time, client_ip,
                user_agent, session_id, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [
            loginLog.userId,
            loginLog.username,
            loginLog.userEmail,
            loginLog.loginTime,
            loginLog.clientIp,
            loginLog.userAgent || null,
            loginLog.sessionId || null,
            true
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Log user logout
    async updateLogoutLog(userId: string, sessionId?: string) {
        const query = `
            UPDATE user_sessions 
            SET logout_time = CURRENT_TIMESTAMP, is_active = FALSE
            WHERE user_id = $1 AND (session_id = $2 OR session_id IS NULL)
            AND is_active = TRUE
            RETURNING *
        `;
        const result = await pool.query(query, [userId, sessionId || null]);
        return result.rows;
    }

    // Get logs by user ID
    async getLogsByUserId(userId: string, limit: number = 100, offset: number = 0) {
        const query = `
            SELECT * FROM logs 
            WHERE user_id = $1 
            ORDER BY timestamp DESC 
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [userId, limit, offset]);
        return result.rows;
    }

    // Get logs by action
    async getLogsByAction(action: string, limit: number = 100, offset: number = 0) {
        const query = `
            SELECT * FROM logs 
            WHERE action = $1 
            ORDER BY timestamp DESC 
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [action, limit, offset]);
        return result.rows;
    }

    // Get all logs with pagination
    async getAllLogs(limit: number = 100, offset: number = 0) {
        const query = `
            SELECT * FROM logs 
            ORDER BY timestamp DESC 
            LIMIT $1 OFFSET $2
        `;
        const result = await pool.query(query, [limit, offset]);
        return result.rows;
    }

    // Get user sessions
    async getUserSessions(userId: string, limit: number = 50, offset: number = 0) {
        const query = `
            SELECT * FROM user_sessions 
            WHERE user_id = $1 
            ORDER BY login_time DESC 
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [userId, limit, offset]);
        return result.rows;
    }

    // Get active sessions
    async getActiveSessions() {
        const query = `
            SELECT * FROM user_sessions 
            WHERE is_active = TRUE 
            ORDER BY login_time DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // Get logs by date range
    async getLogsByDateRange(startDate: Date, endDate: Date, limit: number = 100, offset: number = 0) {
        const query = `
            SELECT * FROM logs 
            WHERE timestamp BETWEEN $1 AND $2 
            ORDER BY timestamp DESC 
            LIMIT $3 OFFSET $4
        `;
        const result = await pool.query(query, [startDate, endDate, limit, offset]);
        return result.rows;
    }

    // Get logs by IP address
    async getLogsByIp(clientIp: string, limit: number = 100, offset: number = 0) {
        const query = `
            SELECT * FROM logs 
            WHERE client_ip = $1 
            ORDER BY timestamp DESC 
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [clientIp, limit, offset]);
        return result.rows;
    }

    // Delete old logs (cleanup function)
    async deleteOldLogs(daysOld: number = 90) {
        const query = `
            DELETE FROM logs 
            WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '${daysOld} days'
        `;
        const result = await pool.query(query);
        return result.rowCount;
    }

    // Get log statistics
    async getLogStatistics() {
        const statsQuery = `
            SELECT 
                action,
                COUNT(*) as count,
                AVG(duration) as avg_duration,
                COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count
            FROM logs 
            WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '7 days'
            GROUP BY action
            ORDER BY count DESC
        `;
        const result = await pool.query(statsQuery);
        return result.rows;
    }
}

export default LogRepository;
