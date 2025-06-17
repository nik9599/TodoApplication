import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import {UserProvider} from "../Components/ContextualStore/UserHook"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Easy Notes",
  description: "Write Your Daily Task",
}; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased text-black`}
      >
        <UserProvider>
        <NavBar/>
         <main className="flex-1">{children}</main>
         <Footer/>
         </UserProvider>
      </body>
    </html>
  );
}
