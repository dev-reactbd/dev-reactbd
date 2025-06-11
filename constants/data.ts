import {
  Check,
  FileSpreadsheet,
  FileText,
  GitCompare,
  ImageIcon,
  Mail,
  Minimize2,
  Settings,
  Zap,
} from "lucide-react";
const navData = [
  {
    title: "Image Converter",
    href: "/image-converter",
  },
  {
    title: "Image Resizer",
    href: "/image-resizer",
  },
  {
    title: "Email Faker",
    href: "/email-faker",
  },
  {
    title: "JSON Generator",
    href: "/json-generator",
  },
  {
    title: "Contact Us",
    href: "/contact",
  },
];

const toolsData = [
  {
    title: "Image Converter",
    description:
      "Convert images between formats like JPG, PNG, WebP, and more with ease.",
    icon: ImageIcon,
    href: "https://reactbd.org/image-converter",
    color: "bg-gradient-to-br from-blue-600 to-blue-800",
  },
  {
    title: "Image Resizer",
    description:
      "Resize images to any dimension while preserving quality and aspect ratio.",
    icon: Zap,
    href: "https://reactbd.org/image-resizer",
    color: "bg-gradient-to-br from-green-500 to-green-700",
  },
  {
    title: "Email Faker",
    description:
      "Generate realistic fake email addresses for testing and development.",
    icon: Mail,
    href: "https://reactbd.org/email-faker",
    color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
  },
  {
    title: "JSON Generator",
    description:
      "Generate realistic fake JSON data with customizable fields and data types. Perfect for testing and prototyping.",
    icon: Settings,
    href: "https://reactbd.org/json-generator/generate",
    color: "bg-blue-500",
  },
  {
    title: "JSON Formatter",
    description:
      "Pretty-print and format JSON with syntax highlighting. Upload files or paste JSON directly.",
    icon: FileText,
    href: "https://reactbd.org/json-generator/formatter",
    color: "bg-green-500",
  },
  {
    title: "JSON Validator",
    description:
      "Validate JSON syntax with detailed error messages and success confirmations.",
    icon: Check,
    href: "https://reactbd.org/json-generator/validator",
    color: "bg-emerald-500",
  },
  {
    title: "JSON Minifier",
    description:
      "Compress JSON by removing unnecessary whitespace and formatting.",
    icon: Minimize2,
    href: "https://reactbd.org/json-generator/minifier",
    color: "bg-orange-500",
  },
  {
    title: "JSON to CSV",
    description:
      "Convert JSON arrays to CSV format with download options for data analysis.",
    icon: FileSpreadsheet,
    href: "https://reactbd.org/json-generator/json-to-csv",
    color: "bg-purple-500",
  },
  {
    title: "JSON Compare",
    description:
      "Compare two JSON objects to find differences, missing keys, and similarities.",
    icon: GitCompare,
    href: "https://reactbd.org/json-generator/json-compare",
    color: "bg-red-500",
  },
];

export { navData, toolsData };
