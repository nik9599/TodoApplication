"use client"
import "./globals.css";
import NavBar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import {UserProvider} from "@/Components/ContextualStore/UserContext"
import { Provider } from 'react-redux'
import { store } from '@/app/store'


export default function MainLayoutClientSide({ children }) {
    return (
        <html lang="en">
        <body
        >
        <Provider store={store}>
        <UserProvider>
            <NavBar/>
            <main className="flex-1">
                {children}
            </main>
            <Footer/>
        </UserProvider>
        </Provider>
        </body>
        </html>
    );
}
