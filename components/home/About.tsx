import { Zap } from "lucide-react";
import React from "react";

const About = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#001d3d] mb-6">
          Why Choose Our Tools?
        </h2>
        <p className="text-lg text-[#737373] mb-8 leading-relaxed">
          Our tools are free, fast, and designed to make your life easier. Built
          with modern web technologies, they work seamlessly across all devices
          and browsers. No sign-up required, no hidden fees, and no complicated
          interfaces – just simple, effective solutions for your digital needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#ffc300] rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#001d3d]" />
            </div>
            <h3 className="text-xl font-semibold text-[#001d3d] mb-2">
              Lightning Fast
            </h3>
            <p className="text-[#737373]">
              Optimized for speed and performance
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#001d3d] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#ffc300] font-bold text-xl">$0</span>
            </div>
            <h3 className="text-xl font-semibold text-[#001d3d] mb-2">
              Completely Free
            </h3>
            <p className="text-[#737373]">
              No hidden costs or premium features
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#40be46] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-sm">24/7</span>
            </div>
            <h3 className="text-xl font-semibold text-[#001d3d] mb-2">
              Always Available
            </h3>
            <p className="text-[#737373]">
              Access your tools anytime, anywhere
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
