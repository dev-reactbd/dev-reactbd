"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, Home } from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const tools = [
    { name: "JSON Validator", href: "/json-validator" },
    { name: "JSON Minifier", href: "/json-minifier" },
    { name: "JSON to CSV", href: "/json-to-csv" },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold hover:text-primary transition-colors"
            >
              JSON Tools
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant={isActive("/") ? "default" : "ghost"}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/json-generator">
              <Button
                variant={isActive("/json-generator") ? "default" : "ghost"}
              >
                JSON Generator
              </Button>
            </Link>
            <Link href="/json-formatter">
              <Button
                variant={isActive("/json-formatter") ? "default" : "ghost"}
              >
                JSON Formatter
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Tools <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {tools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>{tool.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-start"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/json-generator">
              <Button
                variant={isActive("/json-generator") ? "default" : "ghost"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-start"
              >
                JSON Generator
              </Button>
            </Link>
            <Link href="/json-formatter">
              <Button
                variant={isActive("/json-formatter") ? "default" : "ghost"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-start"
              >
                JSON Formatter
              </Button>
            </Link>
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Button
                  variant={isActive(tool.href) ? "default" : "ghost"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full justify-start"
                >
                  {tool.name}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
