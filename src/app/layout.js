
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayoutClientSide from "@/app/MainLayoutClientSide";

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
        <MainLayoutClientSide>
            {children}
        </MainLayoutClientSide>
    );
}
