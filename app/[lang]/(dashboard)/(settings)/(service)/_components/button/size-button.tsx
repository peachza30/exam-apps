import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useServiceStore } from "@/store/service/useServiceStore";

const SizeButton = () => {
  const { setMode } = useServiceStore();
  
  const router = useRouter();

  return (
    <Button
      size="xl"
      onClick={() => {
        setMode("create");
        router.push(`/manage-services`);
      }}
    >
      <div className="flex items-center gap-2">
        <Icon icon="quill:add" width="20" height="20" />
        Add New
      </div>
    </Button>
  );
};

export default SizeButton;

