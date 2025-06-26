"use client";
import React, { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { SiteLogo } from "@/components/svg";

const RolesList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleLogin = async () => {
    await router.push(`${BaseURL}/dashboard`);
  };
  return (
    <div className="w-full ">
      <div className="flex items-center justify-center">
        {/* <SiteLogo className="h-10 w-10 2xl:h-14 2xl:w-14 text-primary" /> */}
        <Image src={SiteLogo} alt="SiteLogo" className="h-20 w-20 text-primary" />
        {/* <h3 className="2xl:text-3xl text-2xl font-bold text-default-900"> TFAC BackOffice</h3> */}
      </div>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl text-center font-bold text-primary">
        TFAC BackOffice/roles-list
      </div>
      <Button
        className="w-full mt-4"
        onClick={() => handleLogin()}
        size={!isDesktop2xl ? "lg" : "md"}
      >
        Go back
      </Button>
    </div>
  );
};

export default RolesList;
