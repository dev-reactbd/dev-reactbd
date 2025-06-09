import type { Metadata } from "next";
import EditorPageClient from "./EditorPageClient";

export const metadata: Metadata = {
  title: "Free Online Image Editor - Crop, Resize, Filters & More",
  description:
    "Professional online image editor with crop, resize, rotate, flip, and filter tools. Edit images instantly in your browser. No registration required - completely free and secure.",
  keywords: [
    "online image editor",
    "image editor",
    "photo editor",
    "crop image online",
    "resize image online",
    "image filters",
    "rotate image",
    "flip image",
    "free image editor",
    "browser image editor",
    "image editing tools",
  ],
  openGraph: {
    title: "Free Online Image Editor - Crop, Resize, Filters & More",
    description:
      "Professional online image editor with crop, resize, rotate, flip, and filter tools. Edit images instantly in your browser.",
    url: "https://image-converter.reactbd.com/editor",
  },
};

export default function EditorPage() {
  return <EditorPageClient />;
}
