"use client"; // Only for app router

import { useEffect, useContext } from "react";
import {UserContext} from "@/Components/ContextualStore/UserContext";
import { redirect } from 'next/navigation'

export default function Home() {
  const { isUserLogedIn} = useContext(UserContext)
  useEffect(() => {
    console.log("isUserLogedIn",isUserLogedIn)
    if (!Boolean(isUserLogedIn)) {
      redirect("/WelcomeUser");
    } else {
      redirect("/Dashboard"); // Optional: where to go if logged in
    }
  }, [isUserLogedIn]);

  return null; // Optionally show a loading state here
}
