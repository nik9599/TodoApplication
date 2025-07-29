import UserRepository from "./UserRepository.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validate } from "email-validator";
import bcrypt from "bcrypt";
dotenv.config();

class UserService {

    protected UserRepository: UserRepository;
    private jwtSecret: string = process.env.JWT_SECRET || "";

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
            console.log("result",result);
            const isPasswordValid = await this.comparePassword(req.body.password, result.password);
            console.log("isPasswordValid",isPasswordValid);
            if (isPasswordValid) {
                const token =  await this.generateToken(result.id);
                return res.status(200).json({ message: "Login successful", data: result, token: token });
            }
            
            return res.status(401).json({ message: "Invalid email or password", data: null });
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
                return res.status(200).json({ message: "Signup successful" });
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
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, this.jwtSecret);
        req.user = decoded;
        next();
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
}

export default UserService;

