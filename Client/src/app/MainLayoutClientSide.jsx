"use client"
import "./globals.css";
import NavBar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import {UserProvider} from "@/Components/ContextualStore/UserContext"

export default function MainLayoutClientSide({ children }) {
    return (
        <html lang="en">
        <body
        >
        <UserProvider>
            <NavBar/>
            <main className="flex-1">
                {children}
            </main>
            <Footer/>
        </UserProvider>
        </body>
        </html>
    );
}
