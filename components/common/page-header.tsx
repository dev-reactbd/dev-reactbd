"use client";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Container from "./container";

interface Props {
  title: string;
  fallbackRoute?: string;
}

const PageHeader = ({ title, fallbackRoute = "/json-generator" }: Props) => {
  const router = useRouter();

  const handleRoutes = useCallback(() => {
    // Check if the referrer is from the same domain
    const isSameDomain =
      document.referrer &&
      new URL(document.referrer).hostname === window.location.hostname;

    // If there's a history and the referrer is from the same domain, go back
    if (isSameDomain && window.history.length > 1) {
      router.back();
    } else {
      // Otherwise, navigate to the fallback route (default: "/")
      router.push(fallbackRoute);
    }
  }, [router, fallbackRoute]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <Container className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              aria-label="Back to previous page or home"
              onClick={handleRoutes}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="h-6 w-px bg-gray-300 hidden sm:block" />
            <h1 className="text-lg font-semibold text-gray-900">
              {title || "Page Header"}
            </h1>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default PageHeader;
