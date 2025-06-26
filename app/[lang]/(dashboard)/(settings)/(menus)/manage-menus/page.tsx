"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/ui/label";
import MenuForm from "@/app/[lang]/(dashboard)/(settings)/(menus)/_components/menu-form/menu-form";
import MenuView from "@/app/[lang]/(dashboard)/(settings)/(menus)/_components/menu-view/menu-view";
import { useUserStore } from "@/store/users/useUserStore";
import { useMenuStore } from "@/store/menu/useMenuStore";
const ManageMenu = ({ params }: { params: { id: number } }) => {
  const { mode, iconName, getMenus, getMenu } = useMenuStore();
  const [topic, setTopic] = useState("");

  if (mode === "edit") {
    useEffect(() => {
      setTopic("Add/Edit Menu");
    }, []);
  } else {
    useEffect(() => {
      setTopic("Add Menu");
    }, []);
  }

  useEffect(() => {
    getMenu(params.id);
  }, []);
  console.log("mode", mode);

  return (
    <div className="h-max p-4 bg-gray-50">
      {" "}
      <Card className="flex flex-col h-full">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">{topic}</div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <MenuForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageMenu;
