import FormatInfo from "@/components/converter/format-info";
import Hero from "@/components/converter/hero";
import ImageConverter from "@/components/converter/image-converter";

const ConverterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Hero />
      {/* Image Converter Section */}
      <section id="converter" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Convert Your Images Online
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload an image and convert it to your desired format with
              customizable quality settings. Supports JPG, PNG, WebP, and JPEG
              formats.
            </p>
          </header>

          <ImageConverter />
        </div>
      </section>
      {/* Format Information Section */}
      <section id="formats" className="py-20 bg-gray-50">
        <FormatInfo />
      </section>
    </div>
  );
};

export default ConverterPage;
