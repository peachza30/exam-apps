"use client";
import { useEffect, useState } from "react";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useRoleStore } from "@/store/role/useRoleStore";
import RoleForm from "../_components/role-form/role-form";

const ManageRole = () => {
  const {mode, error, resetForm, setMode } = useRoleStore();
  const [topic, setTopic] = useState("");

  useEffect(() => {
    // Cleanup function to reset form when leaving
    return () => {
      resetForm();
    };
  }, [mode, resetForm, setMode]);

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
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">Add New Role</div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
         <RoleForm mode="create"/>
        </CardContent>
      </Card>
    </>
  );
};

export default ManageRole;
