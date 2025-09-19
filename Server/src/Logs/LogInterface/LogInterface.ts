export interface LogEntry {
    id?: string;
    userId?: string;
    username?: string;
    userEmail?: string;
    action: string; // 'LOGIN', 'LOGOUT', 'API_CALL', 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK', etc.
    route: string; // The API route called
    method: string; // HTTP method (GET, POST, PUT, DELETE)
    requestData?: any; // Input data sent by user
    responseData?: any; // Response data sent back
    statusCode: number; // HTTP status code
    clientIp: string; // Client IP address
    userAgent?: string; // User agent string
    sessionId?: string; // Session identifier
    timestamp: Date; // When the action occurred
    duration?: number; // Request duration in milliseconds
    error?: string; // Error message if any
}

export interface LoginLog {
    id?: string;
    userId: string;
    username: string;
    userEmail: string;
    loginTime: Date;
    logoutTime?: Date;
    clientIp: string;
    userAgent?: string;
    sessionId?: string;
    isActive: boolean; // Whether the session is still active
}

export interface ApiCallLog {
    id?: string;
    userId?: string;
    route: string;
    method: string;
    requestData?: any;
    responseData?: any;
    statusCode: number;
    clientIp: string;
    userAgent?: string;
    timestamp: Date;
    duration?: number;
    error?: string;
}
