"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import { routes } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";

export function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-95" aria-label="Account menu">
        <UserAvatar email={user.email} className="size-10 text-xs" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Signed in as
          <span className="block truncate text-sm font-semibold text-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.dashboard}>
            <LayoutDashboard /> My listings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void logout()}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
