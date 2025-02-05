"use client";

import { useRouter } from "next/navigation";
import { Slot } from "@radix-ui/react-slot";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/sign-in");
  };

  const Component = asChild ? Slot : "button";

  return (
    <Component
      onClick={handleClick}
      className="cursor-pointer bg-transparent border-none p-0"
    >
      {children}
    </Component>
    
  );
};

