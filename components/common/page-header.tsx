"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
}

const PageHeader = ({ title }: Props) => {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              aria-label="Back to previous page"
              onClick={() => router.back()} // Use router.back() for previous page
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-6 w-px bg-gray-300 hidden sm:block" />
            <h1 className="text-lg font-semibold text-gray-900">
              {title ? title : "Page Header"}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
