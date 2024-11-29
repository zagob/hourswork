"use client";

import {  SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col gap-2 items-center justify-center">
      <SignUp
        signInUrl="/sign-in"
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
            logoPlacement: "none",
          },
          variables: {
            // colorBackground: '#ccc'
          },
          elements: {
            headerTitle: "asd",
          },
        }}
      />
    </div>
  );
}
