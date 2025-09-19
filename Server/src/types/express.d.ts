// Extend Express Request interface to include user and sessionID
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username?: string;
                email?: string;
            };
            sessionID?: string;
        }
    }
}

export {};
