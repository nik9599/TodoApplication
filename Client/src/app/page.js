"use client"; // Only for app router

import { useEffect, useContext } from "react";
import {UserContext} from "@/Components/ContextualStore/UserContext";
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isUserLogedIn, isLoading } = useContext(UserContext)
  const router = useRouter()
  
  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) {
      return
    }
    
    if (!Boolean(isUserLogedIn)) {
      router.push("/WelcomeUser");
    } else {
      router.push("/Dashboard");
    }
  }, [isUserLogedIn, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null; // Will redirect, so don't render anything
}
