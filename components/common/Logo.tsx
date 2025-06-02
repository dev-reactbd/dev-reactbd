import { Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center">
      <div className="flex-shrink-0 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-[#ffc300] to-[#ffd60a] rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-[#001d3d]" />
        </div>
        <span className="ml-2 text-xl font-bold text-[#001d3d]">ReactBD</span>
      </div>
    </Link>
  );
};

export default Logo;
