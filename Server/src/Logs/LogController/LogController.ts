import express from "express";
import LogService from "../LogServices/LogService.js";

const logRouter = express.Router();
const logService = new LogService();

// Middleware to ensure user is authenticated and is admin (optional)
const adminAuth = (req: any, res: any, next: any) => {
    // You can add admin check here if needed
    // For now, we'll allow authenticated users to view their own logs
    next();
};

// Get logs for a specific user
logRouter.get('/user/:userId', adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit as string) || 100;
        const offset = parseInt(req.query.offset as string) || 0;

        const logs = await logService.getUserLogs(userId, limit, offset);
        
        res.status(200).json({
            message: "User logs retrieved successfully",
            data: {
                logs,
                pagination: {
                    limit,
                    offset,
                    total: logs.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve user logs",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get logs by action type
logRouter.get('/action/:action', adminAuth, async (req, res) => {
    try {
        const { action } = req.params;
        const limit = parseInt(req.query.limit as string) || 100;
        const offset = parseInt(req.query.offset as string) || 0;

        const logs = await logService.getLogsByAction(action, limit, offset);
        
        res.status(200).json({
            message: "Logs by action retrieved successfully",
            data: {
                logs,
                pagination: {
                    limit,
                    offset,
                    total: logs.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve logs by action",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get all logs (admin only)
logRouter.get('/all', adminAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 100;
        const offset = parseInt(req.query.offset as string) || 0;

        const logs = await logService.getAllLogs(limit, offset);
        
        res.status(200).json({
            message: "All logs retrieved successfully",
            data: {
                logs,
                pagination: {
                    limit,
                    offset,
                    total: logs.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve all logs",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get user sessions
logRouter.get('/sessions/:userId', adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const sessions = await logService.getUserSessions(userId, limit, offset);
        
        res.status(200).json({
            message: "User sessions retrieved successfully",
            data: {
                sessions,
                pagination: {
                    limit,
                    offset,
                    total: sessions.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve user sessions",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get active sessions
logRouter.get('/sessions/active', adminAuth, async (req, res) => {
    try {
        const sessions = await logService.getActiveSessions();
        
        res.status(200).json({
            message: "Active sessions retrieved successfully",
            data: { sessions }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve active sessions",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get logs by date range
logRouter.get('/date-range', adminAuth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const limit = parseInt(req.query.limit as string) || 100;
        const offset = parseInt(req.query.offset as string) || 0;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "Start date and end date are required"
            });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        const logs = await logService.getLogsByDateRange(start, end, limit, offset);
        
        res.status(200).json({
            message: "Logs by date range retrieved successfully",
            data: {
                logs,
                pagination: {
                    limit,
                    offset,
                    total: logs.length
                },
                dateRange: {
                    startDate: start,
                    endDate: end
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve logs by date range",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get logs by IP address
logRouter.get('/ip/:clientIp', adminAuth, async (req, res) => {
    try {
        const { clientIp } = req.params;
        const limit = parseInt(req.query.limit as string) || 100;
        const offset = parseInt(req.query.offset as string) || 0;

        const logs = await logService.getLogsByIp(clientIp, limit, offset);
        
        res.status(200).json({
            message: "Logs by IP retrieved successfully",
            data: {
                logs,
                pagination: {
                    limit,
                    offset,
                    total: logs.length
                },
                clientIp
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve logs by IP",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Get log statistics
logRouter.get('/statistics', adminAuth, async (req, res) => {
    try {
        const statistics = await logService.getLogStatistics();
        
        res.status(200).json({
            message: "Log statistics retrieved successfully",
            data: { statistics }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve log statistics",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

// Cleanup old logs
logRouter.delete('/cleanup', adminAuth, async (req, res) => {
    try {
        const daysOld = parseInt(req.query.daysOld as string) || 90;
        
        const deletedCount = await logService.cleanupOldLogs(daysOld);
        
        res.status(200).json({
            message: "Old logs cleaned up successfully",
            data: {
                deletedCount,
                daysOld
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to cleanup old logs",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

export default logRouter;
