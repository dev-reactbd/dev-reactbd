"use client";

import type React from "react";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  Download,
  ImageIcon,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { convertImage } from "@/lib/image-utils";
import Image from "next/image";

type ImageFormat = "jpeg" | "png" | "webp";

interface ConvertedImage {
  blob: Blob;
  url: string;
  format: ImageFormat;
  size: number;
}

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<ImageFormat>("png");
  const [quality, setQuality] = useState([80]);
  const [convertedImage, setConvertedImage] = useState<ConvertedImage | null>(
    null
  );
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setConvertedImage(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    try {
      const result = await convertImage(
        selectedFile,
        outputFormat,
        quality[0] / 100
      );
      setConvertedImage(result);
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;

    const link = document.createElement("a");
    link.href = convertedImage.url;
    link.download = `converted-image.${convertedImage.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setConvertedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Section */}
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <CardContent className="p-8">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 transform ${
              isDragging
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 scale-[1.02] shadow-lg"
                : selectedFile
                ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md"
                : "border-gray-300 hover:border-gray-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:scale-[1.01]"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>

            {selectedFile ? (
              <div className="relative space-y-6">
                <div className="relative inline-block group">
                  <Image
                    width={800}
                    height={800}
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-80 rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105 object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-3 -right-3 rounded-full w-10 h-10 p-0 shadow-lg hover:scale-110 transition-transform duration-200"
                    onClick={clearImage}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <p className="font-semibold text-gray-900 text-lg">
                    {selectedFile.name}
                  </p>
                  <p className="text-gray-600">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Drop your image here
                  </h3>
                  <p className="text-gray-600 text-lg">
                    or click to browse your files
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG, WebP, and JPEG files up to 10MB
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Conversion Settings */}
      {selectedFile && (
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Conversion Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label
                  htmlFor="format"
                  className="text-lg font-semibold text-gray-700"
                >
                  Output Format
                </Label>
                <Select
                  value={outputFormat}
                  onValueChange={(value: ImageFormat) => setOutputFormat(value)}
                >
                  <SelectTrigger className="h-12 text-lg border-2 border-gray-200 hover:border-purple-300 transition-colors duration-200">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG - Best for graphics</SelectItem>
                    <SelectItem value="jpeg">JPEG - Best for photos</SelectItem>
                    <SelectItem value="webp">WebP - Modern format</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(outputFormat === "jpeg" || outputFormat === "webp") && (
                <div className="space-y-3">
                  <Label
                    htmlFor="quality"
                    className="text-lg font-semibold text-gray-700"
                  >
                    Quality: {quality[0]}%
                  </Label>
                  <div className="space-y-3">
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full h-3"
                    />
                    <div className="flex justify-between text-sm text-gray-500 font-medium">
                      <span>Smaller size</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleConvert}
              disabled={isConverting}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              size="lg"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Converting your image...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  Convert Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Converted Image */}
      {convertedImage && (
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Converted Image
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Image
                  width={800}
                  height={800}
                  src={convertedImage.url || "/placeholder.svg"}
                  alt="Converted"
                  className="w-full rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Format:</span>
                    <span className="font-bold uppercase text-lg text-purple-600">
                      {convertedImage.format}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Size:</span>
                    <span className="font-bold text-lg">
                      {formatFileSize(convertedImage.size)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Original Size:
                    </span>
                    <span className="font-bold text-lg">
                      {formatFileSize(selectedFile?.size || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Size Change:
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        convertedImage.size < (selectedFile?.size || 0)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedFile &&
                        (
                          ((convertedImage.size - selectedFile.size) /
                            selectedFile.size) *
                          100
                        ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-3" />
                    Download Converted Image
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageConverter;
