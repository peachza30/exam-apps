"use client";
import { useEffect, useState } from "react";
import { Label } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/badge";
import { Switch } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/switch";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/dialog/confirm-dialog";
import { useUserStore } from "@/store/users/useUserStore";
import { usePartnerStore } from "@/store/partner/usePartnerStore";
import { Icon } from "@iconify/react";

const PartnerView = () => {
  const { user, fetchUser } = useUserStore();
  const { partner } = usePartnerStore();
  const [partnerId, setPartnerId] = useState(0);
  const [PartnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [partnerRoleName, setPartnerRoleName] = useState("");
  const [partnerDescription, setPartnerDescription] = useState("");
  const [verified, setVerified] = useState(true);
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [lastModified, setLastModified] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [menuTopic, setMenuTopic] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (partner) {
      const updatedBy = partner.updated_by;

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

      const updatedAt = user?.updated_at;
      const userName = user ? `${user.first_name}.${user.last_name.slice(0, 2)}` : "Unknown User";

      setMenuTopic("Partner Details");
      setPartnerId(partner.id || 0);
      setPartnerName(partner.partner_name || "");
      setPartnerCode(partner.partner_code || "");
      setPartnerEmail(partner.partner_email || "");
      setPartnerRoleName(partner.role.role_name || "");
      setPartnerDescription(partner.partner_description || "");
      setShow(partner.status === "A");
      setStatus(partner.status);
      setLastModified(userName || "");
      // setModifiedBy(new Intl.DateTimeFormat("th-TH", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(updatedAt)));
    }
  }, [partner]);
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

      {/* partner Details Grid */}
      <div className="space-y-6">
        {/* partner ID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">PARTNER ID</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{partnerId}</span>
          </div>
        </div>

        {/* partner Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">PARTNER NAME</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{PartnerName}</span>
          </div>
        </div>

        {/* partner Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">PARTNER EMAIL</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900 font-mono text-sm">{partnerEmail}</span>
          </div>
        </div>

        {/* partner Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">PARTNER CODE</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900 font-mono text-sm">{partnerCode}</span>
          </div>
        </div>
        {/* partner Role */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">ROLE</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900 font-mono text-sm">{partnerRoleName}</span>
          </div>
        </div>
        {/* partner Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">PARTNER DESCRIPTION</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900 font-mono text-sm">{partnerDescription}</span>
          </div>
        </div>
        {/* partner Verified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">VERIFIED STATUS</Label>
          <div className="md:col-span-2">
            <Badge color={verified ? "default" : "destructive"} variant="soft" className="uppercase">
              {verified ? "VERIFIED" : "NOT VERIFIED"}
              {verified ? <Icon icon="stash:badge-verified-solid" width="24" height="24" className="ml-1" /> : <Icon icon="lucide:badge-minus" width="24" height="24" className="ml-1"/>}
            </Badge>
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
        <Button type="button" color="secondary" variant="outline" onClick={() => router.push("/partner-list")}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default PartnerView;
