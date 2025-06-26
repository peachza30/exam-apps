"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const LabelInputRequired = ({ name }: { name: string }) => {
  const [serviceName, setServiceName] = useState("");
  return (
    <>
      <Label className="mb-3" htmlFor="serviceName">
        SERVICE NAME <span className="text-warning">*</span>
      </Label>
      <Input type="text" defaultValue={name} onChange={e => setServiceName(e.target.value)} placeholder="Please enter service name" id="serviceName" required />
    </>
  );
};

export default LabelInputRequired;
