import {
  Check,
  FileSpreadsheet,
  FileText,
  GitCompare,
  Minimize2,
  Settings,
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
export { navData, toolsData };
