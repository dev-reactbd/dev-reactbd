"use client";
import {
  ImageIcon,
  Zap,
  Download,
  Star,
  Users,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "../ui/button";

const Hero = () => {
  const scrollToConverter = () => {
    document
      .getElementById("converter")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Highlight Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Zap className="w-4 h-4 animate-pulse" />
            Fast & Secure Image Conversion
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
            Convert & Edit Images Instantly —
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              100% Free & Private
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload your image, choose a format (JPG, PNG, WebP), and download in
            seconds. All in your browser — no signup, no data saved.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md"
              aria-label="Start converting images now"
              onClick={scrollToConverter}
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Convert Image Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors duration-300"
              aria-label="Learn about image formats"
              onClick={() =>
                document
                  .getElementById("formats")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn Formats
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm text-gray-600">
            {[
              {
                icon: <Users className="text-green-600 w-4 h-4" />,
                label: "1M+ Happy Users",
              },
              {
                icon: <Star className="text-yellow-500 w-4 h-4" />,
                label: "4.8/5 Star Rated",
              },
              {
                icon: <Shield className="text-blue-600 w-4 h-4" />,
                label: "Private & Secure",
              },
              {
                icon: <Clock className="text-purple-600 w-4 h-4" />,
                label: "Instant Processing",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Zap className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-100",
                title: "Lightning Fast",
                desc: "Convert images instantly with zero upload delays or server processing.",
              },
              {
                icon: <ImageIcon className="w-6 h-6 text-green-600" />,
                bg: "bg-green-100",
                title: "Format Flexibility",
                desc: "Convert JPG, PNG, WebP, JPEG – with quality control and instant preview.",
              },
              {
                icon: <Download className="w-6 h-6 text-purple-600" />,
                bg: "bg-purple-100",
                title: "One-Click Download",
                desc: "Instantly download your converted image. No email, no wait.",
              },
            ].map((card, idx) => (
              <article
                key={idx}
                className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 border border-gray-100 hover:border-blue-200"
              >
                <div
                  className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center mb-4 mx-auto`}
                >
                  {card.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-center text-lg">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm text-center">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
