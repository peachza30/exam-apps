import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const SizeButton = () => {
  const router = useRouter();

  return (
    <>
      <Button
        size="xl"
        onClick={() => {
          // Add your delete logic here
          router.push(`/manage-role`);
        }}
      >
        <div className="flex items-center gap-2">
          <Icon icon="quill:add" width="20" height="20" />
          Add New
        </div>
      </Button>
    </>
  );
};

export default SizeButton;
