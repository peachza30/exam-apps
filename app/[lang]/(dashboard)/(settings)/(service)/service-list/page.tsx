"use client";
import React, { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import ServiceDataTable from "../_components/data-table/service-table";
import SizeButton from "../_components/button/size-button";
const ServicesList = () => {
  return (
    <>
      <Card title="Services List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">Services List</div>
            <SizeButton />
          </div>
        </CardHeader>
        <CardContent>
          <ServiceDataTable />
        </CardContent>
      </Card>
    </>
  );
};

export default ServicesList;
