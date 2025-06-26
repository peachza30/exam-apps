"use client";

import { Button } from "@/components/ui/button";

export const LogoutBtn = () => {
  const handleLogout = async () => {
    const cookieNames = [
      process.env.NEXT_PUBLIC_COOKIES_NAME, 
      "token",
      "userId"
    ].filter(Boolean);

    cookieNames.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.tfac.or.th`;
    });

    window.location.href = "/login";
  };

  return (
    <Button
      className="md:block hidden"
      variant="outline"
      color="destructive"
      onClick={handleLogout}
    >
      LOGOUT
    </Button>
  );
};
