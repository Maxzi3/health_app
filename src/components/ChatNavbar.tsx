"use client";

import { useState } from "react";
import Logo from "./Logo";
import { Menu, X, Settings, LogIn, LogOut, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthUser } from "@/store/auth";

const ChatNavbar = () => {
  const { user, isAuthenticated } = useAuthUser(); // Access user and logout from Zustand
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  //  const handleLogout = async () => {
  //    setLoading(true);
  //    try {
  //      await signOut({
  //        callbackUrl: "/auth/login",
  //        redirect: true,
  //      });
  //    } catch (error) {
  //      console.error("Logout error:", error);
  //    } finally {
  //      setLoading(false);
  //    }
  //  };

  const handleOpenDashboard = () => {
    if (user) {
      const dashboardPath =
        user.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient";
      router.push(dashboardPath);
    }
  };

// const handleDeleteAccount = async () => {
//   setLoading(true);
//   setError("");

//   try {
//     const response = await fetch("/api/auth/delete", {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Failed to delete account");
//     }

//     // Sign out the user after successful deletion
//     await signOut({
//       callbackUrl: "/auth/login?message=account-deleted",
//       redirect: true,
//     });
//   } catch (err: any) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

 

 

  return (
    <div className="flex items-center justify-between p-2 border-b bg-card">
      {/* Logo */}
      <Logo />

      {/* Mobile Menu */}
      <div className="md:hidden">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-popover/95 backdrop-blur-sm"
          >
            <DropdownMenuItem className="cursor-pointer flex justify-end">
              <ThemeToggle />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {isAuthenticated ? (
              <>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  {user?.name} ({user?.role.toLowerCase()})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleOpenDashboard}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={deleteAccount}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                onClick={handleSignIn}
                className="cursor-pointer"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenDashboard}
              className="hover:bg-muted"
            >
              <Settings className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-muted">
                  <User className="mr-2 h-4 w-4" />
                  {user?.name} ({user?.role.toLowerCase()})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  // onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={deleteAccount}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button variant="default" size="sm" onClick={handleSignIn}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ChatNavbar;
