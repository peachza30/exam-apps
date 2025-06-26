"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/users/useUserStore";
import { Label } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/badge";
import { Switch } from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/ui/switch";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/[lang]/(dashboard)/(settings)/(user)/_components/dialog/confirm-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoleStore } from "@/store/role/useRoleStore";
import SuccessDialog from "../dialog/success-dialog";

const UserForm = ({ mode, userId }: { mode: "create" | "edit"; userId: number }) => {
  const { userById, updateUser, fetchUserById } = useUserStore();
  const { roles, role, roleScope, fetchRolesScope, fetchRoles } = useRoleStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("A");
  const [menuTopic, setMenuTopic] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [roleVal, setRoleVal] = useState<number | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    fetchUserById(userId);
  }, []);

  useEffect(() => {
    fetchRoles({
      search: "",
      status: "",
      page: 1,
      limit: 10,
      sort: "created_at",
      order: "DESC",
    });
    setMenuTopic("");

    // Only populate form fields in edit mode when user data is available
    if (userById && userId) {
      setFirstName(userById.first_name || "");
      setLastName(userById.last_name || "");
      setEmail(userById.email || "");
      setRoleName(userById.email || "");
      setStatus(userById.status || "A");
      setShow(userById.status === "A");

      if (userById.role?.scope_id) {
        fetchRolesScope(userById.role.scope_id);
      }
      if (userById.role?.role_id) {
        setRoleVal(userById.role.role_id);
      }
    }
  }, [userById, mode, fetchRoles, fetchRolesScope]);

  useEffect(() => {
    setStatus(show ? "A" : "I");
  }, [show]);

  const roleSelect: { value: number; label: string }[] = [
    { value: 0, label: "Select a role" },
    ...(roleScope?.roles.map(role => ({
      value: role.id,
      label: role.role_name,
    })) ?? []),
  ];

  const currentStatusValue = roleVal || "";
  console.log("userById", userById);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    // if (mode === "create") {
    //   if (!firstName.trim()) {
    //     alert("First name is required");
    //     return;
    //   }
    //   if (!lastName.trim()) {
    //     alert("Last name is required");
    //     return;
    //   }
    //   if (!email.trim()) {
    //     alert("Email is required");
    //     return;
    //   }
    // }

    if (!roleVal || roleVal === 0) {
      alert("Role is required");
      return;
    }

    setOpenModal(true); // Open confirmation modal
  };

  const handleSuccessModalChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.push("/user-management");
    }
    setOpenSuccessModal(isOpen);
  };

  // Called after user confirms in the modal
  const handleConfirm = async () => {
    const userData = {
      role_id: Number(roleVal),
      status: status,
      // ...(mode === "create" && {
      //   first_name: firstName,
      //   last_name: lastName,
      //   email: email,
      // }),
    };

    try {
      if (mode === "edit" && userId) {
        await updateUser(userId, userData, {
          search: "",
          status: "",
          page: 1,
          limit: 5,
          sort: "created_at",
          order: "DESC",
        });
      }
      // else if (mode === "create") {
      //   await createUser(userData);
      // }

      setOpenModal(false);
      setOpenSuccessModal(true);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user. Please try again.");
    }
  };

  let dialogConfig = {};
  let successDialogConfig = {};

  if (mode === "create") {
    dialogConfig = {
      title: "Confirm User Creation?",
      icon: "stash:question",
      class: "primary",
      color: "#2563EB",
      body: "Do you want to continue with this action?",
      sub: "Please confirm the creation of the new user. You can edit or delete this user later.",
      confirmButton: "Confirm",
      cancelButton: "Cancel",
    };
    successDialogConfig = {
      icon: "solar:verified-check-outline",
      body: "User created successfully.",
      color: "#22C55E",
    };
  } else if (mode === "edit") {
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
        <p>{menuTopic}</p>
      </div>

      {mode === "edit" && (
        <div className="pt-5 pl-20 pr-20">
          <Label className="mb-3" htmlFor="userId">
            USER ID
          </Label>
          <Input type="text" value={userId} placeholder="User ID" id="userId" disabled />
        </div>
      )}

      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="firstName">
          FIRST NAME <span className="text-warning">*</span>
        </Label>
        <Input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Please enter first name" id="firstName" required disabled={mode === "edit"} />
      </div>

      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="lastName">
          LAST NAME <span className="text-warning">*</span>
        </Label>
        <Input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Please enter last name" id="lastName" required disabled={mode === "edit"} />
      </div>

      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="email">
          EMAIL <span className="text-warning">*</span>
        </Label>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Please enter email" id="email" required disabled={mode === "edit"} />
      </div>

      <div className="p-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="role">
          ROLE <span className="text-warning">*</span>
        </Label>
        <Select
          value={currentStatusValue.toString()}
          onValueChange={(newValue: string) => {
            setRoleVal(Number(newValue));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roleSelect.map(r => (
              <SelectItem key={r.value} value={r.value.toString()} disabled={r.value === 0}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> 
      </div>

      {mode === "edit" && (
        <>
          <div className="pt-1 pl-20 pr-20">
            <Label className="mb-3" htmlFor="status">
              STATUS ACTIVE
            </Label>
          </div>
          <div className="p-1 pl-20 pr-20 flex items-center gap-5">
            <Switch id="status" checked={show} onCheckedChange={setShow} color="success" />
            <Badge color={show ? "success" : "warning"} variant="soft">
              {show ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </>
      )}

      <div className="p-5 pl-20 pr-20 gap-4 flex items-center justify-start">
        <Button type="submit">{mode === "create" ? "Create User" : "Save Changes"}</Button>
        <Button type="button" color="destructive" variant="outline" onClick={() => router.push("/user-management")}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
