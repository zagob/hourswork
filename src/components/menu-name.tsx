import { currentUser } from "@clerk/nextjs/server";
import { Logout } from "./logout";
import { Avatar, AvatarImage } from "./ui/avatar";

export async function MenuName() {
  const user = await currentUser();

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "avatar"} />
      </Avatar>
      <span>{user?.fullName}</span>
      <Logout />
    </div>
  );
}
