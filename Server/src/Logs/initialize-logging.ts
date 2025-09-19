// Initialize logging system - can be imported in the main server file
import LogService from "./LogServices/LogService.js";
import LogRepository from "./LogServices/LogRepository.js";

export async function initializeLoggingSystem() {
    console.log("🚀 Initializing comprehensive logging system...");
    
    try {
        const logRepository = new LogRepository();
        
        // Initialize database tables
        console.log("📋 Creating logging tables...");
        await logRepository.initializeTables();
        console.log("✅ Logging tables created successfully");
        
        // Test basic functionality
        console.log("🧪 Testing logging functionality...");
        const logService = new LogService();
        
        // Create a test log entry
        const testLog = {
            userId: "system-init",
            username: "system",
            userEmail: "system@localhost",
            action: "SYSTEM_INITIALIZATION",
            route: "/system/init",
            method: "POST",
            requestData: { initialization: true },
            responseData: { success: true },
            statusCode: 200,
            clientIp: "127.0.0.1",
            userAgent: "System Initialization",
            sessionId: "system-init-" + Date.now(),
            timestamp: new Date(),
            duration: 0
        };
        
        await logRepository.createLog(testLog);
        console.log("✅ Test log entry created successfully");
        
        console.log("🎉 Logging system initialized successfully!");
        console.log("📊 Logging features enabled:");
        console.log("   • API call tracking");
        console.log("   • User authentication logging");
        console.log("   • Task operation logging");
        console.log("   • IP address tracking");
        console.log("   • Session management");
        console.log("   • Error logging");
        console.log("   • Performance metrics");
        
        return true;
    } catch (error) {
        console.error("❌ Failed to initialize logging system:", error);
        return false;
    }
}

export default initializeLoggingSystem;
