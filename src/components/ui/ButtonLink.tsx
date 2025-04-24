import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

interface ButtonLinkProps extends React.HTMLAttributes<HTMLButtonElement> {
  href: string;
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ href, children, variant, size, ...props }) => {
  return (
    <Button asChild variant={variant} size={size} {...props}>
      <a href={href}>{children}</a>
    </Button>
  );
};

export default ButtonLink;
