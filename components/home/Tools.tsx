import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ChevronRight, Code, ImageIcon, Mail, Zap } from "lucide-react";

const Tools = () => {
  const tools = [
    {
      name: "Image Converter",
      description:
        "Convert images between formats like JPG, PNG, WebP, and more with ease.",
      icon: ImageIcon,
      link: "/image-converter",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
    },
    {
      name: "Image Resizer",
      description:
        "Resize images to any dimension while preserving quality and aspect ratio.",
      icon: Zap,
      link: "/image-resizer",
      color: "bg-gradient-to-br from-green-500 to-green-700",
    },
    {
      name: "Email Faker",
      description:
        "Generate realistic fake email addresses for testing and development.",
      icon: Mail,
      link: "/email-faker",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    },
    {
      name: "Fake JSON Generator",
      description:
        "Create customizable mock JSON data for API testing and development.",
      icon: Code,
      link: "/fake-json-generator",
      color: "bg-gradient-to-br from-gray-700 to-gray-900",
    },
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={tool.name}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-6 relative z-10">
                  <div
                    className={`w-14 h-14 ${tool.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md`}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                  <Link href={tool.link}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg py-2 transition-all duration-300 font-medium">
                      Try Now
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Tools;
