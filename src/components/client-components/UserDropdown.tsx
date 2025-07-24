"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { VscAccount } from "react-icons/vsc";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";

type UserDropdownProps = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
};

export default function UserDropdown({ user }: UserDropdownProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full border cursor-pointer hover:bg-gray-100 p-1">
          {user.image ? (
            <Image
              height={24}
              width={24}
              src={user.image}
              alt="User Avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <VscAccount className="w-5 h-5" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2 text-xs text-gray-500">
          {user.name || user.email}
        </div>

        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}`} className="w-full">
            <User className="w-4 h-4 mr-2" /> Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
