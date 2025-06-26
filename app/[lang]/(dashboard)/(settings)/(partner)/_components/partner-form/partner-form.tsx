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
import { usePartnerStore } from "@/store/partner/usePartnerStore";
import { Icon } from "@iconify/react";
import { InputGroup, InputGroupButton, InputGroupText } from "@/components/ui/input-group";



const PartnerForm = ({ mode, partnerId }: { mode: "create" | "edit"; partnerId?: number }) => {
  const { roles, role, roleScope, setMode, fetchRolesScope, fetchRoles, fetchScope } = useRoleStore();
  const { partner, createPartner, updatePartner } = usePartnerStore();
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPassword, setPartnerPassword] = useState("");
  const [partnerDescription, setPartnerDescription] = useState("");
  const [roleName, setRoleName] = useState("");
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("A");
  const [menuTopic, setMenuTopic] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [roleVal, setRoleVal] = useState(partner?.role?.role_id);
  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
    if (partnerId) {
      setPartnerName(partner?.partner_name || "");
      setPartnerEmail(partner?.partner_email || "");
      setPartnerPassword(partner?.partner_password || "");
      setRoleName(partner?.role.role_name || "");
      setPartnerDescription(partner?.partner_description || "");
      setShow(partner?.status === "A");
      setStatus(partner?.status || "");
      fetchRolesScope(partner?.role.scope_id);
      setRoleVal(partner?.role.role_id);
    }
  }, [partner, mode]);

  useEffect(() => {
    if (show) {
      setStatus("A");
    } else {
      setStatus("I");
    }
  }, [show]);

  // Validation functions
  const isPasswordValid = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return regex.test(password);
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Partner name validation
    if (!partnerName.trim()) {
      errors.partnerName = "Partner name is required";
    } else if (partnerName.trim().length < 2) {
      errors.partnerName = "Partner name must be at least 2 characters long";
    }

    // Email validation
    if (!partnerEmail.trim()) {
      errors.partnerEmail = "Partner email is required";
    } else if (!isEmailValid(partnerEmail)) {
      errors.partnerEmail = "Please enter a valid email address";
    }

    // Password validation
    if (!partnerPassword.trim()) {
      errors.partnerPassword = "Password is required";
    } else if (!isPasswordValid(partnerPassword)) {
      errors.partnerPassword = "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    // Role validation
    if (!roleVal || roleVal === 0) {
      errors.role = "Role is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Real-time validation handlers
  const handlePartnerNameChange = (value: string) => {
    setPartnerName(value);
    if (validationErrors.partnerName) {
      const newErrors = { ...validationErrors };
      if (value.trim() && value.trim().length >= 2) {
        delete newErrors.partnerName;
      }
      setValidationErrors(newErrors);
    }
  };

  const handleEmailChange = (value: string) => {
    setPartnerEmail(value);
    if (validationErrors.partnerEmail) {
      const newErrors = { ...validationErrors };
      if (value.trim() && isEmailValid(value)) {
        delete newErrors.partnerEmail;
      }
      setValidationErrors(newErrors);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPartnerPassword(value);
    if (validationErrors.partnerPassword) {
      const newErrors = { ...validationErrors };
      if (value.trim() && isPasswordValid(value)) {
        delete newErrors.partnerPassword;
      }
      setValidationErrors(newErrors);
    }
  };

  const handleRoleChange = (value: number) => {
    setRoleVal(value);
    if (validationErrors.role) {
      const newErrors = { ...validationErrors };
      if (value && value !== 0) {
        delete newErrors.role;
      }
      setValidationErrors(newErrors);
    }
  };

  let partnerRole = partnerId ? roleScope?.roles : roles;

  const roleSelect = [
    {
      value: 0,
      label: "--- Select Role ---",
    },
    ...(partnerRole?.map(role => ({
      value: role.id,
      label: role.role_name,
    })) ?? []),
  ];
  const currentStatusValue = roleSelect.find(r => r.value === Number(roleVal))?.value || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setOpenModal(true);
  };

  const handleConfirm = async () => {
    const partnerData = {
      partner_name: partnerName,
      partner_email: partnerEmail,
      partner_password: partnerPassword,
      roleId: Number(roleVal),
      partner_description: partnerDescription,
      status: status,
    };

    try {
      if (partnerId) {
        await updatePartner(partnerId, partnerData, {
          search: "",
          status: "",
          page: 1,
          limit: 5,
          sort: "created_at",
          order: "DESC",
        });
      } else {
        await createPartner(partnerData, {
          search: "",
          status: "",
          page: 1,
          limit: 5,
          sort: "created_at",
          order: "DESC",
        });
      }
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving partner:", error);
      alert("Failed to save partner. Please try again.");
    }
  };

  let dialogConfig = {};
  if (mode && mode === "create") {
    dialogConfig = {
      title: "Confirm Partner Creation?",
      icon: "stash:question",
      class: "primary",
      color: "#2563EB",
      body: "Do you want to continue with this action?",
      sub: "Please confirm the creation of the new partner. You can edit or delete this partner later.",
      confirmButton: "Confirm",
      cancelButton: "Cancel",
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
  }

  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z\d]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const passwordStrength = getPasswordStrength(partnerPassword);

  return (
    <form onSubmit={handleSubmit}>
      {openModal && (
          <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={dialogConfig} />
      )}
      
      <div className="pl-2 pb-1 grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center text-default-900">
        <p>{menuTopic}</p>
      </div>

      {/* Partner Name */}
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="partnerName">
          PARTNER NAME <span className="text-warning">*</span>
        </Label>
        <Input
          type="text"
          value={partnerName}
          onChange={e => handlePartnerNameChange(e.target.value)}
          placeholder="Please enter partner name"
          id="partnerName"
          className={validationErrors.partnerName ? "border-red-500" : ""}
          required
        />
        {validationErrors.partnerName && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.partnerName}</p>
        )}
      </div>

      {/* Partner Email */}
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="partnerEmail">
          PARTNER EMAIL <span className="text-warning">*</span>
        </Label>
        <InputGroup>
          <InputGroupText>
            <Icon icon="heroicons:at-symbol" />
          </InputGroupText>
          <Input
            type="email"
            value={partnerEmail}
            onChange={e => handleEmailChange(e.target.value)}
            placeholder="Please enter partner email"
            id="partnerEmail"
            className={validationErrors.partnerEmail ? "border-red-500" : ""}
            required
          />
        </InputGroup>
        {validationErrors.partnerEmail && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.partnerEmail}</p>
        )}
      </div>

      {/* Partner Password */}
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="partnerPassword">
          PARTNER PASSWORD <span className="text-warning">*</span>
        </Label>
        <div className="relative">
        <Input
            type={showPassword ? "text" : "password"}
          value={partnerPassword}
          onChange={e => handlePasswordChange(e.target.value)}
          onFocus={() => setShowPasswordRequirements(true)}
          onBlur={() => setShowPasswordRequirements(false)}
          placeholder="Please enter partner password"
          id="partnerPassword"
            className={`pr-10 ${validationErrors.partnerPassword ? "border-red-500" : ""}`}
          required
        />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
          >
            <Icon 
              icon={showPassword ? "heroicons:eye-slash" : "heroicons:eye"} 
              className="w-5 h-5"
            />
          </button>
        </div>
        {validationErrors.partnerPassword && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.partnerPassword}</p>
        )}
        
        {/* Password Strength Indicator */}
        {(showPasswordRequirements) && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium mb-2">Password Requirements:</p>
            <div className="space-y-1">
              <div className={`flex items-center text-xs ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-500'}`}>
                <Icon icon={passwordStrength.checks.length ? "heroicons:check-circle" : "heroicons:x-circle"} className="w-4 h-4 mr-1" />
                At least 8 characters
              </div>
              <div className={`flex items-center text-xs ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                <Icon icon={passwordStrength.checks.uppercase ? "heroicons:check-circle" : "heroicons:x-circle"} className="w-4 h-4 mr-1" />
                One uppercase letter
              </div>
              <div className={`flex items-center text-xs ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                <Icon icon={passwordStrength.checks.lowercase ? "heroicons:check-circle" : "heroicons:x-circle"} className="w-4 h-4 mr-1" />
                One lowercase letter
              </div>
              <div className={`flex items-center text-xs ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-500'}`}>
                <Icon icon={passwordStrength.checks.number ? "heroicons:check-circle" : "heroicons:x-circle"} className="w-4 h-4 mr-1" />
                One number
              </div>
              <div className={`flex items-center text-xs ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-500'}`}>
                <Icon icon={passwordStrength.checks.special ? "heroicons:check-circle" : "heroicons:x-circle"} className="w-4 h-4 mr-1" />
                One special character
              </div>
            </div>
            <div className="mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i <= passwordStrength.score
                        ? passwordStrength.score <= 2
                          ? 'bg-red-500'
                          : passwordStrength.score <= 4
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs mt-1 text-gray-600">
                Password strength: {
                  passwordStrength.score <= 2 ? 'Weak' :
                  passwordStrength.score <= 4 ? 'Medium' : 'Strong'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Role Selection */}
      <div className="p-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="roleSelect">
          ROLE <span className="text-warning">*</span>
        </Label>
        <Select
          value={currentStatusValue}
          onValueChange={(newValue: number) => handleRoleChange(newValue)}
        >
          <SelectTrigger className={validationErrors.role ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roleSelect.map(r => (
              <SelectItem key={r.value} value={r.value} disabled={r.value === 0}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationErrors.role && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>
        )}
      </div>

      {/* Partner Description */}
      <div className="pt-5 pl-20 pr-20 mb-5">
        <Label className="mb-3" htmlFor="partnerDescription">
          PARTNER DESCRIPTION
        </Label>
        <Textarea
          value={partnerDescription}
          onChange={e => setPartnerDescription(e.target.value)}
          placeholder="Please enter partner description"
          rows={3}
          id="partnerDescription"
        />
      </div>

      {/* Status (only for edit mode) */}
      {mode === "edit" && (
        <>
          <div className="pt-1 pl-20 pr-20">
            <Label className="mb-3" htmlFor="statusSwitch">
              STATUS ACTIVE
            </Label>
          </div>
          <div className="p-1 pl-20 pr-20 flex items-center gap-5">
            <Switch id="statusSwitch" checked={show} onCheckedChange={() => setShow(!show)} color="success" />
            <Badge color={show ? "success" : "warning"} variant="soft">
              {show ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </>
      )}

      {/* Form Actions */}
      <div className="p-5 pl-20 pr-20 gap-4 flex items-center justify-start">
        <Button type="submit" disabled={Object.keys(validationErrors).length > 0}>
          Submit
        </Button>
        <Button
          type="button"
          color="destructive"
          variant="outline"
          onClick={() => {
            router.push("/partner-list");
            setMode("create");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PartnerForm;