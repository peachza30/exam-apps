"use client";
import React, { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import SizeButton from "../_components/button/size-button";
import MenuManagement from "../_components/menu-manage/menu-manage";
import { Icon } from "@iconify/react";
import { useMenuStore } from "@/store/menu/useMenuStore";
const MenusList = () => {
  const { isReorderMode } = useMenuStore();

  return (
    <>
      <Card title="Menus List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">{!isReorderMode ? "Menu List" : "Menu Reordering"}</div>
           {!isReorderMode ? <SizeButton /> : "" }
          </div>

        </CardHeader>
        <CardContent>
          <MenuManagement />
        </CardContent>
      </Card>
    </>
  );
};

export default MenusList;
