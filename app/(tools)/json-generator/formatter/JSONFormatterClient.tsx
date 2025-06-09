"use client";

import type React from "react";

import { useState } from "react";
import { Download, Copy, Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/common/page-header";

export default function JSONFormatterClient() {
  const [inputJSON, setInputJSON] = useState("");
  const [formattedJSON, setFormattedJSON] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8">
      <PageHeader title="JSON Formatter" />
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
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <Textarea
                placeholder="Paste your JSON here or upload a file above..."
                value={inputJSON}
                onChange={(e) => setInputJSON(e.target.value)}
                className="font-mono text-sm resize-none h-full"
              />
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
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <X className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {formattedJSON ? (
              <div className="h-full overflow-auto border rounded-lg">
                <pre className="p-4 text-sm font-mono h-full">
                  <code className="language-json">{formattedJSON}</code>
                </pre>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold mb-2">Pretty Formatting</h3>
            <p className="text-sm text-muted-foreground">
              Automatically formats JSON with proper indentation and line breaks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-2">📁</div>
            <h3 className="font-semibold mb-2">File Support</h3>
            <p className="text-sm text-muted-foreground">
              Upload JSON files directly or paste content manually
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Instant Processing</h3>
            <p className="text-sm text-muted-foreground">
              Real-time formatting with error detection and validation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
