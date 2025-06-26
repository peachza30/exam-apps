"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/ui/label";
import { toast } from "sonner";
import { useRoleStore } from "@/store/role/useRoleStore";
import RoleView from "../../_components/role-view/role-view";
import RoleForm from "../../_components/role-form/role-form";
const ManageRole = ({ params }: { params: { id: number } }) => {
  const { mode, error, resetForm, loadRoleData} = useRoleStore();
  const [topic, setTopic] = useState("");
  const roleId = params.id;

  useEffect(() => {
    // Cleanup function to reset form when leaving
    return () => {
      resetForm();
    };
  }, [mode, roleId, loadRoleData, resetForm]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {" "}
      <Card className="flex flex-col h-full">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">{mode === "view" && "View Role" } {mode === "edit" && "Add/Edit Role"}</div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          {mode === "view" && <RoleView mode="view" roleId={roleId}  />}
          {mode === "edit" && <RoleForm mode="edit" roleId={roleId} />}
        </CardContent> 
      </Card>
    </>
  );
};

export default ManageRole;
