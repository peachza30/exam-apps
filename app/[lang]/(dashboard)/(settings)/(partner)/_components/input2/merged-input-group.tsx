"use client";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupButton,
  InputGroupText,
} from "@/components/ui/input-group";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MergedInputGroup = () => {
  return (
    <>
      <InputGroup merged>
        <InputGroupText>
          {/* <Icon icon="heroicons:magnifying-glass" /> */}
        </InputGroupText>
        <Input type="text" placeholder="Search.." />
      </InputGroup>
    </>
  );
};

export default MergedInputGroup;
