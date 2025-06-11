import React from "react";
import ToolsCard from "../pages/tools/ToolsCard";

const Tools = () => {
  return (
    <section id="tools-section" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#001d3d] mb-4">
            Powerful Tools at Your Fingertips
          </h2>
          <p className="text-lg text-[#737373] max-w-2xl mx-auto">
            Choose from our collection of carefully crafted tools, each designed
            to solve specific digital challenges efficiently.
          </p>
        </div>

        <ToolsCard />
      </div>
    </section>
  );
};

export default Tools;
