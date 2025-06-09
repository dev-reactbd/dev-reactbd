"use client";
import Container from "@/components/common/container";
import { ImageEditor } from "@/components/image-editor/imageEditor";

export default function EditorPageClient() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Online Image Editor",
            url: "https://image-converter.reactbd.com/editor",
            description:
              "Professional online image editor with crop, resize, rotate, flip, and filter tools. Edit images instantly in your browser.",
            applicationCategory: "PhotographyApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Crop images with aspect ratios",
              "Resize and rotate images",
              "Apply filters and effects",
              "Brightness and contrast adjustment",
              "Real-time image editing",
              "Undo/redo functionality",
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Editor */}
        <Container className="py-5">
          <ImageEditor />
        </Container>
      </div>
    </>
  );
}
