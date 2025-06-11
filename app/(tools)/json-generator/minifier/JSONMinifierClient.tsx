"use client";

import { useState, useMemo } from "react";
import {
  Download,
  Copy,
  Minimize2,
  X,
  BarChart3,
  WrapText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import BenefitsSection from "@/components/common/BenefitsSection";

// JSON Syntax Highlighter with Line Numbers
const JSONHighlighter = ({
  json,
  lineWrap,
}: {
  json: string;
  lineWrap: boolean;
}) => {
  const highlightedLines = useMemo(() => {
    if (!json) return [];

    const lines = json.split("\n");

    return lines.map((line, index) => {
      const lineNumber = index + 1;

      // Highlight JSON syntax
      const highlightedLine = line.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],])/g,
        (match) => {
          let cls = "";

          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "text-blue-600 dark:text-blue-400 font-medium"; // keys
            } else {
              cls = "text-green-600 dark:text-green-400"; // strings
            }
          } else if (/true|false/.test(match)) {
            cls = "text-purple-600 dark:text-purple-400"; // booleans
          } else if (/null/.test(match)) {
            cls = "text-red-600 dark:text-red-400"; // null
          } else if (/^-?\d/.test(match)) {
            cls = "text-orange-600 dark:text-orange-400"; // numbers
          } else if (/[{}[\],]/.test(match)) {
            cls = "text-gray-600 dark:text-gray-400 font-bold"; // brackets and commas
          }

          return `<span class="${cls}">${match}</span>`;
        }
      );

      return {
        number: lineNumber,
        content: highlightedLine,
        raw: line,
      };
    });
  }, [json]);

  return (
    <div className="relative h-full">
      <div className="flex text-sm font-mono h-full">
        {/* Line Numbers */}
        <div className="flex-shrink-0 w-12 bg-muted/50 border-r border-border text-right pr-2 py-2 text-muted-foreground select-none">
          {highlightedLines.map((line) => (
            <div key={line.number} className="leading-6">
              {line.number}
            </div>
          ))}
        </div>

        {/* Code Content */}
        <div
          className={`flex-1 ${lineWrap ? "overflow-y-auto" : "overflow-auto"}`}
        >
          <pre
            className={`p-2 leading-6 h-full ${
              lineWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
            }`}
          >
            {highlightedLines.map((line) => (
              <div key={line.number}>
                <code
                  dangerouslySetInnerHTML={{
                    __html: line.content || "&nbsp;",
                  }}
                />
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default function JSONMinifierClient() {
  const [inputJSON, setInputJSON] = useState("");
  const [minifiedJSON, setMinifiedJSON] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{
    originalSize: number;
    minifiedSize: number;
    reduction: number;
  } | null>(null);

  const [inputLineWrap, setInputLineWrap] = useState(false);
  const [outputLineWrap, setOutputLineWrap] = useState(false);

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(inputJSON);
      const minified = JSON.stringify(parsed);
      setMinifiedJSON(minified);
      setError("");

      // Calculate size reduction
      const originalSize = new Blob([inputJSON]).size;
      const minifiedSize = new Blob([minified]).size;
      const reduction = Math.round(
        ((originalSize - minifiedSize) / originalSize) * 100
      );

      setStats({
        originalSize,
        minifiedSize,
        reduction,
      });
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
      setMinifiedJSON("");
      setStats(null);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(minifiedJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    const blob = new Blob([minifiedJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minified.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearInput = () => {
    setInputJSON("");
    setMinifiedJSON("");
    setError("");
    setStats(null);
  };

  const loadSampleJSON = () => {
    const sample = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "description": "A software engineer with extensive experience in full-stack development, specializing in React, Node.js, and modern web technologies. Passionate about creating scalable and maintainable applications.",
  "address": {
    "street": "123 Main Street, Apartment 4B",
    "city": "New York",
    "zipCode": "10001",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "hobbies": [
    "reading technical books and staying updated with latest programming trends",
    "swimming and maintaining physical fitness",
    "coding personal projects and contributing to open source"
  ],
  "isActive": true,
  "metadata": {
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "tags": ["developer", "full-stack", "react", "nodejs", "javascript", "typescript"],
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "en-US"
    }
  }
}`;
    setInputJSON(sample);
    setMinifiedJSON("");
    setError("");
    setStats(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">JSON Minifier</h1>
        <p className="text-xl text-muted-foreground">
          Compress your JSON by removing unnecessary whitespace and formatting
        </p>
      </div>

      {/* Stats Card */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Compression Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">
                  {formatBytes(stats.originalSize)}
                </p>
                <p className="text-sm text-muted-foreground">Original Size</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">
                  {formatBytes(stats.minifiedSize)}
                </p>
                <p className="text-sm text-muted-foreground">Minified Size</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.reduction}%
                </p>
                <p className="text-sm text-muted-foreground">Size Reduction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>JSON Input</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSampleJSON}>
                  Load Sample
                </Button>
                {inputJSON && (
                  <Button variant="ghost" size="sm" onClick={clearInput}>
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex-1 overflow-hidden border rounded-lg">
              {inputJSON ? (
                <JSONHighlighter json={inputJSON} lineWrap={inputLineWrap} />
              ) : (
                <Textarea
                  placeholder="Paste your JSON here to minify..."
                  value={inputJSON}
                  onChange={(e) => setInputJSON(e.target.value)}
                  className="font-mono text-sm h-full resize-none border-0 focus-visible:ring-0"
                />
              )}
            </div>
            {/* Input Display Options */}
            {inputJSON && (
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <WrapText className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="input-line-wrap" className="text-sm">
                    Line Wrap
                  </Label>
                  <Switch
                    id="input-line-wrap"
                    checked={inputLineWrap}
                    onCheckedChange={setInputLineWrap}
                  />
                </div>
              </div>
            )}
            <Button
              onClick={minifyJSON}
              className="w-full flex-shrink-0"
              size="lg"
              disabled={!inputJSON.trim()}
            >
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify JSON
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>Minified JSON Output</CardTitle>
              {minifiedJSON && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadJSON}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <X className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {minifiedJSON ? (
              <div className="h-full border rounded-lg overflow-auto bg-background">
                <div className="p-4">
                  <pre
                    className={`text-sm font-mono ${
                      outputLineWrap
                        ? "whitespace-pre-wrap break-all"
                        : "break-all whitespace-pre-wrap"
                    }`}
                  >
                    <code className="text-green-600 dark:text-green-400">
                      {minifiedJSON}
                    </code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                <div>
                  <div className="text-4xl mb-4">🗜️</div>
                  <p className="text-lg font-medium mb-2">
                    Minified JSON will appear here
                  </p>
                  <p className="text-sm">
                    Paste JSON in the input area and click "Minify JSON"
                  </p>
                </div>
              </div>
            )}
            {/* Output Display Options */}
            {minifiedJSON && (
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <WrapText className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="output-line-wrap" className="text-sm">
                    Line Wrap
                  </Label>
                  <Switch
                    id="output-line-wrap"
                    checked={outputLineWrap}
                    onCheckedChange={setOutputLineWrap}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* <BenefitsSection /> */}
      <BenefitsSection
        cardOneIcon="⚡"
        cardOneTitle="Faster Loading"
        cardOneDescription="Smaller file sizes mean faster network transfers and loading"
        cardTwoIcon="💾"
        cardTwoTitle="Reduced Storage"
        cardTwoDescription="Save storage space and bandwidth with compressed JSON"
        cardThreeIcon="🚀"
        cardThreeTitle="Production Ready"
        cardThreeDescription="Optimized JSON perfect for production environments"
      />
    </div>
  );
}
