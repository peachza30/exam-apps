"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BasicSelect from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/react-select/basic-select";
import MergedInputGroup from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/input2/merged-input-group";
import OutlineButton from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/button/outline-button";
import BasicDataTable from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/data-table/service-table";
import SizeButton from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/button/size-button";
import InputPage from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/input/page";
import LabelInputRequired from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/input/label-input-required";
import LabelInput from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/input/label-input";
import { Badge } from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/ui/badge";
import { Label } from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/ui/label";
import ServiceForm from "../_components/service-form/service-form";
import { useServiceStore } from "@/store/service/useServiceStore";

const ManageService = () => {
  const { mode } = useServiceStore();
  const [topic, setTopic] = useState("");

  if (mode === "edit") {
    useEffect(() => {
      setTopic("Add/Edit Service");
    }, []);
  } else {
    useEffect(() => {
      setTopic("Add Service");
    }, []);
  }
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
          <ServiceForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageService;
