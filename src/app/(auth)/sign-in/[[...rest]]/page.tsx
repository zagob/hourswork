"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col gap-2 items-center justify-center">
      <SignIn
        signUpUrl="/sign-up"
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
            logoPlacement: "none",
          },
          variables: {},
          elements: {
            headerTitle: "asd",
          },
        }}
      />
    </div>
  );
}
