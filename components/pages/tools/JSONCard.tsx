"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Check,
  FileSpreadsheet,
  FileText,
  GitCompare,
  Minimize2,
  Settings,
} from "lucide-react";

const toolsData = [
  {
    title: "JSON Generator",
    description:
      "Generate realistic fake JSON data with customizable fields and data types. Perfect for testing and prototyping.",
    icon: Settings,
    href: "/json-generator/generate",
    color: "bg-blue-500",
  },
  {
    title: "JSON Formatter",
    description:
      "Pretty-print and format JSON with syntax highlighting. Upload files or paste JSON directly.",
    icon: FileText,
    href: "/json-generator/formatter",
    color: "bg-green-500",
  },
  {
    title: "JSON Validator",
    description:
      "Validate JSON syntax with detailed error messages and success confirmations.",
    icon: Check,
    href: "/json-generator/validator",
    color: "bg-emerald-500",
  },
  {
    title: "JSON Minifier",
    description:
      "Compress JSON by removing unnecessary whitespace and formatting.",
    icon: Minimize2,
    href: "/json-generator/minifier",
    color: "bg-orange-500",
  },
  {
    title: "JSON to CSV",
    description:
      "Convert JSON arrays to CSV format with download options for data analysis.",
    icon: FileSpreadsheet,
    href: "/json-generator/json-to-csv",
    color: "bg-purple-500",
  },
  {
    title: "JSON Compare",
    description:
      "Compare two JSON objects to find differences, missing keys, and similarities.",
    icon: GitCompare,
    href: "/json-generator/json-compare",
    color: "bg-red-500",
  },
];

const JSONCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {toolsData.map((tool, index) => (
        <motion.div
          key={index.toString()}
          className="relative bg-white dark:bg-gray-800 rounded-lg hover:shadow-md hover:shadow-reactbdGreen border group"
          whileHover={{
            backgroundColor: "#001d3d",
            transition: { duration: 0.2, ease: "easeInOut" },
          }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col border border-transparent"
            whileHover={{
              translateX: 16,
              translateY: -16,
              borderColor: "#001d3d",
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-full ${tool.color}`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                {tool.title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow h-18 line-clamp-3">
              {tool.description}
            </p>
            <Link href={tool.href}>
              <button
                className={`w-full text-base font-medium py-2 px-4 rounded-md border border-reactBlue/50 group-hover:bg-reactBlue group-hover:text-reactbdWhite hoverEffect`}
              >
                Get Started
              </button>
            </Link>
            <Link href={tool.href} className="absolute inset-1" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default JSONCard;
