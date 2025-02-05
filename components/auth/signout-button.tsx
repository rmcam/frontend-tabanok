"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  const handleClick = async () => {
    await signOut({
      callbackUrl: "/sign-in",
    });
  };
  return <Button onClick={() => signOut()}>Sign Out</Button>;
};


