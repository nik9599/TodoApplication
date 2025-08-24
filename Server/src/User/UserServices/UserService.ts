import UserRepository from "./UserRepository.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validate } from "email-validator";
import bcrypt from "bcrypt";
dotenv.config();

class UserService {

    protected UserRepository: UserRepository;
    private jwtSecret: string = "TodoApplication"; // Simple development secret

    private isUserTableExists: boolean = false;

    constructor() {
        this.UserRepository = new UserRepository();
        this.checkIfTableExists();
    }


    async generateToken(id: string): Promise<string> {
        if (!this.jwtSecret) throw new Error("JWT_SECRET is not defined");
        return jwt.sign({ id }, this.jwtSecret, { expiresIn: "1d" });
    }

    async checkIfTableExists() {
        try{
        const result = await this.UserRepository.checkIfTableExists();
        if (result.length > 0) {
            this.isUserTableExists = true;
        }
        else {
            this.isUserTableExists = false;
        }
        }
        catch(error){
            await this.createTable()
            this.checkIfTableExists()
        }
    }

    async createTable() {
        const result = await this.UserRepository.createTable();
        if (result.length > 0) {
            this.isUserTableExists = true;
        }
        else {
            this.isUserTableExists = false;
        }
    }

    // login user
    async loginUser(req: any, res: any) {
        try {
            const result = await this.UserRepository.getUserByEmail(req.body.email);
            if (!result?.id) {
                return res.status(401).json({ message: "Invalid email or password", data: null });
            }
            const isPasswordValid = await this.comparePassword(req.body.password, result.password);
            if (isPasswordValid) {
                const token =  await this.generateToken(result.id);
                
                // Return only essential user data
                const userData = {
                    id: result.id,
                    username: result.username,
                    email: result.email
                };
                
                return res
                .cookie('token', token, {
                  httpOnly: true,
                  secure: false, // false for development (HTTP)
                  sameSite: 'lax', // more permissive for development
                  maxAge: 24 * 60 * 60 * 1000, // 1 day
                })
                .status(200)
                .json({ message: "Login successful", data: userData });
            }
            
            return res.status(200).json({ message: "Invalid email or password", data: null });
        } catch (error) {
            return res.status(500).json({ message: "Server error", data: error });
        }
    }

    async logoutUser(req: any, res: any) {
        return res.clearCookie('token').status(200).json({ message: "Logout successful" });
    }

    // verify token endpoint
    async verifyToken(req: any, res: any) {
        try {
            // If we reach here, the token is valid (userAuthenticated middleware passed)
            // Get user data from database
            const userData = await this.UserRepository.getUserById(req.user.id);
            
            if (userData) {
                // Return only essential user data
                const userInfo = {
                    id: userData.id,
                    username: userData.username,
                    email: userData.email
                };
                
                return res.status(200).json({ 
                    message: "Token is valid", 
                    data: { 
                        authenticated: true,
                        user: userInfo
                    } 
                });
            } else {
                return res.status(401).json({ 
                    message: "User not found", 
                    data: { authenticated: false } 
                });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server error", data: error });
        }
    }

    // signup user
    async signUpUser(req: any, res: any) {
        try {
            if (!this.isUserTableExists) {
                await this.createTable();
            }
            const { username, email, password } = req.body;
            const allUserData = await this.UserRepository.getAllUsers();
            const id = String(allUserData.length + 1);
            const hashedPassword = await this.userHasPasswordAuthenticated(password);
            const result = await this.UserRepository.createUser(username, email, hashedPassword, id);
            if (result) {
                // Return only essential user data
                const userData = {
                    id: result.id,
                    username: result.username,
                    email: result.email
                };
                return res.status(200).json({ 
                    message: "Signup successful", 
                    data: userData 
                });
            }
            return res.status(401).json({ message: "Signup failed" });
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    }

    // check if user is unique
    async isUserUnique(req: any, res: any, next: any) {
        try {
            const { email } = req.body;
            const password = String(req.body.password || '');
            if (!this.userEmailAuthenticated(email)) {
                return res.status(400).json({ message: "Invalid email" });
            }

            const existingUser = await this.UserRepository.getUserByEmail(email);

            if (existingUser?.id) {
                return res.status(400).json({ message: "User with this email already exists" });
            }

            if (password.length < 8) {
                return res.status(400).json({ message: "Password must be at least 8 characters long" });
            } else if (!/[A-Z]/.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
            } else if (!/[a-z]/.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
            } else if (!/[0-9]/.test(password)) {
                return res.status(400).json({ message: "Password must contain at least one number" });
            }

            // Pass to next middleware or handler
            next();
        } catch (error: any) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    // update user
    async updateUser(req: any, res: any) {
        try {
            const { id, userName, email, password } = req.body;
            console.log("id",id);
            console.log("userName",userName);
            console.log("email",email);
            console.log("password",password);
            const result = await this.UserRepository.updateUser(id, userName, email, password);
            if (result) {
                return res.status(200).json({ message: "User updated successfully" });
            }
            else {
                return res.status(401).json({ message: "User update failed" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    }

    // delete user
    async deleteUser(req: any, res: any) {
        try {
            const { id } = req.body;
            const result = await this.UserRepository.deleteUser(id);
            if (result) {
                return res.status(200).json({ message: "User deleted successfully" });
            }
            else {
                return res.status(401).json({ message: "User delete failed" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    }

    // check if user is authenticated
    userAuthenticated(req: any, res: any, next: any) {
        console.log("🔐 Auth middleware - Headers:", req.headers);
        console.log("🍪 Auth middleware - Cookies:", req.cookies);
        
        // First try to get token from Authorization header
        let token = req.headers.authorization?.split(" ")[1];
        console.log("📋 Token from header:", token);
        
        // If no token in header, try to get from cookies
        if (!token) {
            token = req.cookies?.token;
            console.log("🍪 Token from cookies:", token);
        }
        
        if (!token) {
            console.log("❌ No token found anywhere");
            return res.status(401).json({ message: "Unauthorized - No token found" });
        }
        
        try {
            const decoded = jwt.verify(token,  "TodoApplication");
            console.log("✅ Token verified, user:", decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.log("💥 Token verification failed:", error);
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
    }

    // check if email is valid
    userEmailAuthenticated(email: string) {
        if (validate(email)) {
            return true;
        }
        return false;
    }

    // hash password
   async userHasPasswordAuthenticated(password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
   async comparePassword(password: string, hashedPassword: string) {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
    }
    async isUserExists(userId: string) {
        const result = await this.UserRepository.getUserById(userId);
        if(result){
            return true;
        }
        return false;
    }
}

export default UserService;

