import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const OutlineButton = () => {
  return (
    <>
      <div className="space-x-4">
        <Button variant="outline" className="w-32">
          <Icon icon="mingcute:search-line" width="24" height="24" />
          Search
        </Button>{" "}
        {/* 128px */}
        <Button variant="outline" className="w-32">
          <Icon icon="solar:refresh-line-duotone" width="24" height="24" />
          Clear
        </Button>{" "}
      </div>
    </>
  );
};

export default OutlineButton;
