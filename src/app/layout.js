import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-black`}
      >
        <div className=" flex flex-col min-h-screen" >
         <header> <Navbar/></header>
         <main className="flex-1">{children}</main>
         <footer><Footer/></footer>
         </div>
      </body>
    </html>
  );
}
