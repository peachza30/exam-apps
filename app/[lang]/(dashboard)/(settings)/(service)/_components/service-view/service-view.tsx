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
import { useUserStore } from "@/store/users/useUserStore";

const ServiceView = () => {
  const { service, createService, updateService } = useServiceStore();
  const { user, fetchUser } = useUserStore();

  const [serviceName, setServiceName] = useState("");
  const [serviceCode, setServiceCode] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [lastModified, setLastModified] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [serviceId, setServiceId] = useState(0);
  const [menuTopic, setMenuTopic] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (service) {
      const updatedBy = service.updated_by;

      const fetchUserData = async () => {
        if (updatedBy) {
          try {
            await fetchUser(updatedBy);
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        }
      };

      fetchUserData();
      // Added dependencies
      const updatedAt = service.updated_at;
      const userName = user ? `${user.first_name}.${user.last_name.slice(0, 2)}` : "Unknown User";

      setMenuTopic("Service Details");
      setServiceId(service.id || 0);
      setServiceName(service.service_name || "");
      setServiceCode(service.service_code || "");
      setDescription(service.service_description || "");
      setShow(service.status === "A");
      setStatus(service.status);
      setLastModified(userName || "");
      setModifiedBy(new Intl.DateTimeFormat("th-TH", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(updatedAt)));
    }
  }, [service]);
  useEffect(() => {
    if (show) {
      setStatus("A");
    } else {
      setStatus("I");
    }
  }, [show]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{menuTopic}</h1>
        <hr className="border-gray-200" />
      </div>

      {/* Service Details Grid */}
      <div className="space-y-6">
        {/* Service ID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">SERVICE ID</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{serviceId || "1"}</span>
          </div>
        </div>

        {/* Service Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">SERVICE NAME</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{serviceName}</span>
          </div>
        </div>

        {/* Service Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">SERVICE CODE</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900 font-mono text-sm">{serviceCode}</span>
          </div>
        </div>

        {/* Service Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">SERVICE DESCRIPTION</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{description}</span>
          </div>
        </div>

        {/* Status Active */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">STATUS ACTIVE</Label>
          <div className="md:col-span-2">
            <Badge color={status === "A" ? "success" : "warning"} variant="soft" className="uppercase">
              {status === "A" ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </div>

        {/* Last Modified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">LAST MODIFIED</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{lastModified}</span>
          </div>
        </div>

        {/* Modified By */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">MODIFIED BY</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{modifiedBy}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
        <Button
          type="button"
          onClick={() => {
            // Add edit functionality here
            console.log("Edit service");
          }}
        >
          Edit
        </Button>
        <Button type="button" color="destructive" variant="outline" onClick={() => router.push("/service-list")}>
          Back to List
        </Button>
      </div>
    </div>
  );
};

export default ServiceView;
