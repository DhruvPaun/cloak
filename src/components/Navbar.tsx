"use client";
import { jwtPayload, logOutUser, userGetter } from "@/lib/userGetter";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
function Navbar() {
  const [user, setUser] = useState<any>();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get("/api/me");
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        router.replace("/sign-in");
      }
    };
    if (
      pathname !== "/sign-in" &&
      pathname !== "/sign-up" &&
      !pathname.startsWith("/verify") &&
      !pathname.startsWith("/u")
    ) {
      getUser();
    }
  }, [pathname]);
  const logOut = async () => {
    try {
      await logOutUser();
      setUser(null);
      toast.success("Log out successfull");
      router.replace("/sign-in");
    } catch (error) {
      console.log("Error");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#12151B]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Image container with fixed dimensions to prevent jumping */}

              {/* Text with leading-none to remove extra vertical space */}
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#5B8CFF] to-blue-400 bg-clip-text text-transparent leading-none">
                CLOAK
              </span>
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:block text-right mr-2">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-medium text-white">
                    {user.email.split("@")[0]}
                  </p>
                </div>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className={`
      relative px-5 transition-all duration-300 rounded-full text-sm font-medium
      ${
        pathname === "/dashboard"
          ? "text-white bg-blue-600/20 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
      }
    `}
                  >
                    {/* Subtle dot indicator if active */}
                    {pathname === "/dashboard" && (
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full blur-[1px]" />
                    )}
                    Dashboard
                  </Button>
                </Link>
                <form action={logOut}>
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-white/10 bg-red-500 rounded-xl"
                  >
                    Log out
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-[#5B8CFF] hover:bg-[#4A7AFF] text-white rounded-xl px-5">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
