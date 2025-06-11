import Link from "next/link";
import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-[#001d3d] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link
            href={"/"}
            className="text-reactbdBlack bg-reactbdWhite/90 px-4 py-2 rounded-md hover:bg-reactbdWhite hoverEffect"
          >
            <Logo />
          </Link>

          <div className="flex flex-wrap justify-center md:justify-end space-x-6 mb-4 md:mb-0">
            <Link
              href="/privacy"
              className="text-slate-300 hover:text-[#ffc300] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-300 hover:text-[#ffc300] transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-slate-300 hover:text-[#ffc300] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-[#262626] mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} ReactBD. All rights reserved. Built
            with ❤️ for developers and creators.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
