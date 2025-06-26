"use client";
import { useEffect, useState } from "react";
import { useServiceStore } from "@/store/service/useServiceStore";
import { Label } from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/ui/badge";
import { Switch } from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/ui/switch";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/[lang]/(dashboard)/(settings)/(service)/_components/dialog/confirm-dialog";
import SuccessDialog from "../dialog/success-dialog";

const ServiceForm = ({ mode }: { mode: "create" | "edit" }) => {
  const { service, createService, updateService } = useServiceStore();
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("A");
  const [menuTopic, setMenuTopic] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (mode === "create") {
      setMenuTopic("");
      setServiceName("");
      setDescription("");
      setShow(true);
      setStatus("A");
    } else {
      setMenuTopic("Edit service");
      if (service) {
        setServiceName(service.service_name || "");
        setDescription(service.service_description || "");
        setShow(service.status === "A");
        setStatus(service.status);
      }
    }
  }, [service, mode]); // Added mode to dependency array

  useEffect(() => {
    if (show) {
      setStatus("A");
    } else {
      setStatus("I");
    }
  }, [show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName.trim()) {
      alert("Service name is required");
      return;
    }

    setOpenModal(true); // Open confirmation modal
  };

  const handleSuccessModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.push("/service-list");
    }
    setOpenSuccessModal(isOpen);
  };
  const handleConfirm = async () => {
    const serviceData = {
      service_name: serviceName,
      service_description: description,
      status: status,
    };

    try {
      if (mode === "create") {
        await createService(serviceData, {
          search: "",
          status: "",
          page: 1,
          limit: 5,
          sort: "created_at",
          order: "DESC",
        });
        console.log("Creating service:", serviceData);
        setServiceName("");
        setDescription("");
        setShow(true);
        setStatus("A");
      } else if (service?.id) {
        await updateService(service.id, serviceData, {
          search: "",
          status: "",
          page: 1,
          limit: 5,
          sort: "created_at",
          order: "DESC",
        });
        console.log("Updating service:", service.id, serviceData);
      }
      setOpenSuccessModal(true);
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Please try again.");
    }
  };

  let dialogConfig = {};
  let successDialogConfig = {};

  if (mode && mode === "create") {
    dialogConfig = {
      title: "Confirm Service Creation?",
      icon: "stash:question",
      class: "primary",
      color: "#2563EB",
      body: "Do you want to continue with this action?",
      sub: "Please confirm the creation of the new service, You can edit or delete this service later.",
      confirmButton: "Confirm",
      cancelButton: "Cancel",
    };
    successDialogConfig = {
      icon: "solar:verified-check-outline",
      body: "Service created successfully.",
      color: "#22C55E",
    };
  } else if (mode && mode === "edit") {
    dialogConfig = {
      title: "Confirm Save Change?",
      icon: "stash:question",
      class: "primary",
      color: "#2563EB",
      body: "Do you want to continue with this action?",
      sub: "Please confirm if you would like to proceed with these changes.",
      confirmButton: "Confirm",
      cancelButton: "Cancel",
    };
    successDialogConfig = {
      icon: "solar:verified-check-outline",
      body: "Changes saved successfully.",
      color: "#22C55E",
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      {openModal && <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={dialogConfig} />}
      {openSuccessModal && <SuccessDialog open={openSuccessModal} onOpenChange={handleSuccessModalChange} dialogConfig={successDialogConfig} />}

      <div className="pl-2 pb-1 grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center text-default-900">
        <p className="text-xl">{menuTopic}</p>
      </div>
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="serviceName">
          SERVICE NAME <span className="text-warning">*</span>
        </Label>
        <Input
          type="text"
          value={serviceName} // Changed from defaultValue to value
          onChange={e => setServiceName(e.target.value)}
          placeholder="Please enter service name"
          id="serviceName"
          required
        />
      </div>
      <div className="p-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="inputId">
          SERVICE DESCRIPTION
        </Label>
        <Textarea
          value={description} // Changed from defaultValue to value
          onChange={e => setDescription(e.target.value)}
          placeholder="Please enter service description"
          rows={3}
        />
      </div>
      {mode === "edit" && (
        <>
          <div className="pt-1 pl-20 pr-20">
            <Label className="mb-3" htmlFor="inputId">
              STATUS ACTIVE
            </Label>
          </div>
          <div className="p-1 pl-20 pr-20 flex items-center gap-5">
            <Switch id="airplane-mode" checked={show} onCheckedChange={() => setShow(!show)} color="success" />
            <Badge color={show ? "success" : "warning"} variant="soft">
              {show ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </>
      )}

      <div className="p-5 pl-20 pr-20 gap-4 flex items-center justify-start">
        <Button type="submit">Submit</Button>
        <Button type="button" color="destructive" variant="outline" onClick={() => router.push("/service-list")}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
