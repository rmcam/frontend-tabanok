import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

// Output: <title>About | Acme</title>
export default function HomePage() {
  return (
    <main className="flex h-full flex-col items-center justify-center ">
      <div className="space-y-6">
        <h1 className="text-6xl font-semibold drop-shadow-sm">Auth</h1>
        <p>A simple authentication service</p>
        <LoginButton
          mode="modal"
          asChild
        >
          <Button
            variant="secondary"
            size="lg"
          >
            Sign in
          </Button>
        </LoginButton>
      </div>
    </main>
  );
}
