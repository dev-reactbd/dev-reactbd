"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Download, Copy, Upload, FileText, X, WrapText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
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

export default function JSONFormatterClient() {
  const [inputJSON, setInputJSON] = useState("");
  const [formattedJSON, setFormattedJSON] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [inputLineWrap, setInputLineWrap] = useState(false);
  const [outputLineWrap, setOutputLineWrap] = useState(false);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(inputJSON);
      setFormattedJSON(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
      setFormattedJSON("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputJSON(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(formattedJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    const blob = new Blob([formattedJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearInput = () => {
    setInputJSON("");
    setFormattedJSON("");
    setError("");
  };

  const loadSampleJSON = () => {
    const sample = `{"name":"John Doe","age":30,"email":"john@example.com","description":"A software engineer with extensive experience in full-stack development, specializing in React, Node.js, and modern web technologies.","address":{"street":"123 Main Street, Apartment 4B","city":"New York","zipCode":"10001","coordinates":{"latitude":40.7128,"longitude":-74.0060}},"hobbies":["reading technical books and staying updated with latest programming trends","swimming and maintaining physical fitness","coding personal projects and contributing to open source"],"isActive":true,"metadata":{"createdAt":"2024-01-01T00:00:00Z","updatedAt":"2024-01-01T00:00:00Z","tags":["developer","full-stack","react","nodejs","javascript","typescript"],"preferences":{"theme":"dark","notifications":true,"language":"en-US"}}}`;
    setInputJSON(sample);
    setFormattedJSON("");
    setError("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">JSON Formatter & Pretty Printer</h1>
        <p className="text-xl text-muted-foreground">
          Format and beautify your JSON with syntax highlighting and proper
          indentation
        </p>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload JSON File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".json,.txt"
              onChange={handleFileUpload}
              className="flex-1"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </span>
              </Button>
            </Label>
            <Button variant="outline" onClick={loadSampleJSON}>
              Load Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>Raw JSON Input</CardTitle>
              {inputJSON && (
                <Button variant="ghost" size="sm" onClick={clearInput}>
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
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
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex-1 overflow-hidden border rounded-lg">
              {inputJSON ? (
                <JSONHighlighter json={inputJSON} lineWrap={inputLineWrap} />
              ) : (
                <Textarea
                  placeholder="Paste your JSON here or upload a file above..."
                  value={inputJSON}
                  onChange={(e) => setInputJSON(e.target.value)}
                  className="font-mono text-sm h-full resize-none border-0 focus-visible:ring-0"
                />
              )}
            </div>
            <Button
              onClick={formatJSON}
              className="w-full flex-shrink-0"
              size="lg"
              disabled={!inputJSON.trim()}
            >
              Format JSON
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>Formatted JSON Output</CardTitle>
              {formattedJSON && (
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
            {/* Output Display Options */}
            {formattedJSON && (
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
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <X className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {formattedJSON ? (
              <div className="h-full border rounded-lg overflow-auto bg-background scrollbar-hide">
                <JSONHighlighter
                  json={formattedJSON}
                  lineWrap={outputLineWrap}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                <div>
                  <div className="text-4xl mb-4">✨</div>
                  <p className="text-lg font-medium mb-2">
                    Formatted JSON will appear here
                  </p>
                  <p className="text-sm">
                    Paste JSON in the input area and click &quot;Format
                    JSON&quot;
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Info */}
      <BenefitsSection
        cardOneIcon="🎨"
        cardOneTitle="Pretty Formatting"
        cardOneDescription="Automatically formats JSON with proper indentation and line breaks"
        cardTwoIcon="📁"
        cardTwoTitle="File Support"
        cardTwoDescription="Upload JSON files directly or paste content manually"
        cardThreeIcon="⚡"
        cardThreeTitle="Instant Processing"
        cardThreeDescription="Real-time formatting with error detection and validation"
      />
    </div>
  );
}
