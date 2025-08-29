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

const ChatNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = () => {
    console.log("Sign in clicked");
  };

  const deleteAccount = () => {
    console.log("Delete account clicked");
  };

  const signOut = () => {
    console.log("Sign out clicked");
  };

  const onOpenDashboard = () => {
    console.log("Dashboard clicked");
  };

  const isAuthenticated = true;

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
                  Maxwell
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onOpenDashboard}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={deleteAccount}
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
          <DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenDashboard}
              className="hover:bg-muted"
            >
              <Settings className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-muted">
                <User className="mr-2 h-4 w-4" />
                Maxwell
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 ">
              <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={deleteAccount}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
