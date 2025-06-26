"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LogoTfac from "@/public/images/logo/tfac.png";

const LogInForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const AuthURL = process.env.NEXT_PUBLIC_AUTH_URL;

  useEffect(() => {
        const token = Cookies.get(process.env.NEXT_PUBLIC_COOKIES_NAME);
    if (token) {
      const localeMatch = pathname.match(/^\/(en|th)/);
      const locale = localeMatch ? localeMatch[1] : "en";

      router.replace(`/${locale}/dashboard`);
    }
  }, [pathname, router]);

  const handleLogin = async () => {
    // For external URLs, use window.location.href instead of router.push
    const azureLoginUrl = `${AuthURL}/auth/user/azure/login`;
    console.log('Redirecting to Azure AD:', azureLoginUrl);
    
    // Option 1: Redirect to Azure AD (external URL)
    window.location.href = azureLoginUrl;
    
    // Option 2: If you want to test with a fake cookie first
    // Cookies.set(process.env.NEXT_PUBLIC_COOKIES_NAME, 'test-token', { 
    //   path: '/',
    //   sameSite: 'lax'
    // });
    // const localeMatch = pathname.match(/^\/(en|th)/);
    // const locale = localeMatch ? localeMatch[1] : 'en';
    // window.location.href = `/${locale}/dashboard`; // Force reload to trigger middleware
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <Image src={LogoTfac} alt="logo" className="h-20 w-20 text-primary" />
      </div>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl text-center font-bold text-primary">
        TFAC BackOffice
      </div>
      <Button
        className="w-full mt-4"
        onClick={handleLogin}
        size={!isDesktop2xl ? "lg" : "md"}
      >
        <Icon icon="codicon:azure" className="h-5 w-5 mr-2" />
        Sign In with Azure AD
      </Button>
    </div>
  );
};

export default LogInForm;