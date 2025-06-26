"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  dialogConfig: {
    title?: string;
    icon?: string;
    class?: "primary" | "default" | "destructive" | "success" | "info" | "warning" | "secondary" | "dark";
    color?: string;
    size?: "sm" | "md" | "lg" | "xl";
    body?: string;
    sub?: string;
    confirmButton?: string | "Confirm";
    cancelButton?: string | "Cancel";
  };
}

const ConfirmDialog = ({ open, onOpenChange, onConfirm, dialogConfig }: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            <div className="justify-center first-letter:text-center flex flex-col items-center border-b">
              <p className="p-5" style={{ color: "#64748B", fontSize: "24px" }}>
                {dialogConfig.title}
              </p>
            </div>
            <div className="justify-center first-letter:text-center flex flex-col items-center">{dialogConfig.icon && <Icon icon={dialogConfig.icon} width="100" height="100" style={{ color: dialogConfig.color }} />}</div>
          </DialogTitle>
        </DialogHeader>
        <div className="justify-center first-letter:text-center flex flex-col items-center">
          <p className="pb-4 text-xl" style={{ color: dialogConfig.color }}>
            {dialogConfig.body}
          </p>
          <p style={{ color: "#64748B", fontSize: "14px" }}>{dialogConfig.sub}</p>
        </div>

        <div className="justify-center first-letter:text-center flex flex-col items-center">
          <DialogFooter className="mt-2 gap-2">
            <Button type="button" color={dialogConfig.class} onClick={onConfirm}>
              {dialogConfig.confirmButton}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" color="secondary">
                {dialogConfig.cancelButton}
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
