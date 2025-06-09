"use client";

import type React from "react";
import { X } from "lucide-react"; // Import X icon

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Undo,
  Redo,
  RefreshCw,
  ImageIcon,
  Scissors,
  Move,
  Trash2,
  Sparkles,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize,
  PanelLeft,
  PanelRight,
  Sliders,
  Palette,
} from "lucide-react";

interface ImageState {
  canvas: HTMLCanvasElement;
  imageData: ImageData;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type CropHandle =
  | "tl"
  | "tr"
  | "bl"
  | "br"
  | "t"
  | "b"
  | "l"
  | "r"
  | "move"
  | null;

export function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null
  );
  const [history, setHistory] = useState<ImageState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Zoom and view states
  const [zoom, setZoom] = useState(1);
  const [canvasScale, setCanvasScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Editing states
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [hue, setHue] = useState([0]);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [cropHandle, setCropHandle] = useState<CropHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropRatio, setCropRatio] = useState("free");
  const [isResizing, setIsResizing] = useState(false);
  const [activeTab, setActiveTab] = useState("transform");

  // Check if we're on a small screen
  const [isMobile, setIsMobile] = useState(false);

  // Set up responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem("editorImage");
    if (savedImage) {
      loadImageFromDataURL(savedImage);
    }
  }, []);

  // Real-time filter application
  useEffect(() => {
    if (originalImage && !cropMode) {
      applyFiltersRealTime();
    }
  }, [brightness, contrast, saturation, hue, originalImage, cropMode]);

  const loadImageFromDataURL = (dataURL: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setOriginalImage(img);
      drawImageToCanvas(img);
      fitImageToCanvas();
      saveToHistory();
    };
    img.src = dataURL;
  };

  const fitImageToCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !originalImage) return;

    const containerWidth = container.clientWidth - 40; // padding
    const containerHeight = container.clientHeight - 40;

    const imageAspect = originalImage.width / originalImage.height;
    const containerAspect = containerWidth / containerHeight;

    let newWidth, newHeight;

    if (imageAspect > containerAspect) {
      newWidth = containerWidth;
      newHeight = containerWidth / imageAspect;
    } else {
      newHeight = containerHeight;
      newWidth = containerHeight * imageAspect;
    }

    const scale = Math.min(
      newWidth / originalImage.width,
      newHeight / originalImage.height
    );
    setCanvasScale(scale);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const drawImageToCanvas = (img: HTMLImageElement, applyFilters = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on original image and current scale
    const displayWidth = img.width * canvasScale * zoom;
    const displayHeight = img.height * canvasScale * zoom;

    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filters if needed
    if (applyFilters) {
      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%) hue-rotate(${hue[0]}deg)`;
    }

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Reset filter
    ctx.filter = "none";

    // Draw crop overlay if in crop mode
    if (cropMode && cropArea.width > 0 && cropArea.height > 0) {
      drawCropOverlay(ctx);
    }
  };

  const applyFiltersRealTime = () => {
    if (!originalImage) return;
    drawImageToCanvas(originalImage, true);
  };

  const drawCropOverlay = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert crop area from display coordinates to canvas coordinates
    const scaleX = canvas.width / (canvas.offsetWidth || canvas.width);
    const scaleY = canvas.height / (canvas.offsetHeight || canvas.height);

    const cropX = cropArea.x * scaleX;
    const cropY = cropArea.y * scaleY;
    const cropWidth = cropArea.width * scaleX;
    const cropHeight = cropArea.height * scaleY;

    // Draw dark overlay
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(cropX, cropY, cropWidth, cropHeight);

    ctx.restore();

    // Redraw image in crop area with filters
    if (originalImage) {
      ctx.save();
      ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%) hue-rotate(${hue[0]}deg)`;
      ctx.beginPath();
      ctx.rect(cropX, cropY, cropWidth, cropHeight);
      ctx.clip();
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // Draw crop border with gradient
    const gradient = ctx.createLinearGradient(
      cropX,
      cropY,
      cropX + cropWidth,
      cropY + cropHeight
    );
    gradient.addColorStop(0, "#3b82f6");
    gradient.addColorStop(1, "#8b5cf6");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

    // Draw handles
    drawCropHandles(ctx, cropX, cropY, cropWidth, cropHeight);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;

    // Rule of thirds grid
    for (let i = 1; i < 3; i++) {
      // Vertical lines
      const x = cropX + (cropWidth / 3) * i;
      ctx.beginPath();
      ctx.moveTo(x, cropY);
      ctx.lineTo(x, cropY + cropHeight);
      ctx.stroke();

      // Horizontal lines
      const y = cropY + (cropHeight / 3) * i;
      ctx.beginPath();
      ctx.moveTo(cropX, y);
      ctx.lineTo(cropX + cropWidth, y);
      ctx.stroke();
    }
  };

  const drawCropHandles = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const handleSize = 12;
    const handles = [
      { x: x - handleSize / 2, y: y - handleSize / 2, type: "tl" },
      { x: x + width / 2 - handleSize / 2, y: y - handleSize / 2, type: "t" },
      { x: x + width - handleSize / 2, y: y - handleSize / 2, type: "tr" },
      {
        x: x + width - handleSize / 2,
        y: y + height / 2 - handleSize / 2,
        type: "r",
      },
      {
        x: x + width - handleSize / 2,
        y: y + height - handleSize / 2,
        type: "br",
      },
      {
        x: x + width / 2 - handleSize / 2,
        y: y + height - handleSize / 2,
        type: "b",
      },
      { x: x - handleSize / 2, y: y + height - handleSize / 2, type: "bl" },
      { x: x - handleSize / 2, y: y + height / 2 - handleSize / 2, type: "l" },
    ];

    handles.forEach((handle) => {
      // Handle background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);

      // Handle border
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newCtx = newCanvas.getContext("2d");
    if (!newCtx) return;

    newCtx.putImageData(imageData, 0, 0);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ canvas: newCanvas, imageData });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = prevState.canvas.width;
      canvas.height = prevState.canvas.height;
      ctx.putImageData(prevState.imageData, 0, 0);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = nextState.canvas.width;
      canvas.height = nextState.canvas.height;
      ctx.putImageData(nextState.imageData, 0, 0);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleZoom = (direction: "in" | "out" | "fit") => {
    if (direction === "fit") {
      fitImageToCanvas();
      return;
    }

    const newZoom =
      direction === "in" ? Math.min(zoom * 1.2, 5) : Math.max(zoom / 1.2, 0.1);
    setZoom(newZoom);

    if (originalImage) {
      drawImageToCanvas(originalImage, true);
    }
  };

  const rotate = (degrees: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create temporary canvas for rotation
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    if (degrees === 90 || degrees === -90) {
      tempCanvas.width = originalImage.height;
      tempCanvas.height = originalImage.width;
    } else {
      tempCanvas.width = originalImage.width;
      tempCanvas.height = originalImage.height;
    }

    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((degrees * Math.PI) / 180);
    tempCtx.drawImage(
      originalImage,
      -originalImage.width / 2,
      -originalImage.height / 2
    );

    // Update original image
    const newImg = new Image();
    newImg.onload = () => {
      setOriginalImage(newImg);
      drawImageToCanvas(newImg, true);
      fitImageToCanvas();
      saveToHistory();
    };
    newImg.src = tempCanvas.toDataURL();
  };

  const flip = (direction: "horizontal" | "vertical") => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCanvas.width = originalImage.width;
    tempCanvas.height = originalImage.height;

    if (direction === "horizontal") {
      tempCtx.scale(-1, 1);
      tempCtx.drawImage(originalImage, -originalImage.width, 0);
    } else {
      tempCtx.scale(1, -1);
      tempCtx.drawImage(originalImage, 0, -originalImage.height);
    }

    const newImg = new Image();
    newImg.onload = () => {
      setOriginalImage(newImg);
      drawImageToCanvas(newImg, true);
      saveToHistory();
    };
    newImg.src = tempCanvas.toDataURL();
  };

  const startCrop = () => {
    setCropMode(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const padding = 50;
    const maxWidth = canvas.offsetWidth - padding * 2;
    const maxHeight = canvas.offsetHeight - padding * 2;

    setCropArea({
      x: padding,
      y: padding,
      width: maxWidth,
      height: maxHeight,
    });

    if (originalImage) {
      drawImageToCanvas(originalImage, true);
    }
  };

  const applyCropRatio = (ratio: string) => {
    setCropRatio(ratio);
    if (!cropMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let newWidth = cropArea.width;
    let newHeight = cropArea.height;

    switch (ratio) {
      case "1:1":
        newHeight = newWidth;
        break;
      case "4:3":
        newHeight = (newWidth * 3) / 4;
        break;
      case "16:9":
        newHeight = (newWidth * 9) / 16;
        break;
      case "3:2":
        newHeight = (newWidth * 2) / 3;
        break;
      case "free":
        return;
    }

    // Ensure crop area fits within canvas
    if (cropArea.y + newHeight > canvas.offsetHeight) {
      newHeight = canvas.offsetHeight - cropArea.y - 10;
      if (ratio !== "free") {
        newWidth =
          newHeight *
          (ratio === "1:1"
            ? 1
            : ratio === "4:3"
            ? 4 / 3
            : ratio === "16:9"
            ? 16 / 9
            : 3 / 2);
      }
    }

    setCropArea({ ...cropArea, width: newWidth, height: newHeight });
    if (originalImage) {
      drawImageToCanvas(originalImage, true);
    }
  };

  const getCropHandle = (x: number, y: number): CropHandle => {
    const handleSize = 12;
    const tolerance = 8;

    const handles = [
      {
        x: cropArea.x - handleSize / 2,
        y: cropArea.y - handleSize / 2,
        type: "tl" as CropHandle,
      },
      {
        x: cropArea.x + cropArea.width / 2 - handleSize / 2,
        y: cropArea.y - handleSize / 2,
        type: "t" as CropHandle,
      },
      {
        x: cropArea.x + cropArea.width - handleSize / 2,
        y: cropArea.y - handleSize / 2,
        type: "tr" as CropHandle,
      },
      {
        x: cropArea.x + cropArea.width - handleSize / 2,
        y: cropArea.y + cropArea.height / 2 - handleSize / 2,
        type: "r" as CropHandle,
      },
      {
        x: cropArea.x + cropArea.width - handleSize / 2,
        y: cropArea.y + cropArea.height - handleSize / 2,
        type: "br" as CropHandle,
      },
      {
        x: cropArea.x + cropArea.width / 2 - handleSize / 2,
        y: cropArea.y + cropArea.height - handleSize / 2,
        type: "b" as CropHandle,
      },
      {
        x: cropArea.x - handleSize / 2,
        y: cropArea.y + cropArea.height - handleSize / 2,
        type: "bl" as CropHandle,
      },
      {
        x: cropArea.x - handleSize / 2,
        y: cropArea.y + cropArea.height / 2 - handleSize / 2,
        type: "l" as CropHandle,
      },
    ];

    for (const handle of handles) {
      if (
        x >= handle.x - tolerance &&
        x <= handle.x + handleSize + tolerance &&
        y >= handle.y - tolerance &&
        y <= handle.y + handleSize + tolerance
      ) {
        return handle.type;
      }
    }

    // Check if inside crop area for moving
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      return "move";
    }

    return null;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!cropMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const handle = getCropHandle(x, y);
    setCropHandle(handle);
    setDragStart({ x, y });
    setIsResizing(true);

    e.preventDefault();
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (cropMode) {
      // Update cursor based on handle
      const handle = getCropHandle(x, y);
      if (handle === "tl" || handle === "br") {
        canvas.style.cursor = "nw-resize";
      } else if (handle === "tr" || handle === "bl") {
        canvas.style.cursor = "ne-resize";
      } else if (handle === "t" || handle === "b") {
        canvas.style.cursor = "ns-resize";
      } else if (handle === "l" || handle === "r") {
        canvas.style.cursor = "ew-resize";
      } else if (handle === "move") {
        canvas.style.cursor = "move";
      } else {
        canvas.style.cursor = "crosshair";
      }

      if (isResizing && cropHandle) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;

        const newCropArea = { ...cropArea };

        switch (cropHandle) {
          case "tl":
            newCropArea.x += deltaX;
            newCropArea.y += deltaY;
            newCropArea.width -= deltaX;
            newCropArea.height -= deltaY;
            break;
          case "t":
            newCropArea.y += deltaY;
            newCropArea.height -= deltaY;
            break;
          case "tr":
            newCropArea.y += deltaY;
            newCropArea.width += deltaX;
            newCropArea.height -= deltaY;
            break;
          case "r":
            newCropArea.width += deltaX;
            break;
          case "br":
            newCropArea.width += deltaX;
            newCropArea.height += deltaY;
            break;
          case "b":
            newCropArea.height += deltaY;
            break;
          case "bl":
            newCropArea.x += deltaX;
            newCropArea.width -= deltaX;
            newCropArea.height += deltaY;
            break;
          case "l":
            newCropArea.x += deltaX;
            newCropArea.width -= deltaX;
            break;
          case "move":
            newCropArea.x += deltaX;
            newCropArea.y += deltaY;
            break;
        }

        // Ensure minimum size
        newCropArea.width = Math.max(20, newCropArea.width);
        newCropArea.height = Math.max(20, newCropArea.height);

        // Ensure crop area stays within canvas bounds
        newCropArea.x = Math.max(
          0,
          Math.min(newCropArea.x, canvas.offsetWidth - newCropArea.width)
        );
        newCropArea.y = Math.max(
          0,
          Math.min(newCropArea.y, canvas.offsetHeight - newCropArea.height)
        );

        setCropArea(newCropArea);
        setDragStart({ x, y });

        if (originalImage) {
          drawImageToCanvas(originalImage, true);
        }
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsResizing(false);
    setCropHandle(null);
  };

  const applyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Convert display coordinates to actual image coordinates
    const scaleX = originalImage.width / canvas.offsetWidth;
    const scaleY = originalImage.height / canvas.offsetHeight;

    const cropX = cropArea.x * scaleX;
    const cropY = cropArea.y * scaleY;
    const cropWidth = cropArea.width * scaleX;
    const cropHeight = cropArea.height * scaleY;

    // Create new image with cropped area
    const newCanvas = document.createElement("canvas");
    newCanvas.width = cropWidth;
    newCanvas.height = cropHeight;
    const newCtx = newCanvas.getContext("2d");
    if (!newCtx) return;

    // Apply current filters to the cropped image
    newCtx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%) hue-rotate(${hue[0]}deg)`;
    newCtx.drawImage(
      originalImage,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Update original image with cropped version
    const newImg = new Image();
    newImg.onload = () => {
      setOriginalImage(newImg);
      setCropMode(false);
      setCropArea({ x: 0, y: 0, width: 0, height: 0 });
      drawImageToCanvas(newImg, true);
      fitImageToCanvas();
      saveToHistory();
    };
    newImg.src = newCanvas.toDataURL();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target?.result as string;
      loadImageFromDataURL(dataURL);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = event.target?.result as string;
        loadImageFromDataURL(dataURL);
      };
      reader.readAsDataURL(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "edited-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  const resetImage = () => {
    if (originalImage) {
      drawImageToCanvas(originalImage);
      setBrightness([100]);
      setContrast([100]);
      setSaturation([100]);
      setHue([0]);
      setCropMode(false);
      setCropArea({ x: 0, y: 0, width: 0, height: 0 });
      fitImageToCanvas();
      saveToHistory();
    }
  };

  const clearImage = () => {
    setOriginalImage(null);
    setHistory([]);
    setHistoryIndex(-1);
    setBrightness([100]);
    setContrast([100]);
    setSaturation([100]);
    setHue([0]);
    setCropMode(false);
    setCropArea({ x: 0, y: 0, width: 0, height: 0 });
    setZoom(1);
    setCanvasScale(1);
    setPanOffset({ x: 0, y: 0 });
    localStorage.removeItem("editorImage");
    localStorage.removeItem("editorImageName");

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const applyFilter = (filterType: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (filterType) {
      case "grayscale":
        ctx.filter = "grayscale(100%)";
        break;
      case "sepia":
        ctx.filter = "sepia(100%)";
        break;
      case "vintage":
        ctx.filter = "sepia(50%) contrast(120%) brightness(110%)";
        break;
      case "cool":
        ctx.filter = "hue-rotate(180deg) saturate(120%)";
        break;
      case "warm":
        ctx.filter = "sepia(30%) saturate(120%) brightness(110%)";
        break;
      case "dramatic":
        ctx.filter = "contrast(150%) brightness(90%) saturate(130%)";
        break;
      default:
        ctx.filter = "none";
    }

    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    ctx.filter = "none";
    saveToHistory();
  };

  // Render the mobile toolbar
  const renderMobileToolbar = () => {
    if (!originalImage) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-between items-center z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10 rounded-full"
        >
          {sidebarOpen ? (
            <PanelRight className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </Button>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "transform" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTab("transform");
              setSidebarOpen(true);
            }}
            className="h-10 w-10 p-0 rounded-full"
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTab === "adjust" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTab("adjust");
              setSidebarOpen(true);
            }}
            className="h-10 w-10 p-0 rounded-full"
          >
            <Sliders className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTab === "filters" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveTab("filters");
              setSidebarOpen(true);
            }}
            className="h-10 w-10 p-0 rounded-full"
          >
            <Palette className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={downloadImage}
          className="h-10 w-10 p-0 rounded-full text-green-600"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="relative h-[calc(100vh-120px)] md:h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
        {/* Sidebar - hidden on mobile by default */}
        {sidebarOpen && (
          <div
            className={`md:col-span-1 space-y-4 overflow-y-auto ${
              isMobile
                ? "fixed inset-0 z-40 bg-white/95 backdrop-blur-sm p-4 pt-16 pb-20 overflow-y-auto"
                : "relative"
            }`}
          >
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  Image Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {!originalImage && (
                  <div
                    className={`text-center border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
                      isDragging
                        ? "border-blue-500 bg-blue-50 scale-105"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-600 mb-3 text-xs">
                      Drop image here or
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full text-xs"
                      size="sm"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {originalImage && (
                  <>
                    {/* Zoom Controls */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <ZoomIn className="w-3 h-3" />
                        Zoom & View
                      </Label>
                      <div className="grid grid-cols-3 gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZoom("out")}
                          className="p-1 h-8"
                        >
                          <ZoomOut className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZoom("fit")}
                          className="p-1 h-8"
                        >
                          <Maximize className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleZoom("in")}
                          className="p-1 h-8"
                        >
                          <ZoomIn className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-center text-xs text-gray-500">
                        Zoom: {Math.round(zoom * 100)}%
                      </div>
                    </div>

                    <Separator className="my-2" />

                    {/* History Controls */}
                    <div className="grid grid-cols-4 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-1 h-8"
                      >
                        <Undo className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-1 h-8"
                      >
                        <Redo className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetImage}
                        className="p-1 h-8"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearImage}
                        className="p-1 h-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    <Separator className="my-2" />

                    {/* Tools Tabs */}
                    <Tabs
                      defaultValue={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3 bg-gray-100 h-8">
                        <TabsTrigger
                          value="transform"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs"
                        >
                          Transform
                        </TabsTrigger>
                        <TabsTrigger
                          value="adjust"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs"
                        >
                          Adjust
                        </TabsTrigger>
                        <TabsTrigger
                          value="filters"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs"
                        >
                          Filters
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="transform" className="space-y-3 mt-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Rotate & Flip
                          </Label>
                          <div className="grid grid-cols-2 gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => rotate(-90)}
                              className="h-8 flex flex-col gap-0.5 text-xs"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span className="text-[10px]">Left</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => rotate(90)}
                              className="h-8 flex flex-col gap-0.5 text-xs"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span className="text-[10px]">Right</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => flip("horizontal")}
                              className="h-8 flex flex-col gap-0.5 text-xs"
                            >
                              <FlipHorizontal className="w-3 h-3" />
                              <span className="text-[10px]">H-Flip</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => flip("vertical")}
                              className="h-8 flex flex-col gap-0.5 text-xs"
                            >
                              <FlipVertical className="w-3 h-3" />
                              <span className="text-[10px]">V-Flip</span>
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Crop className="w-3 h-3" />
                            Crop Tool
                          </Label>
                          {!cropMode ? (
                            <Button
                              onClick={startCrop}
                              className="w-full h-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xs"
                              size="sm"
                            >
                              <Crop className="w-3 h-3 mr-1" />
                              Start Crop
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <Label className="text-[10px] text-gray-600">
                                  Aspect Ratio
                                </Label>
                                <Select
                                  value={cropRatio}
                                  onValueChange={applyCropRatio}
                                >
                                  <SelectTrigger className="h-7 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="1:1">
                                      Square (1:1)
                                    </SelectItem>
                                    <SelectItem value="4:3">
                                      Standard (4:3)
                                    </SelectItem>
                                    <SelectItem value="16:9">
                                      Widescreen (16:9)
                                    </SelectItem>
                                    <SelectItem value="3:2">
                                      Photo (3:2)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                onClick={applyCrop}
                                className="w-full h-7 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xs"
                              >
                                <Scissors className="w-3 h-3 mr-1" />
                                Apply Crop
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setCropMode(false);
                                  setCropArea({
                                    x: 0,
                                    y: 0,
                                    width: 0,
                                    height: 0,
                                  });
                                  if (originalImage) applyFiltersRealTime();
                                }}
                                className="w-full h-7 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="adjust" className="space-y-3 mt-3">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-gray-700">
                              Brightness: {brightness[0]}%
                            </Label>
                            <Slider
                              value={brightness}
                              onValueChange={setBrightness}
                              max={200}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-gray-700">
                              Contrast: {contrast[0]}%
                            </Label>
                            <Slider
                              value={contrast}
                              onValueChange={setContrast}
                              max={200}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-gray-700">
                              Saturation: {saturation[0]}%
                            </Label>
                            <Slider
                              value={saturation}
                              onValueChange={setSaturation}
                              max={200}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-semibold text-gray-700">
                              Hue: {hue[0]}°
                            </Label>
                            <Slider
                              value={hue}
                              onValueChange={setHue}
                              max={360}
                              min={-360}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="filters" className="space-y-3 mt-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Quick Filters
                          </Label>
                          <div className="grid grid-cols-1 gap-1">
                            {[
                              {
                                name: "Original",
                                value: "none",
                                gradient: "from-gray-400 to-gray-600",
                              },
                              {
                                name: "Grayscale",
                                value: "grayscale",
                                gradient: "from-gray-500 to-gray-700",
                              },
                              {
                                name: "Sepia",
                                value: "sepia",
                                gradient: "from-yellow-600 to-orange-700",
                              },
                              {
                                name: "Vintage",
                                value: "vintage",
                                gradient: "from-amber-500 to-orange-600",
                              },
                              {
                                name: "Cool",
                                value: "cool",
                                gradient: "from-blue-500 to-cyan-600",
                              },
                              {
                                name: "Warm",
                                value: "warm",
                                gradient: "from-red-500 to-pink-600",
                              },
                              {
                                name: "Dramatic",
                                value: "dramatic",
                                gradient: "from-purple-600 to-indigo-700",
                              },
                            ].map((filter) => (
                              <Button
                                key={filter.value}
                                variant="outline"
                                onClick={() => applyFilter(filter.value)}
                                className={`justify-start h-7 bg-gradient-to-r ${filter.gradient} text-white border-0 hover:scale-105 transition-transform duration-200 text-xs`}
                              >
                                {filter.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <Separator className="my-2" />

                    {/* Export */}
                    <div className="space-y-2">
                      <Button
                        onClick={downloadImage}
                        className="w-full h-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download Image
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {cropMode && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-2">
                  <div className="flex items-center gap-1 text-xs text-blue-700">
                    <Move className="w-3 h-3" />
                    <span className="font-medium text-[10px]">
                      Drag handles to resize, center to move
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Canvas Area */}
        <div
          className={`${
            sidebarOpen ? "md:col-span-4" : "col-span-1 md:col-span-5"
          } h-full`}
        >
          {/* Toggle sidebar button for desktop */}
          {originalImage && !isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute top-4 left-4 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            >
              {sidebarOpen ? (
                <PanelRight className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
          )}

          <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-white via-gray-50/30 to-blue-50/30">
            <CardContent
              className="p-4 h-full flex items-center justify-center"
              ref={containerRef}
            >
              {originalImage ? (
                <div className="relative flex items-center justify-center w-full h-full">
                  <canvas
                    ref={canvasRef}
                    className="border-2 border-gray-200 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-3xl max-w-full max-h-full object-contain"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    style={{
                      transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                    }}
                  />
                  {cropMode && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Badge
                        variant="secondary"
                        className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      >
                        <Crop className="w-3 h-3 mr-1" />
                        Crop Mode: Drag handles to resize
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`text-center space-y-4 border-2 border-dashed rounded-2xl p-6 transition-all duration-300 w-full max-w-md ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 scale-105"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <ImageIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      No Image Loaded
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Drop an image here or upload one to start editing
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile toolbar */}
      {renderMobileToolbar()}
    </div>
  );
}
