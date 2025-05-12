import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ModalProps {
  id?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode; // Make trigger optional
}

const Modal: React.FC<ModalProps> = ({ isOpen, onOpenChange, title, description, children, trigger }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && ( // Conditionally render DialogTrigger
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="bg-k-blanco-50 border border-k-negro-100 shadow-lg p-6 max-w-md"> {/* Estilos mejorados */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
