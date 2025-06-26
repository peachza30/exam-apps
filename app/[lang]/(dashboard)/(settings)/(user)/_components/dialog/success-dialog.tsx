"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogConfig: {
    icon?: string; 
    class?: "primary" | "default" | "destructive" | "success" | "info" | "warning" | "secondary" | "dark";
    color?: string;
    size?: "sm" | "md" | "lg" | "xl";
    body?: string;
  };
}

const SuccessDialog = ({ open, onOpenChange, dialogConfig }: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="bg-white">
        <div className="justify-center first-letter:text-center flex flex-col items-center">
          <p className="p-5 text-xl" style={{ color: dialogConfig.color }}>
            <div className="justify-center first-letter:text-center flex flex-col items-center mb-5">{dialogConfig.icon && <Icon icon={dialogConfig.icon} width="125" height="125" style={{ color: dialogConfig.color }} />}</div>
            {dialogConfig.body}
          </p>
        </div>
        <div className="justify-center first-letter:text-center flex flex-col items-center"></div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
