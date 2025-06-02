import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, Zap, Palette, Globe } from "lucide-react";
import { Badge } from "../ui/badge";

const FormatInfo = () => {
  const formats = [
    {
      name: "JPEG/JPG",
      icon: <FileImage className="w-6 h-6" />,
      description: "Best for photographs and images with many colors",
      advantages: ["Small file sizes", "Widely supported", "Good for photos"],
      disadvantages: [
        "Lossy compression",
        "No transparency",
        "Quality degrades",
      ],
      useCase: "Photography, web images, social media",
      color: "bg-red-100 text-red-700",
    },
    {
      name: "PNG",
      icon: <Palette className="w-6 h-6" />,
      description:
        "Perfect for graphics, logos, and images requiring transparency",
      advantages: [
        "Lossless compression",
        "Supports transparency",
        "Great for graphics",
      ],
      disadvantages: [
        "Larger file sizes",
        "Not ideal for photos",
        "Limited browser support for advanced features",
      ],
      useCase: "Logos, graphics, screenshots, icons",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "WebP",
      icon: <Globe className="w-6 h-6" />,
      description: "Modern format offering superior compression and quality",
      advantages: [
        "Excellent compression",
        "Supports transparency",
        "Both lossy and lossless",
      ],
      disadvantages: [
        "Limited older browser support",
        "Newer format",
        "Less universal",
      ],
      useCase: "Modern web applications, progressive web apps",
      color: "bg-green-100 text-green-700",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🖼️ Understanding Image Formats
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn the pros, cons, and best use cases for popular image formats
          like JPEG, PNG, and WebP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
        {formats.map((format, index) => (
          <Card
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-3 rounded-xl shadow-inner backdrop-blur-sm ${format.color}`}
                >
                  {format.icon}
                </div>
                <CardTitle className="text-2xl font-semibold">
                  {format.name}
                </CardTitle>
              </div>
              <p className="text-sm text-gray-600">{format.description}</p>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <h4 className="text-md font-semibold text-green-700 mb-2">
                  ✅ Advantages
                </h4>
                <ul className="space-y-1">
                  {format.advantages.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-md font-semibold text-red-700 mb-2">
                  ⚠️ Disadvantages
                </h4>
                <ul className="space-y-1">
                  {format.disadvantages.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-700 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-2">
                  🎯 Best For
                </h4>
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 rounded"
                >
                  {format.useCase}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-100 border border-blue-200 shadow-xl rounded-2xl">
        <CardContent className="p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 bg-blue-100 rounded-xl shadow-md">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Format Selection Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
                  <h4 className="text-red-700 font-semibold mb-2">JPEG</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Photos</li>
                    <li>• Social media</li>
                    <li>• Small file size</li>
                    <li>• Email attachments</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
                  <h4 className="text-blue-700 font-semibold mb-2">PNG</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Logos</li>
                    <li>• Screenshots</li>
                    <li>• Transparency</li>
                    <li>• Design mockups</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition">
                  <h4 className="text-green-700 font-semibold mb-2">WebP</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Modern websites</li>
                    <li>• Performance optimization</li>
                    <li>• Both quality & size</li>
                    <li>• Next-gen projects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormatInfo;
