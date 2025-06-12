"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./Logo";
import { navData } from "@/constants/data";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={"/"}>
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline">
                {navData?.map((item) => (
                  <Link
                    key={item?.title}
                    href={item?.href}
                    className={` hover:text-reactBlack px-3 py-2 text-sm font-medium transition-colors hoverEffect ${
                      pathName === item?.href
                        ? "text-reactBlack underline underline-offset-2"
                        : "text-reactBlack/70"
                    }`}
                  >
                    {item?.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#737373]"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation with Animation */}
      <div
        className={`md:hidden bg-white border-t border-slate-200 absolute w-full z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          top: "64px", // Matches the navbar height (h-16 = 64px)
          transform: isMenuOpen ? "translateY(0)" : "translateY(-100%)",
          transition:
            "transform 300ms ease-in-out, max-height 300ms ease-in-out, opacity 300ms ease-in-out",
        }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navData?.map((item) => (
            <Link
              key={item?.title}
              href={item?.href}
              className="text-reactBlack/70 hover:text-reactBlack block px-3 py-2 text-sm font-medium transition-colors hoverEffect"
              onClick={() => setIsMenuOpen(false)}
            >
              {item?.title}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
