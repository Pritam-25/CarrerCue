import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  LucideFileText,
  LucideGraduationCap,
  PenBox,
  SparklesIcon,
  Menu,
} from "lucide-react";
import { ModeToggle } from "./mode_toggle";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/5 backdrop-blur-lg z-50 border-b border-border shadow-md">
      <div className="container mx-auto flex justify-between items-center h-16 px-4 md:px-8">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold">
            Career<span className="text-primary">Cue</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-4">
          <SignedOut>
            <SignUpButton>
              <Button variant="secondary">Sign up</Button>
            </SignUpButton>
            <SignInButton>
              <Button variant="default">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button variant="ghost" className="md:flex">
              <LayoutDashboard className="h-6 w-6" />
              <span className="hidden md:inline">Industry Insights</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <SparklesIcon className="h-6 w-6" />
                  Growth Tools
                  <ChevronDown className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/resume" className="flex items-center gap-2">
                    <LucideFileText className="h-4 w-4" />
                    <span>Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/interview" className="flex items-center gap-2">
                    <LucideGraduationCap className="h-4 w-4" />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden flex gap-4 items-center">
          <SignedOut>
            <SignInButton>
              <Button variant="default">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-6 w-6" />
                    Industry Insights
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/resume" className="flex items-center gap-2">
                    <LucideFileText className="h-4 w-4" />
                    <span>Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/interview" className="flex items-center gap-2">
                    <LucideGraduationCap className="h-4 w-4" />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* user button */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Header;
