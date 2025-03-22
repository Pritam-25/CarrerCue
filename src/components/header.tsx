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

const Header = async () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/5 backdrop-blur-lg z-50 border-b border-border shadow-md">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link href="/">
          <span className="text-2xl font-bold">
            Carrer<span className="text-primary">Cue</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignUpButton>
              <Button variant="secondary">Sign up</Button>
            </SignUpButton>
            <SignInButton>
              <Button variant="default">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            {/* dashboard button */}
            <Button variant="ghost">
              <LayoutDashboard className="h-6 w-6" />
              Industry Insights
            </Button>

            {/* growth tools dropdown */}
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
                  <Link href={"/resume"} className="flex items-center gap-2">
                    <LucideFileText className="h-4 w-4" />
                    <span>Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href={"/cover-letter"}
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/interview"} className="flex items-center gap-2">
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
      </div>
    </nav>
  );
};

export default Header;
