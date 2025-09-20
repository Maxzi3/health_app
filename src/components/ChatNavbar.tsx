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
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthUser } from "@/store/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LogoSpinnerOverlay from "./LogoSpinnerOverlay";

const ChatNavbar = () => {
  const { user, isAuthenticated } = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // modal states
  const [openLogout, setOpenLogout] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleSignIn = () => {
    router.push("/auth/login");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // setLoading(false);
      setOpenLogout(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      const data = await res.json();
      console.log("Delete response:", data);

      // After successful delete → sign out
      await signOut({ callbackUrl: "/auth/signup", redirect: true });
    } catch (error) {
      console.error("Delete account error:", error);
    } finally {
      setOpenDelete(false);
      // setLoading(false);
    }
  };

  const handleOpenDashboard = () => {
    if (user) {
      const dashboardPath =
        user.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient";
      router.push(dashboardPath);
    }
  };

  // hide dashboard button if already inside dashboard
  const showDashboardButton = !pathname.startsWith("/dashboard");

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-2 border-b bg-background shadow-sm">
        {/* Logo on the left */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {showDashboardButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenDashboard}
                  className="hover:bg-accent"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-accent flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenLogout(true);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenDelete(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />
            </>
          ) : (
            <>
              <Button variant="default" size="sm" onClick={handleSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <ThemeToggle />
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
              {isAuthenticated ? (
                <>
                  <div className="flex p-2 items-center flex-row">
                    <User className="mr-2 h-4 w-4" />
                    {user?.name} ({user?.role.toLowerCase()})
                  </div>
                  <DropdownMenuSeparator />

                  {showDashboardButton && (
                    <DropdownMenuItem onClick={handleOpenDashboard}>
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenLogout(true);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenDelete(true);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ThemeToggle />
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleSignIn}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ThemeToggle />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Sign Out Modal */}
      <AlertDialog open={openLogout} onOpenChange={setOpenLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleLogout}>
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Modal */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. Do you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={loading}
              onClick={handleDeleteAccount}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/*  Spinner overlay */}
      <LogoSpinnerOverlay active={loading} />
    </>
  );
};

export default ChatNavbar;
