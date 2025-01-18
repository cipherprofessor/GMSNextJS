import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Leaf} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick}: HeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  function UserName() {
    const { isSignedIn, user } = useUser();
    if (!isSignedIn) {
      return null;
    }
    <div className="gap-x-1 lg:flex-center hidden text-black">Hello, {user.firstName} {user.lastName}</div>;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:mr-4" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-gray-800">Gate Pass</span>
              <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">Management System</span>
            </div>
          </Link>
        </div>
        {!isMobile && (
          <></>
        )}
        <div className="flex items-center">
          {isMobile && (
            <></>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <div className="flex-center gap-x-5">
            <SignedOut>
              <Link href="/sign-in">
                <button
                  aria-label="sign-in"
                  className="bg-white/5 z-[999] relative px-3 py-1.5 shadow rounded-xl flex-center mr-6"
                  style={{ marginRight: '25px' }}
                >
                  Sign In
                </button>
              </Link>
              <Link href="/sign-up">
                <button
                  aria-label="sign-up"
                  className="bg-white/5 z-[999] relative px-3 py-1.5 shadow rounded-xl flex-center mr-6"
                  style={{ marginRight: '25px' }}
                >
                  Sign Up
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-4 text-black">
                <UserName />
              </div>
              <div className="flex items-center space-x-4">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-11 h-11',
                      userButtonPopoverCard: 'p-2 shadow-lg rounded-xl'
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}