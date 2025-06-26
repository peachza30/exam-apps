"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const LabelInput = ({ name }: { name: string }) => {
  console.log("name", name);
  const [description, setDescription] = useState("");
  return (
    <>
      <Label className="mb-3" htmlFor="inputId">
        SERVICE DESCRIPTION
      </Label>
      <Textarea defaultValue={name} onChange={e => setDescription(e.target.value)} placeholder="Please enter service description" rows="3" />
    </>
  );
};

export default LabelInput;
