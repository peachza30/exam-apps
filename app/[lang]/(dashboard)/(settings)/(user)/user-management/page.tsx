"use client";
import React, { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import UserDataTable from "../_components/data-table/user-table";
import SizeButton from "../_components/button/size-button";
const UsersList = () => {
  return (
    <>
      <Card title="Users List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">Users List</div>
            {/* <SizeButton /> */}
          </div>
        </CardHeader>
        <CardContent>
            <UserDataTable />
        </CardContent>
      </Card>
    </>
  );
};

export default UsersList;
