import { useAuth } from "@/components/auth/context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  // Try to get first_name from user_metadata, fallback to email
  const firstName =
    (user.user_metadata?.first_name as string | undefined) || "";
  const email = user.email || "";
  const displayLetter =
    firstName.trim().length > 0
      ? firstName.trim()[0].toUpperCase()
      : email.trim().length > 0
      ? email.trim()[0].toUpperCase()
      : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Open profile menu"
        >
          <span className="text-lg font-bold select-none">{displayLetter}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 mt-2">
        <div className="px-3 py-2 text-sm font-medium text-foreground">
          {firstName || email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="text-destructive focus:bg-destructive/10 cursor-pointer"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
