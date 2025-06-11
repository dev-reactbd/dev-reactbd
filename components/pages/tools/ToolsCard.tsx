"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toolsData } from "@/constants/data";

const ToolsCard = () => {
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
                Try Now
              </button>
            </Link>
            <Link href={tool.href} className="absolute inset-1" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default ToolsCard;
