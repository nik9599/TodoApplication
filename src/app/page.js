"use client"; // Only for app router

import { useEffect, useContext } from "react";
import {UserContext} from "@/Components/ContextualStore/UserContext";
import { redirect } from 'next/navigation'

export default function Home() {
  const { isUserLogedIn} = useContext(UserContext)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token") || true; // Or use your auth method
    if (!isUserLogedIn) {
      redirect("/WelcomeUser");
    } else {
      redirect("/Dashboard"); // Optional: where to go if logged in
    }
  }, []);

  return null; // Optionally show a loading state here
}
