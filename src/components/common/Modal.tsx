import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';



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
      <DialogContent> {/* Usar estilos por defecto de Shadcn UI */}
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
