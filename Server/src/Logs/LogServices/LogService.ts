import LogRepository from "./LogRepository.js";
import { LogEntry, LoginLog, ApiCallLog } from "../LogInterface/LogInterface.js";
import { Request, Response } from "express";

class LogService {
    private logRepository: LogRepository;

    constructor() {
        this.logRepository = new LogRepository();
        this.initializeLogging();
    }

    // Initialize logging tables
    private async initializeLogging() {
        try {
            await this.logRepository.initializeTables();
            console.log("✅ Logging tables initialized successfully");
        } catch (error) {
            console.error("❌ Failed to initialize logging tables:", error);
        }
    }

    // Get client IP address from request
    private getClientIp(req: Request): string {
        const forwarded = req.headers['x-forwarded-for'];
        const realIp = req.headers['x-real-ip'];
        const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
        
        if (forwarded) {
            return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
        }
        
        if (realIp) {
            return Array.isArray(realIp) ? realIp[0] : realIp;
        }
        
        return remoteAddress || req.ip || 'unknown';
    }

    // Generate session ID
    private generateSessionId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Log API call
    async logApiCall(req: Request, res: Response, startTime: number, error?: string) {
        try {
            const clientIp = this.getClientIp(req);
            const userAgent = req.headers['user-agent'];
            
            // Extract user info if available
            let userId: string | undefined, username: string | undefined, userEmail: string | undefined;
            if (req.user) {
                userId = req.user.id;
                // Try to get username and email from the request or user data
                username = req.user.username || req.body?.username;
                userEmail = req.user.email || req.body?.email;
            }

            const logEntry: LogEntry = {
                userId,
                username,
                userEmail,
                action: this.getActionFromRoute(req.route?.path || req.path, req.method),
                route: req.route?.path || req.path,
                method: req.method,
                requestData: this.sanitizeRequestData(req.body, req.query, req.params),
                responseData: res.locals?.responseData || null,
                statusCode: res.statusCode,
                clientIp,
                userAgent,
                sessionId: req.sessionID || this.generateSessionId(),
                timestamp: new Date(),
                duration: Date.now() - startTime,
                error: error || undefined
            };

            await this.logRepository.createLog(logEntry);
        } catch (error) {
            console.error("❌ Failed to log API call:", error);
        }
    }

    // Log user login
    async logUserLogin(userId: string, username: string, userEmail: string, req: Request) {
        try {
            const clientIp = this.getClientIp(req);
            const userAgent = req.headers['user-agent'];
            const sessionId = req.sessionID || this.generateSessionId();

            const loginLog: LoginLog = {
                userId,
                username,
                userEmail,
                loginTime: new Date(),
                clientIp,
                userAgent,
                sessionId,
                isActive: true
            };

            const result = await this.logRepository.createLoginLog(loginLog);
            
            // Also log as a general log entry
            const logEntry: LogEntry = {
                userId,
                username,
                userEmail,
                action: 'LOGIN',
                route: '/user/login',
                method: 'POST',
                requestData: { email: userEmail },
                statusCode: 200,
                clientIp,
                userAgent,
                sessionId,
                timestamp: new Date()
            };

            await this.logRepository.createLog(logEntry);
            return result;
        } catch (error) {
            console.error("❌ Failed to log user login:", error);
        }
    }

    // Log user logout
    async logUserLogout(userId: string, req: Request) {
        try {
            const clientIp = this.getClientIp(req);
            const userAgent = req.headers['user-agent'];
            const sessionId = req.sessionID;

            // Update logout time in sessions table
            await this.logRepository.updateLogoutLog(userId, sessionId);

            // Also log as a general log entry
            const logEntry: LogEntry = {
                userId,
                action: 'LOGOUT',
                route: '/user/logout',
                method: 'GET',
                statusCode: 200,
                clientIp,
                userAgent,
                sessionId,
                timestamp: new Date()
            };

            await this.logRepository.createLog(logEntry);
        } catch (error) {
            console.error("❌ Failed to log user logout:", error);
        }
    }

    // Log task operations
    async logTaskOperation(
        action: string, 
        userId: string, 
        username: string, 
        userEmail: string, 
        req: Request, 
        res: Response,
        startTime: number,
        error?: string
    ) {
        try {
            const clientIp = this.getClientIp(req);
            const userAgent = req.headers['user-agent'];

            const logEntry: LogEntry = {
                userId,
                username,
                userEmail,
                action,
                route: req.route?.path || req.path,
                method: req.method,
                requestData: this.sanitizeRequestData(req.body, req.query, req.params),
                responseData: res.locals?.responseData || null,
                statusCode: res.statusCode,
                clientIp,
                userAgent,
                sessionId: req.sessionID || this.generateSessionId(),
                timestamp: new Date(),
                duration: Date.now() - startTime,
                error: error || undefined
            };

            await this.logRepository.createLog(logEntry);
        } catch (error) {
            console.error("❌ Failed to log task operation:", error);
        }
    }

    // Get action type from route and method
    private getActionFromRoute(route: string, method: string): string {
        const routeActionMap: { [key: string]: string } = {
            '/user/login': 'LOGIN',
            '/user/logout': 'LOGOUT',
            '/user/signup': 'SIGNUP',
            '/user/verify-token': 'VERIFY_TOKEN',
            '/user/update': 'UPDATE_USER',
            '/user/delete': 'DELETE_USER',
            '/task': method === 'GET' ? 'GET_TASKS' : method === 'POST' ? 'CREATE_TASK' : 'UPDATE_TASK',
            '/task/:id': method === 'GET' ? 'GET_TASK' : method === 'PUT' ? 'UPDATE_TASK' : 'DELETE_TASK'
        };

        return routeActionMap[route] || `${method}_${route.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`;
    }

    // Sanitize request data to avoid logging sensitive information
    private sanitizeRequestData(body: any, query: any, params: any): any {
        const sanitizedData: any = {};

        // Sanitize body
        if (body) {
            const sanitizedBody = { ...body };
            if (sanitizedBody.password) {
                sanitizedBody.password = '[REDACTED]';
            }
            if (sanitizedBody.token) {
                sanitizedBody.token = '[REDACTED]';
            }
            sanitizedData.body = sanitizedBody;
        }

        // Sanitize query
        if (query && Object.keys(query).length > 0) {
            sanitizedData.query = query;
        }

        // Sanitize params
        if (params && Object.keys(params).length > 0) {
            sanitizedData.params = params;
        }

        return sanitizedData;
    }

    // Get logs for a specific user
    async getUserLogs(userId: string, limit: number = 100, offset: number = 0) {
        try {
            return await this.logRepository.getLogsByUserId(userId, limit, offset);
        } catch (error) {
            console.error("❌ Failed to get user logs:", error);
            return [];
        }
    }

    // Get logs by action
    async getLogsByAction(action: string, limit: number = 100, offset: number = 0) {
        try {
            return await this.logRepository.getLogsByAction(action, limit, offset);
        } catch (error) {
            console.error("❌ Failed to get logs by action:", error);
            return [];
        }
    }

    // Get all logs
    async getAllLogs(limit: number = 100, offset: number = 0) {
        try {
            return await this.logRepository.getAllLogs(limit, offset);
        } catch (error) {
            console.error("❌ Failed to get all logs:", error);
            return [];
        }
    }

    // Get user sessions
    async getUserSessions(userId: string, limit: number = 50, offset: number = 0) {
        try {
            return await this.logRepository.getUserSessions(userId, limit, offset);
        } catch (error) {
            console.error("❌ Failed to get user sessions:", error);
            return [];
        }
    }

    // Get active sessions
    async getActiveSessions() {
        try {
            return await this.logRepository.getActiveSessions();
        } catch (error) {
            console.error("❌ Failed to get active sessions:", error);
            return [];
        }
    }

    // Get logs by date range
    async getLogsByDateRange(startDate: Date, endDate: Date, limit: number = 100, offset: number = 0) {
        try {
            return await this.logRepository.getLogsByDateRange(startDate, endDate, limit, offset);
        } catch (error) {
            console.error("❌ Failed to get logs by date range:", error);
            return [];
        }
    }

    // Get logs by IP
    async getLogsByIp(clientIp: string, limit: number = 100, offset: number = 0) {
        try {
            return await this.logRepository.getLogsByIp(clientIp, limit, offset);
        } catch (error) {
            console.error("❌ Failed to get logs by IP:", error);
            return [];
        }
    }

    // Get log statistics
    async getLogStatistics() {
        try {
            return await this.logRepository.getLogStatistics();
        } catch (error) {
            console.error("❌ Failed to get log statistics:", error);
            return [];
        }
    }

    // Cleanup old logs
    async cleanupOldLogs(daysOld: number = 90) {
        try {
            const deletedCount = await this.logRepository.deleteOldLogs(daysOld);
            console.log(`✅ Cleaned up ${deletedCount} old log entries`);
            return deletedCount;
        } catch (error) {
            console.error("❌ Failed to cleanup old logs:", error);
            return 0;
        }
    }
}

export default LogService;
