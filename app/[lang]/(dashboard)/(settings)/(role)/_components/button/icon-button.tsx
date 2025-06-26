"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
const IconButton = () => {
  return (
    <>
      <Button size="icon">
        <Icon icon="hugeicons:delete-02" width="24" height="24" />
      </Button>
    </>
  );
};

export default IconButton;
