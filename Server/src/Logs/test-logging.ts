// Test script to verify logging functionality
import LogService from "./LogServices/LogService.js";
import LogRepository from "./LogServices/LogRepository.js";

async function testLogging() {
    console.log("🧪 Testing logging functionality...");
    
    try {
        const logService = new LogService();
        const logRepository = new LogRepository();
        
        // Test 1: Initialize tables
        console.log("📋 Initializing logging tables...");
        await logRepository.initializeTables();
        console.log("✅ Tables initialized successfully");
        
        // Test 2: Create a sample log entry
        console.log("📝 Creating sample log entry...");
        const sampleLog = {
            userId: "test-user-123",
            username: "testuser",
            userEmail: "test@example.com",
            action: "TEST_ACTION",
            route: "/test",
            method: "GET",
            requestData: { test: "data" },
            responseData: { success: true },
            statusCode: 200,
            clientIp: "127.0.0.1",
            userAgent: "Test Agent",
            sessionId: "test-session-123",
            timestamp: new Date(),
            duration: 150
        };
        
        const createdLog = await logRepository.createLog(sampleLog);
        console.log("✅ Sample log created:", createdLog.id);
        
        // Test 3: Create a login log
        console.log("🔐 Creating sample login log...");
        const loginLog = {
            userId: "test-user-123",
            username: "testuser",
            userEmail: "test@example.com",
            loginTime: new Date(),
            clientIp: "127.0.0.1",
            userAgent: "Test Agent",
            sessionId: "test-session-123",
            isActive: true
        };
        
        const createdLoginLog = await logRepository.createLoginLog(loginLog);
        console.log("✅ Login log created:", createdLoginLog.id);
        
        // Test 4: Retrieve logs
        console.log("📊 Retrieving logs...");
        const allLogs = await logRepository.getAllLogs(10, 0);
        console.log("✅ Retrieved logs:", allLogs.length);
        
        // Test 5: Get user logs
        console.log("👤 Retrieving user logs...");
        const userLogs = await logRepository.getLogsByUserId("test-user-123", 10, 0);
        console.log("✅ Retrieved user logs:", userLogs.length);
        
        // Test 6: Get active sessions
        console.log("🟢 Retrieving active sessions...");
        const activeSessions = await logRepository.getActiveSessions();
        console.log("✅ Active sessions:", activeSessions.length);
        
        // Test 7: Update logout
        console.log("🚪 Testing logout update...");
        const logoutResult = await logRepository.updateLogoutLog("test-user-123", "test-session-123");
        console.log("✅ Logout updated:", logoutResult.length);
        
        // Test 8: Get statistics
        console.log("📈 Getting log statistics...");
        const stats = await logRepository.getLogStatistics();
        console.log("✅ Statistics:", stats);
        
        console.log("🎉 All logging tests passed!");
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

// Run the test
testLogging().then(() => {
    console.log("✨ Logging test completed");
    process.exit(0);
}).catch((error) => {
    console.error("💥 Test failed with error:", error);
    process.exit(1);
});
