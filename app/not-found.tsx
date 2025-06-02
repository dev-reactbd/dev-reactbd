import { Home, Search, Mail, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  const quickLinks = [
    {
      name: "Image Converter",
      description: "Convert images between formats",
      link: "/image-converter",
      icon: "🖼️",
    },
    {
      name: "Image Resizer",
      description: "Resize images to any dimension",
      link: "/image-resizer",
      icon: "📏",
    },
    {
      name: "Email Faker",
      description: "Generate fake email addresses",
      link: "/email-faker",
      icon: "📧",
    },
    {
      name: "JSON Generator",
      description: "Create mock JSON data",
      link: "/fake-json-generator",
      icon: "📄",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50">
      {/* 404 Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-[#ffc300] to-[#ffd60a] rounded-full mb-6">
              <span className="text-6xl">🔍</span>
            </div>
          </div>

          {/* 404 Heading */}
          <h1 className="text-8xl sm:text-9xl font-bold text-[#001d3d] mb-4 opacity-20">
            404
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#001d3d] mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-[#737373] mb-8 max-w-2xl mx-auto">
            Oops! The page you&apos;re looking for seems to have wandered off.
            Don&apos;t worry, it happens to the best of us. Let&apos;s get you
            back on track with our helpful tools and resources.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/">
              <Button className="bg-gradient-to-r from-[#ffc300] to-[#ffd60a] hover:from-[#ffd60a] hover:to-[#ffc300] text-[#001d3d] px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Home className="mr-2 w-5 h-5" />
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-[#ffc300] text-[#001d3d] hover:bg-[#ffc300] hover:text-[#001d3d] px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                <Mail className="mr-2 w-5 h-5" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-[#001d3d] text-center mb-8">
            Popular Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((tool) => (
              <Link key={tool.name} href={tool.link}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 p-6 text-center group">
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h4 className="text-lg font-semibold text-[#001d3d] mb-2 group-hover:text-[#ffc300] transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-[#737373] text-sm mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-center text-[#ffc300] group-hover:text-[#001d3d] transition-colors">
                    <span className="text-sm font-medium">Try Now</span>
                    <ExternalLink className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#001d3d] mb-4">
              Need Help Finding Something?
            </h3>
            <p className="text-[#737373] max-w-2xl mx-auto">
              Here are some suggestions to help you find what you&apos;re
              looking for:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ffc300] rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-[#001d3d]" />
              </div>
              <h4 className="text-lg font-semibold text-[#001d3d] mb-2">
                Visit Homepage
              </h4>
              <p className="text-[#737373] mb-4">
                Start fresh from our main page and explore all available tools.
              </p>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#ffc300] text-[#001d3d] hover:bg-[#ffc300]"
                >
                  Go Home
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#001d3d] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#ffc300]" />
              </div>
              <h4 className="text-lg font-semibold text-[#001d3d] mb-2">
                Check URL
              </h4>
              <p className="text-[#737373] mb-4">
                Make sure the web address is spelled correctly and try again.
              </p>
              <Link href={"/"}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#001d3d] text-[#001d3d] hover:bg-[#001d3d] hover:text-white"
                >
                  <ArrowLeft className="mr-1 w-4 h-4" />
                  Go Back
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#40be46] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-[#001d3d] mb-2">
                Contact Us
              </h4>
              <p className="text-[#737373] mb-4">
                Still can&apos;t find what you need? We&apos;re here to help you
                out.
              </p>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#40be46] text-[#40be46] hover:bg-[#40be46] hover:text-white"
                >
                  Get Help
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-[#737373]">
            Error Code: 404 | Page Not Found |
            <Link
              href="/"
              className="text-[#ffc300] hover:text-[#ffd60a] ml-1 transition-colors"
            >
              Return to ReactBD Tools
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
