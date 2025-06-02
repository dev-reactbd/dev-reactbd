import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#001d3d] mb-6">
            Essential Tools for
            <span className="text-reactYellow"> Digital Tasks</span>
          </h1>
          <p className="text-xl sm:text-2xl text-reactbdLightText mb-8 max-w-3xl mx-auto">
            Explore our suite of free, user-friendly tools designed to simplify
            your digital workflow and boost productivity.
          </p>
          <p className="text-lg text-reactbdLightText mb-10 max-w-2xl mx-auto">
            No sign-up required. Fast, reliable, and completely free to use.
          </p>
          <Link href={"#tools-section"}>
            <Button className="bg-gradient-to-r from-[#ffc300] to-[#ffd60a] hover:from-[#ffd60a] hover:to-[#ffc300] text-[#001d3d] px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Discover Tools
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-[#ffc300]/20 to-[#ffd60a]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-r from-[#40be46]/20 to-[#001d3d]/20 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default Hero;
