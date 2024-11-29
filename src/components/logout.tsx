"use client";

import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Power } from "lucide-react";

export function Logout() {
  const { sessionId } = useAuth();

  if (!sessionId) {
    return null
  }

  return (
    <SignOutButton signOutOptions={{ sessionId }}>
      <Button
        variant="outline"
        className="bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-zinc-50"
      >
        <Power />
      </Button>
    </SignOutButton>
  );
}
