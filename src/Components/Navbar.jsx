"use client"; // Add this to make it a client component if it uses hooks

import Link from "next/link";
import { useRouter } from "next/navigation"
import { CheckCircle, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button"
export default function NavBar() {
  const router = useRouter()
  const isLoggedIn = true;
  
  const handleLogout = () => {
    router.push("/Auth/Login")
  }
  return (
    <>
      {isLoggedIn ? (
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <header className="px-4 lg:px-6 h-14 flex items-center border-b  h-15">
          <Link href="/" className="flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold">GoalTodo</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
          </nav>
        </header>
      )}
    </>
  );
}
