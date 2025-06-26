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

const UserView = ({ userId }: { userId: number }) => {
  const { userById, userByUpdated, fetchUserById, fetchUserByUpdatedId } = useUserStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [lastModified, setLastModified] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [menuTopic, setMenuTopic] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUserById(userId);
  }, []);

  useEffect(() => {
    if (userById) {
      const updatedBy = userById.updated_by;
      const fetchUserData = async () => {
        if (updatedBy) {
          try {
            await fetchUserByUpdatedId(updatedBy);
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        }
      };

      fetchUserData();
      // Added dependencies
      const updatedAt = userByUpdated?.updated_at ?? "";
      const userName = userByUpdated ? `${userByUpdated.first_name}.${userByUpdated.last_name.slice(0, 2)}` : "Unknown User";

      setMenuTopic("User Details");
      setFirstName(userById.first_name || "");
      setLastName(userById.first_name || "");
      setEmail(userById.email || "");
      setShow(userById.status === "A");
      setStatus(userById.status);
      setModifiedBy(userName || "");
      setLastModified(new Intl.DateTimeFormat("th-TH", { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(updatedAt)));
    }
  }, [userById]);
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

      {/* user Details Grid */}
      <div className="space-y-6">
        {/* user ID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">USER ID</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{userId}</span>
          </div>
        </div>

        {/* user Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">FIRST NAME</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900">{firstName}</span>
          </div>
        </div>

        {/* user Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">LAST NAME</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900 font-mono text-sm">{lastName}</span>
          </div>
        </div>

        {/* user Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-4 border-b border-gray-100">
          <Label className="text-sm font-medium text-gray-600 uppercase tracking-wide">EMAIL</Label>
          <div className="md:col-span-2">
            <span className="text-gray-900 font-mono text-sm">{email}</span>
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
        {/* <Button
          type="button"
          onClick={() => {
            // Add edit functionality here
            console.log("Edit user");
          }}
        >
          Edit
        </Button> */}
        <Button type="button" color="secondary" variant="outline" onClick={() => router.push("/user-management")}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default UserView;
