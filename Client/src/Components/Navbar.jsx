"use client"; // Add this to make it a client component if it uses hooks

import Link from "next/link";
import {useContext} from "react";
import { useRouter } from "next/navigation"
import { CheckCircle, LogOut, Search, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button"
import {UserContext} from "@/Components/ContextualStore/UserContext";
import { logoutUsers } from "@/app/Auth/reducer/login.reducer";
import { useDispatch, useSelector } from "react-redux";

export default function NavBar() {
  const router = useRouter()
  const { isUserLogedIn, setIsUserLogedIn } = useContext(UserContext)
  const isLoggedIn = isUserLogedIn;
  const dispatch = useDispatch()
  const logoutState = useSelector((state) => state.login)
  const { data, loading, error: logoutError, logoutSuccess, isLogoutError } = logoutState
  
  const handleLogout = () => {
    dispatch(logoutUsers())
    if(logoutSuccess){
      setIsUserLogedIn(false)
      router.push("/")  
    }
  }

  const handleLogin = () => {
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
                  disabled={loading}
                  loading={loading}
                >
                  <LogOut className="h-4 w-4" />
                  {loading ? "Logging out..." : "Logout"}
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
            <Link
                href="/Auth/Login"
                className="text-sm font-medium hover:underline underline-offset-4"
            >
              <div className="flex items-center gap-2">
                { isLoggedIn
                    ? <>
                      <LogOut className="h-4 w-4" />
                       Logout
                    </>
                    : <>
                      <LogIn className="h-4 w-4"/>
                      Login
                    </>
                }
              </div>
            </Link>
          </nav>
        </header>
      )}
    </>
  );
}
