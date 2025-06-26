"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function clearCookieAction() {
  const cookieStore = cookies();

  // Clear specific cookies
  cookieStore.delete("DEVELOPMENT_Authentication");
  cookieStore.delete("token");
  cookieStore.delete("userId");
  
  console.log("Server-side cookies cleared");
  
  // Optionally redirect after clearing cookies
  // redirect('/login');
}

export async function logoutAction() {
  const cookieStore = cookies();

  // Clear all authentication cookies
  cookieStore.delete("DEVELOPMENT_Authentication");
  cookieStore.delete("token");
  cookieStore.delete("userId");
  
  // Redirect to login page after logout
  redirect('/login');
}