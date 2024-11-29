import { currentUser } from "@clerk/nextjs/server";
import { Logout } from "./logout";

export async function MenuName() {
  const user = await currentUser();

  return (
    <div className="flex items-center gap-2">
      <span>{user?.firstName}</span>
      <Logout />
    </div>
  );
}
