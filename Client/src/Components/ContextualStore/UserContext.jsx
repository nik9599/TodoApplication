"use client"
import { createContext, useState, useEffect, useRef } from "react";
import apiClient from "../api/axiosConfig";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    // Initialize state from localStorage if available
    const [isUserLogedIn, setIsUserLogedIn] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('isUserLoggedIn') === 'true';
        }
        return false;
    });
    
    const [userDataResp, setUserDataResp] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('userData');
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const authCheckRef = useRef(false); // Prevent multiple simultaneous auth checks

    // Check authentication status on app startup
    useEffect(() => {
        // Prevent multiple simultaneous auth checks
        if (authCheckRef.current) {
            return;
        }
        
        const checkAuthStatus = async () => {
            if (authCheckRef.current) return;
            authCheckRef.current = true;
            
            try {
                const response = await apiClient.get('/user/verify-token');
                
                if (response.data?.data?.authenticated) {
                    setIsUserLogedIn(true);
                    
                    // If we have user data in response, update it
                    if (response.data?.data?.user) {
                        const userData = response.data.data.user;
                        setUserDataResp(userData);
                        // Store in localStorage
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('userData', JSON.stringify(userData));
                            localStorage.setItem('isUserLoggedIn', 'true');
                        }
                    }
                } else {
                    setIsUserLogedIn(false);
                    setUserDataResp(null);
                    // Clear localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('isUserLoggedIn');
                        localStorage.removeItem('userData');
                    }
                }
            } catch (error) {
                setIsUserLogedIn(false);
                setUserDataResp(null);
                // Clear localStorage on error
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('isUserLoggedIn');
                    localStorage.removeItem('userData');
                }
            } finally {
                setIsLoading(false);
                authCheckRef.current = false;
            }
        };

        checkAuthStatus();
    }, []); // Empty dependency array - only run once on mount

    // Function to handle logout
    const handleLogout = () => {
        setIsUserLogedIn(false);
        setUserDataResp(null);
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isUserLoggedIn');
            localStorage.removeItem('userData');
        }
    };

    // Function to handle successful login
    const handleLogin = (userData) => {
        setIsUserLogedIn(true);
        setUserDataResp(userData);
        // Store in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('isUserLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <UserContext.Provider value={{
            isUserLogedIn, 
            setIsUserLogedIn, 
            userDataResp, 
            setUserDataResp,
            handleLogout,
            handleLogin
        }}>
            {children}
        </UserContext.Provider>
    );
};