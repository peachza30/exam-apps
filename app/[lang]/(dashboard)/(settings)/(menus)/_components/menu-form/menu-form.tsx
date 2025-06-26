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
import { useMenuStore } from "@/store/menu/useMenuStore";
import { Icon } from "@iconify/react";
import { InputGroup, InputGroupButton, InputGroupText } from "@/components/ui/input-group";
import IconifySelector from "../iconify-selector/iconify-selector";
import { SelectViewport } from "@radix-ui/react-select";
import { SearchableSelect } from "../searchable-input/searchable-input";
const MenuForm = ({ mode }: { mode: "create" | "edit" }) => {
  const { menus, menu, iconName, setIconName, getMenus, createMenu, updateMenu } = useMenuStore();
  const [menuId, setMenuId] = useState(0);
  const [menuName, setMenuName] = useState("");
  const [menuPath, setMenuPath] = useState("");
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("A");
  const [menuTopic, setMenuTopic] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [menuVal, setMenuVal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    getMenus({});
    if (mode === "create") {
      setMenuTopic("");
      setMenuName("");
      setMenuPath("");
      setIconName("");
      setMenuVal(0);
      setShow(true);
      setStatus("A");
    } else {
      setMenuTopic("Edit service");
      if (menu) {
        setMenuId(menu.id || 0);
        setMenuName(menu.menu_name || "");
        setMenuPath(menu.path || "");
        setIconName(menu.icon || "");
        setMenuVal(menu.parent_id || 0);
        setShow(menu.status === "A");
        setStatus(menu.status || "A");
      }
    }
  }, [menu, mode]); // Added mode to dependency array

  useEffect(() => {
    if (show) {
      setStatus("A");
    } else {
      setStatus("I");
    }
  }, [show]);

  const menuSelect: { value: number; label: string }[] = [
    { value: 0, label: "ROOT LEVEL" },
    ...(menus.map(menu => ({
      value: menu.id ?? 0,
      label: menu.menu_name,
    })) ?? []),
  ];

  const currentStatusValue = menuSelect.find(r => r.value === Number(menuVal))?.value;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!serviceName.trim()) {
    //   alert("Service name is required");
    //   return;
    // }

    setOpenModal(true); // Open confirmation modal
  };

  // Called after user confirms in the modal
  const handleConfirm = async () => {
    const menuData: MenuItem = {
      menu_name: menuName,
      path: menuPath,
      parent_id: Number(menuVal),
      icon: iconName,
      status: status,
    };
    console.log("menuData", menuData);

    try {
      if (mode === "create") {
        await createMenu(menuData);
      } else if (menu?.id) {
        await updateMenu(menu.id, menuData);
      }
      setOpenModal(false);
      // router.push("/menus-list");
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Failed to save menu. Please try again.");
    }
  };
  let dialogConfig = {};
  if (mode && mode === "create") {
    dialogConfig = {
      title: "Confirm Menu Creation?",
      icon: "stash:question",
      class: "primary",
      color: "#2563EB",
      body: "Do you want to continue with this action?",
      sub: "Please confirm the creation of the new menu, You can edit or delete this menu later.",
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

  return (
    <form onSubmit={handleSubmit}>
      {openModal && (
        <>
          <ConfirmDialog open={openModal} onOpenChange={setOpenModal} onConfirm={handleConfirm} dialogConfig={dialogConfig} />
        </>
      )}
      <div className="pl-2 pb-1 grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center text-default-900">
        <p>{menuTopic}</p>
      </div>
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="serviceName">
          MENU NAME <span className="text-warning">*</span>
        </Label>
        <Input
          type="text"
          value={menuName} // Changed from defaultValue to value
          onChange={e => setMenuName(e.target.value)}
          placeholder="Please enter service name"
          id="serviceName"
          required
        />
      </div>
      <div className="pt-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="serviceName">
          PART MENU <span className="text-warning">*</span>
        </Label>
        <InputGroup>
          <InputGroupText>
            <Icon icon="solar:link-minimalistic-bold-duotone" />
          </InputGroupText>
          <Input
            type="text"
            value={menuPath} // Changed from defaultValue to value
            onChange={e => setMenuPath(e.target.value)}
            placeholder="Please enter service name"
            id="serviceName"
            required
          />
        </InputGroup>
      </div>
      <div className="p-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="inputId">
          PARENT MENU <span className="text-warning">*</span>
        </Label>
        <Select
          value={currentStatusValue !== undefined ? currentStatusValue.toString() : "0"}
          onValueChange={(newValue: string) => {
            setMenuVal(Number(newValue));
          }}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Please select parent menu" />
          </SelectTrigger>

          <SelectContent className="max-h-60 overflow-y-auto">
            {" "}
            {/* <-- Add max-height here if needed */}
            {menuSelect.map(r => (
              <SelectItem key={r.value} value={r.value.toString()}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-5 pl-20 pr-20">
        <Label className="mb-3" htmlFor="inputId">
          ICON<span className="text-warning">*</span>
        </Label>

        <IconifySelector />
      </div>
      <div className="pt-1 pl-20 pr-20">
        <Label className="mb-3" htmlFor="inputId">
          STATUS ACTIVE
        </Label>
      </div>
      <div className="p-1 pl-20 pr-20 flex items-center gap-5">
        {mode === "edit" && (
          <>
            <Switch id="airplane-mode" checked={show} onCheckedChange={() => setShow(!show)} color="success" />
          </>
        )}
        <Badge color={show ? "success" : "warning"} variant="soft">
          {show ? "ACTIVE" : "INACTIVE"}
        </Badge>
      </div>

      <div className="p-5 pl-20 pr-20 gap-4 flex items-center justify-start">
        <Button type="submit">Submit</Button>
        <Button type="button" color="destructive" variant="outline" onClick={() => router.push("/menus-list")}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MenuForm;
