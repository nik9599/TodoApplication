// app/page.tsx or pages/index.js
"use client"; // Only for app router

import { useEffect } from "react";
import { redirect } from 'next/navigation'


export default function Home() {

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token") || true; // Or use your auth method
    if (!isLoggedIn) {
      redirect("/WelcomeUser");
    } else {
      redirect("/Dashboard"); // Optional: where to go if logged in
    }
  }, []);

  return null; // or loading spinner
}
