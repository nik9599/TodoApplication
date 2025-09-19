import { Request, Response, NextFunction } from "express";
import LogService from "../LogServices/LogService.js";

class LogMiddleware {
    private logService: LogService;

    constructor() {
        this.logService = new LogService();
    }

    // Middleware to log all API requests
    logApiRequests() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const startTime = Date.now();
            
            // Prevent duplicate logging by checking if already logged
            if (res.locals.logged) {
                return next();
            }
            
            // Store original res.end method
            const originalEnd = res.end;
            
            // Override res.end to capture response data and log
            res.end = function(chunk: any, encoding?: any): any {
                // Call original end method
                const result = originalEnd.call(res, chunk, encoding);
                
                // Only log if not already logged
                if (!res.locals.logged) {
                    res.locals.logged = true;
                    
                    // Log the API call after response is sent
                    const logService = new LogService();
                    logService.logApiCall(req, res, startTime).catch(error => {
                        console.error("Failed to log API call:", error);
                    });
                }
                
                return result;
            };

            // Store response data in res.locals for logging
            const originalJson = res.json;
            res.json = function(obj: any) {
                res.locals.responseData = obj;
                return originalJson.call(res, obj);
            };

            next();
        };
    }

    // Middleware specifically for task operations
    logTaskOperations() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const startTime = Date.now();
            
            // Store original res.end method
            const originalEnd = res.end;
            
            // Override res.end to capture response and log task operation
            res.end = function(chunk: any, encoding?: any): any {
                // Call original end method
                const result = originalEnd.call(res, chunk, encoding);
                
                // Log the task operation after response is sent
                const logService = new LogService();
                if (req.user) {
                    logService.logTaskOperation(
                        getTaskActionFromRoute(req.route?.path || req.path, req.method),
                        req.user.id,
                        req.user.username || '',
                        req.user.email || '',
                        req,
                        res,
                        startTime
                    ).catch(error => {
                        console.error("Failed to log task operation:", error);
                    });
                }
                
                return result;
            };

            // Store response data in res.locals for logging
            const originalJson = res.json;
            res.json = function(obj: any) {
                res.locals.responseData = obj;
                return originalJson.call(res, obj);
            };

            next();
        };
    }

    // Middleware specifically for user operations
    logUserOperations() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const startTime = Date.now();
            
            // Store original res.end method
            const originalEnd = res.end;
            
            // Override res.end to capture response and log user operation
            res.end = function(chunk: any, encoding?: any): any {
                // Call original end method
                const result = originalEnd.call(res, chunk, encoding);
                
                // Log the user operation after response is sent
                const logService = new LogService();
                if (req.user) {
                    logService.logTaskOperation(
                        getUserActionFromRoute(req.route?.path || req.path, req.method),
                        req.user.id,
                        req.user.username || '',
                        req.user.email || '',
                        req,
                        res,
                        startTime
                    ).catch(error => {
                        console.error("Failed to log user operation:", error);
                    });
                }
                
                return result;
            };

            // Store response data in res.locals for logging
            const originalJson = res.json;
            res.json = function(obj: any) {
                res.locals.responseData = obj;
                return originalJson.call(res, obj);
            };

            next();
        };
    }

    // Middleware to log authentication events
    logAuthEvents() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const startTime = Date.now();
            
            // Store original res.end method
            const originalEnd = res.end;
            
            // Override res.end to capture response and log auth events
            res.end = function(chunk: any, encoding?: any): any {
                // Call original end method
                const result = originalEnd.call(res, chunk, encoding);
                
                // Log auth events after response is sent
                const logService = new LogService();
                logService.logApiCall(req, res, startTime).catch(error => {
                    console.error("Failed to log auth event:", error);
                });
                
                return result;
            };

            // Store response data in res.locals for logging
            const originalJson = res.json;
            res.json = function(obj: any) {
                res.locals.responseData = obj;
                return originalJson.call(res, obj);
            };

            next();
        };
    }
}

// Helper function to determine task action from route
function getTaskActionFromRoute(route: string, method: string): string {
    const routeActionMap: { [key: string]: string } = {
        '/task': method === 'GET' ? 'GET_TASKS' : method === 'POST' ? 'CREATE_TASK' : 'UPDATE_TASK',
        '/task/:id': method === 'GET' ? 'GET_TASK' : method === 'PUT' ? 'UPDATE_TASK' : 'DELETE_TASK'
    };

    // Check for exact matches first
    if (routeActionMap[route]) {
        return routeActionMap[route];
    }

    // Check for pattern matches
    if (route.includes('/task/') && method === 'PUT') {
        return 'UPDATE_TASK';
    }
    if (route.includes('/task/') && method === 'DELETE') {
        return 'DELETE_TASK';
    }
    if (route.includes('/task/') && method === 'GET') {
        return 'GET_TASK';
    }
    if (route === '/task' && method === 'GET') {
        return 'GET_TASKS';
    }
    if (route === '/task' && method === 'POST') {
        return 'CREATE_TASK';
    }

    return `${method}_TASK_OPERATION`;
}

// Helper function to determine user action from route
function getUserActionFromRoute(route: string, method: string): string {
    const routeActionMap: { [key: string]: string } = {
        '/user/login': 'LOGIN',
        '/user/logout': 'LOGOUT',
        '/user/signup': 'SIGNUP',
        '/user/verify-token': 'VERIFY_TOKEN',
        '/user/update': 'UPDATE_USER',
        '/user/delete': 'DELETE_USER'
    };

    return routeActionMap[route] || `${method}_USER_OPERATION`;
}

export default LogMiddleware;
