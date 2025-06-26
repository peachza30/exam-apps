"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/ui/label";
import PartnerForm from "@/app/[lang]/(dashboard)/(settings)/(partner)/_components/partner-form/partner-form";
import PartnerView from "../../_components/partner-view/partner-view";
import { useUserStore } from "@/store/users/useUserStore";
import { usePartnerStore } from "@/store/partner/usePartnerStore";
const ManagePartner = ({ params }: { params: { id: number } }) => {
  const { mode, fetchPartner } = usePartnerStore();
  console.log("mode", mode);
  const [topic, setTopic] = useState("");

  if (mode === "edit") {
    useEffect(() => {
      setTopic("Add/Edit User");
    }, []);
  } else {
    useEffect(() => {
      setTopic("Add User");
    }, []);
  }

  useEffect(() => {
    fetchPartner(params.id);
  }, []);

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
          {mode === "view" && <PartnerView partnerId={params.id} />}
          {mode === "edit" && <PartnerForm mode="edit" partnerId={params.id} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagePartner;
