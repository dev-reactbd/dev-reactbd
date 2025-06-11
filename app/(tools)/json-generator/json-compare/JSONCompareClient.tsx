"use client";

import type React from "react";

import { useState, useMemo } from "react";
import {
  Download,
  Copy,
  Upload,
  FileText,
  X,
  WrapText,
  GitCompare,
  AlertCircle,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BenefitsSection from "@/components/common/BenefitsSection";

// Define JSON-compatible value type
type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

// Enhanced JSON Syntax Highlighter with Direct Key/Value Highlighting
const JSONHighlighter = ({
  json,
  lineWrap,
  differenceLines = [],
  isEditMode = false,
  onTextChange,
}: {
  json: string;
  lineWrap: boolean;
  differenceLines?: {
    lineNumber: number;
    type: "missing" | "added" | "modified" | "matching";
    key: string;
    path: string;
  }[];
  isEditMode?: boolean;
  onTextChange?: (value: string) => void;
}) => {
  const highlightedLines = useMemo(() => {
    if (!json) return [];

    const lines = json.split("\n");

    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const difference = differenceLines.find(
        (diff) => diff.lineNumber === lineNumber
      );

      // Enhanced JSON syntax highlighting with difference colors
      const highlightedLine = line.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],])/g,
        (match) => {
          let cls = "";
          let bgCls = "";

          // Check if this match contains a key that has differences
          const isKey = /:$/.test(match);
          const keyName = isKey ? match.replace(/[":]/g, "") : null;

          // Find if this key is in our differences
          const keyDifference =
            difference &&
            keyName &&
            (difference.key === keyName ||
              difference.path.endsWith(keyName) ||
              difference.path.includes(keyName));

          if (/^"/.test(match)) {
            if (isKey) {
              // Key highlighting based on difference type
              if (keyDifference) {
                switch (difference?.type) {
                  case "missing":
                    cls = "text-white font-bold";
                    bgCls = "bg-red-600 px-1 rounded";
                    break;
                  case "added":
                    cls = "text-white font-bold";
                    bgCls = "bg-green-600 px-1 rounded";
                    break;
                  case "modified":
                    cls = "text-white font-bold";
                    bgCls = "bg-yellow-600 px-1 rounded";
                    break;
                  case "matching":
                    cls = "text-white font-bold";
                    bgCls = "bg-blue-600 px-1 rounded";
                    break;
                  default:
                    cls = "text-blue-600 dark:text-blue-400 font-medium";
                }
              } else {
                cls = "text-blue-600 dark:text-blue-400 font-medium";
              }
            } else {
              // Value highlighting
              if (keyDifference) {
                switch (difference?.type) {
                  case "missing":
                    cls = "text-red-700 dark:text-red-300 font-medium";
                    bgCls = "bg-red-100 dark:bg-red-900/30 px-1 rounded";
                    break;
                  case "added":
                    cls = "text-green-700 dark:text-green-300 font-medium";
                    bgCls = "bg-green-100 dark:bg-green-900/30 px-1 rounded";
                    break;
                  case "modified":
                    cls = "text-yellow-700 dark:text-yellow-300 font-medium";
                    bgCls = "bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded";
                    break;
                  case "matching":
                    cls = "text-blue-700 dark:text-blue-300 font-medium";
                    bgCls = "bg-blue-100 dark:bg-blue-900/30 px-1 rounded";
                    break;
                  default:
                    cls = "text-green-600 dark:text-green-400";
                }
              } else {
                cls = "text-green-600 dark:text-green-400";
              }
            }
          } else if (/true|false/.test(match)) {
            if (keyDifference) {
              cls = "text-purple-700 dark:text-purple-300 font-bold";
              bgCls =
                difference?.type === "missing"
                  ? "bg-red-100 dark:bg-red-900/30 px-1 rounded"
                  : difference?.type === "added"
                  ? "bg-green-100 dark:bg-green-900/30 px-1 rounded"
                  : difference?.type === "modified"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded"
                  : "bg-blue-100 dark:bg-blue-900/30 px-1 rounded";
            } else {
              cls = "text-purple-600 dark:text-purple-400";
            }
          } else if (/null/.test(match)) {
            if (keyDifference) {
              cls = "text-red-700 dark:text-red-300 font-bold";
              bgCls = "bg-red-100 dark:bg-red-900/30 px-1 rounded";
            } else {
              cls = "text-red-600 dark:text-red-400";
            }
          } else if (/^-?\d/.test(match)) {
            if (keyDifference) {
              cls = "text-orange-700 dark:text-orange-300 font-bold";
              bgCls =
                difference?.type === "missing"
                  ? "bg-red-100 dark:bg-red-900/30 px-1 rounded"
                  : difference?.type === "added"
                  ? "bg-green-100 dark:bg-green-900/30 px-1 rounded"
                  : difference?.type === "modified"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded"
                  : "bg-blue-100 dark:bg-blue-900/30 px-1 rounded";
            } else {
              cls = "text-orange-600 dark:text-orange-400";
            }
          } else if (/[{}[\],]/.test(match)) {
            cls = "text-gray-600 dark:text-gray-400 font-bold";
          }

          return bgCls
            ? `<span class="${bgCls}"><span class="${cls}">${match}</span></span>`
            : `<span class="${cls}">${match}</span>`;
        }
      );

      return {
        number: lineNumber,
        content: highlightedLine,
        raw: line,
        difference,
      };
    });
  }, [json, differenceLines]);

  if (isEditMode) {
    return (
      <div className="relative h-full">
        <div className="flex text-sm font-mono h-full">
          {/* Line Numbers for Edit Mode */}
          <div className="flex-shrink-0 w-16 bg-gray-100 dark:bg-gray-800 border-r border-border text-right pr-3 py-2 text-gray-500 dark:text-gray-400 select-none">
            {highlightedLines.map((line) => (
              <div
                key={line.number}
                className={`leading-6 h-6 flex items-center justify-end ${
                  line.difference
                    ? line.difference.type === "missing"
                      ? "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold"
                      : line.difference.type === "added"
                      ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 font-bold"
                      : line.difference.type === "modified"
                      ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-bold"
                      : "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-bold"
                    : ""
                }`}
              >
                {line.number}
              </div>
            ))}
          </div>

          {/* Textarea with line highlighting */}
          <div className="flex-1 relative">
            <Textarea
              value={json}
              onChange={(e) => onTextChange?.(e.target.value)}
              className={`font-mono text-sm h-full resize-none border-0 focus-visible:ring-0 bg-transparent ${
                lineWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
              }`}
              style={{ lineHeight: "24px", padding: "8px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="flex text-sm font-mono h-full">
        {/* Line Numbers */}
        <div className="flex-shrink-0 w-16 bg-gray-100 dark:bg-gray-800 border-r border-border text-right pr-3 py-2 text-gray-500 dark:text-gray-400 select-none">
          {highlightedLines.map((line) => (
            <div
              key={line.number}
              className={`leading-6 h-6 flex items-center justify-end ${
                line.difference
                  ? line.difference.type === "missing"
                    ? "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold"
                    : line.difference.type === "added"
                    ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 font-bold"
                    : line.difference.type === "modified"
                    ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-bold"
                    : "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-bold"
                  : ""
              }`}
            >
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
              <div key={line.number} className="h-6 flex items-center">
                <code
                  dangerouslySetInnerHTML={{
                    __html: line.content || " ",
                  }}
                />
                {line.difference && (
                  <span className="inline-block ml-2 text-xs px-2 py-1 rounded bg-black/10 dark:bg-white/10 whitespace-nowrap">
                    {line.difference.type.toUpperCase()}: {line.difference.path}
                  </span>
                )}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Function to find line numbers for specific keys in JSON
const findLineNumbers = (
  json: string,
  paths: string[]
): { [path: string]: number } => {
  const lines = json.split("\n");
  const lineNumbers: { [path: string]: number } = {};

  paths.forEach((path) => {
    const keys = path.split(".");
    const lastKey = keys[keys.length - 1];

    // Find the line containing this key with more precision
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // Look for the exact key pattern: "key":
      const keyPattern = new RegExp(`"${lastKey}"\\s*:`);
      if (keyPattern.test(line)) {
        lineNumbers[path] = i + 1;
        break;
      }
    }
  });

  return lineNumbers;
};

interface ComparisonResult {
  missing: { key: string; path: string; value: JSONValue }[];
  added: { key: string; path: string; value: JSONValue }[];
  modified: {
    key: string;
    path: string;
    oldValue: JSONValue;
    newValue: JSONValue;
  }[];
  matching: { key: string; path: string; value: JSONValue }[];
}

// Deep comparison function
const compareObjects = (
  obj1: JSONValue | undefined,
  obj2: JSONValue | undefined,
  path = ""
): ComparisonResult => {
  const result: ComparisonResult = {
    missing: [],
    added: [],
    modified: [],
    matching: [],
  };

  const allKeys = new Set([
    ...(obj1 && typeof obj1 === "object" && !Array.isArray(obj1)
      ? Object.keys(obj1)
      : []),
    ...(obj2 && typeof obj2 === "object" && !Array.isArray(obj2)
      ? Object.keys(obj2)
      : []),
  ]);

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const hasInObj1 =
      obj1 &&
      typeof obj1 === "object" &&
      !Array.isArray(obj1) &&
      key in (obj1 as object);
    const hasInObj2 =
      obj2 &&
      typeof obj2 === "object" &&
      !Array.isArray(obj2) &&
      key in (obj2 as object);

    if (hasInObj1 && !hasInObj2) {
      result.missing.push({
        key,
        path: currentPath,
        value: obj1[key],
      });
    } else if (!hasInObj1 && hasInObj2) {
      result.added.push({ key, path: currentPath, value: obj2[key] });
    } else if (hasInObj1 && hasInObj2) {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (
        typeof val1 === "object" &&
        typeof val2 === "object" &&
        val1 !== null &&
        val2 !== null &&
        !Array.isArray(val1) &&
        !Array.isArray(val2)
      ) {
        const nestedResult = compareObjects(
          val1 as JSONValue,
          val2 as JSONValue,
          currentPath
        );
        result.missing.push(...nestedResult.missing);
        result.added.push(...nestedResult.added);
        result.modified.push(...nestedResult.modified);
        result.matching.push(...nestedResult.matching);
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        result.modified.push({
          key,
          path: currentPath,
          oldValue: val1,
          newValue: val2,
        });
      } else {
        result.matching.push({ key, path: currentPath, value: val1 });
      }
    }
  }

  return result;
};

// Enhanced comparison function with line number tracking
const compareObjectsWithLines = (
  obj1: JSONValue | undefined,
  obj2: JSONValue | undefined,
  leftJSON: string,
  rightJSON: string
): ComparisonResult & {
  leftLines: { [path: string]: number };
  rightLines: { [path: string]: number };
} => {
  const result = compareObjects(obj1, obj2);

  // Get all paths that have differences
  const allPaths = [
    ...result.missing.map((item) => item.path),
    ...result.added.map((item) => item.path),
    ...result.modified.map((item) => item.path),
    ...result.matching.map((item) => item.path),
  ];

  const leftLines = findLineNumbers(leftJSON, allPaths);
  const rightLines = findLineNumbers(rightJSON, allPaths);

  return {
    ...result,
    leftLines,
    rightLines,
  };
};

export default function JSONCompareClient() {
  const [leftJSON, setLeftJSON] = useState("");
  const [rightJSON, setRightJSON] = useState("");
  const [comparisonResult, setComparisonResult] = useState<
    | (ComparisonResult & {
        leftLines: { [path: string]: number };
        rightLines: { [path: string]: number };
      })
    | null
  >(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [leftLineWrap, setLeftLineWrap] = useState(false);
  const [rightLineWrap, setRightLineWrap] = useState(false);
  const [leftEditMode, setLeftEditMode] = useState(true);
  const [rightEditMode, setRightEditMode] = useState(true);
  const [leftDifferenceLines, setLeftDifferenceLines] = useState<
    {
      lineNumber: number;
      type: "missing" | "added" | "modified" | "matching";
      key: string;
      path: string;
    }[]
  >([]);
  const [rightDifferenceLines, setRightDifferenceLines] = useState<
    {
      lineNumber: number;
      type: "missing" | "added" | "modified" | "matching";
      key: string;
      path: string;
    }[]
  >([]);

  const compareJSON = () => {
    try {
      const parsedLeft = JSON.parse(leftJSON) as JSONValue;
      const parsedRight = JSON.parse(rightJSON) as JSONValue;

      const result = compareObjectsWithLines(
        parsedLeft,
        parsedRight,
        leftJSON,
        rightJSON
      );
      setComparisonResult(result);

      // Calculate line differences for highlighting
      const leftLines: typeof leftDifferenceLines = [];
      const rightLines: typeof rightDifferenceLines = [];

      // Missing items (in left, not in right)
      result.missing.forEach((item) => {
        const lineNum = result.leftLines[item.path];
        if (lineNum) {
          leftLines.push({
            lineNumber: lineNum,
            type: "missing",
            key: item.key,
            path: item.path,
          });
        }
      });

      // Added items (in right, not in left)
      result.added.forEach((item) => {
        const lineNum = result.rightLines[item.path];
        if (lineNum) {
          rightLines.push({
            lineNumber: lineNum,
            type: "added",
            key: item.key,
            path: item.path,
          });
        }
      });

      // Modified items (different in both)
      result.modified.forEach((item) => {
        const leftLineNum = result.leftLines[item.path];
        const rightLineNum = result.rightLines[item.path];
        if (leftLineNum) {
          leftLines.push({
            lineNumber: leftLineNum,
            type: "modified",
            key: item.key,
            path: item.path,
          });
        }
        if (rightLineNum) {
          rightLines.push({
            lineNumber: rightLineNum,
            type: "modified",
            key: item.key,
            path: item.path,
          });
        }
      });

      // Matching items
      result.matching.forEach((item) => {
        const leftLineNum = result.leftLines[item.path];
        const rightLineNum = result.rightLines[item.path];
        if (leftLineNum) {
          leftLines.push({
            lineNumber: leftLineNum,
            type: "matching",
            key: item.key,
            path: item.path,
          });
        }
        if (rightLineNum) {
          rightLines.push({
            lineNumber: rightLineNum,
            type: "matching",
            key: item.key,
            path: item.path,
          });
        }
      });

      setLeftDifferenceLines(leftLines);
      setRightDifferenceLines(rightLines);
      setError("");
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
      setComparisonResult(null);
      setLeftDifferenceLines([]);
      setRightDifferenceLines([]);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (side === "left") {
          setLeftJSON(content);
        } else {
          setRightJSON(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const copyResults = async () => {
    if (!comparisonResult) return;

    const results = `JSON Comparison Results:

Missing in Right (${comparisonResult.missing.length}):
${comparisonResult.missing
  .map((item) => `- ${item.path}: ${JSON.stringify(item.value)}`)
  .join("\n")}

Added in Right (${comparisonResult.added.length}):
${comparisonResult.added
  .map((item) => `+ ${item.path}: ${JSON.stringify(item.value)}`)
  .join("\n")}

Modified (${comparisonResult.modified.length}):
${comparisonResult.modified
  .map(
    (item) =>
      `~ ${item.path}: ${JSON.stringify(item.oldValue)} → ${JSON.stringify(
        item.newValue
      )}`
  )
  .join("\n")}

Matching (${comparisonResult.matching.length}):
${comparisonResult.matching
  .map((item) => `= ${item.path}: ${JSON.stringify(item.value)}`)
  .join("\n")}
`;

    await navigator.clipboard.writeText(results);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResults = () => {
    if (!comparisonResult) return;

    const results = {
      summary: {
        missing: comparisonResult.missing.length,
        added: comparisonResult.added.length,
        modified: comparisonResult.modified.length,
        matching: comparisonResult.matching.length,
      },
      details: comparisonResult,
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "json-comparison-results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setLeftJSON("");
    setRightJSON("");
    setComparisonResult(null);
    setError("");
  };

  const loadSampleData = () => {
    const leftSample = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming"],
  "isActive": true,
  "metadata": {
    "createdAt": "2024-01-01T00:00:00Z",
    "version": "1.0"
  }
}`;

    const rightSample = `{
  "name": "John Doe",
  "age": 31,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "country": "USA"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true,
  "metadata": {
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-06-01T00:00:00Z",
    "version": "2.0"
  },
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}`;

    setLeftJSON(leftSample);
    setRightJSON(rightSample);
    setComparisonResult(null);
    setError("");
  };

  const formatValue = (value: JSONValue) => {
    if (typeof value === "string") return `"${value}"`;
    return JSON.stringify(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">JSON Compare Tool</h1>
        <p className="text-xl text-muted-foreground">
          Compare two JSON objects to find differences, missing keys, and
          similarities
        </p>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload JSON Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Left JSON File</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".json,.txt"
                  onChange={(e) => handleFileUpload(e, "left")}
                  className="flex-1"
                  id="left-file-upload"
                />
                <Label htmlFor="left-file-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      Choose
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Right JSON File</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".json,.txt"
                  onChange={(e) => handleFileUpload(e, "right")}
                  className="flex-1"
                  id="right-file-upload"
                />
                <Label htmlFor="right-file-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      Choose
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={loadSampleData}>
              Load Sample Data
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left JSON Panel */}
        <Card className="flex flex-col h-[80vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Left JSON
              </CardTitle>
            </div>
            {leftJSON && (
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <WrapText className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="left-line-wrap" className="text-sm">
                    Line Wrap
                  </Label>
                  <Switch
                    id="left-line-wrap"
                    checked={leftLineWrap}
                    onCheckedChange={setLeftLineWrap}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="left-edit-mode" className="text-sm">
                    Edit Mode
                  </Label>
                  <Switch
                    id="left-edit-mode"
                    checked={leftEditMode}
                    onCheckedChange={setLeftEditMode}
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full border rounded-lg overflow-auto bg-background">
              {leftJSON ? (
                <JSONHighlighter
                  json={leftJSON}
                  lineWrap={leftLineWrap}
                  differenceLines={leftDifferenceLines}
                  isEditMode={leftEditMode}
                  onTextChange={setLeftJSON}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Textarea
                    placeholder="Paste your first JSON here..."
                    value={leftJSON}
                    onChange={(e) => setLeftJSON(e.target.value)}
                    className="font-mono text-sm h-full resize-none border-0 focus-visible:ring-0"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right JSON Panel */}
        <Card className="flex flex-col h-[80vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Right JSON
              </CardTitle>
            </div>
            {rightJSON && (
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <WrapText className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="right-line-wrap" className="text-sm">
                    Line Wrap
                  </Label>
                  <Switch
                    id="right-line-wrap"
                    checked={rightLineWrap}
                    onCheckedChange={setRightLineWrap}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="right-edit-mode" className="text-sm">
                    Edit Mode
                  </Label>
                  <Switch
                    id="right-edit-mode"
                    checked={rightEditMode}
                    onCheckedChange={setRightEditMode}
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full border rounded-lg overflow-auto bg-background scrollbar-hide">
              {rightJSON ? (
                <JSONHighlighter
                  json={rightJSON}
                  lineWrap={rightLineWrap}
                  differenceLines={rightDifferenceLines}
                  isEditMode={rightEditMode}
                  onTextChange={setRightJSON}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Textarea
                    placeholder="Paste your second JSON here..."
                    value={rightJSON}
                    onChange={(e) => setRightJSON(e.target.value)}
                    className="font-mono text-sm h-full resize-none border-0 focus-visible:ring-0"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center">
        <Button
          onClick={compareJSON}
          size="lg"
          disabled={!leftJSON.trim() || !rightJSON.trim()}
          className="px-8"
        >
          <GitCompare className="w-5 h-5 mr-2" />
          Compare JSON
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Comparison Results */}
      {comparisonResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <GitCompare className="w-5 h-5 mr-2" />
                Comparison Results
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyResults}>
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy Results"}
                </Button>
                <Button variant="outline" size="sm" onClick={downloadResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {comparisonResult.missing.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Missing in Right
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {comparisonResult.added.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Added in Right
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {comparisonResult.modified.length}
                </div>
                <div className="text-sm text-muted-foreground">Modified</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {comparisonResult.matching.length}
                </div>
                <div className="text-sm text-muted-foreground">Matching</div>
              </div>
            </div>

            {/* Detailed Results */}
            <Tabs defaultValue="missing" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="missing"
                  className="flex items-center gap-2"
                >
                  <Minus className="w-4 h-4" />
                  Missing ({comparisonResult.missing.length})
                </TabsTrigger>
                <TabsTrigger value="added" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Added ({comparisonResult.added.length})
                </TabsTrigger>
                <TabsTrigger
                  value="modified"
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Modified ({comparisonResult.modified.length})
                </TabsTrigger>
                <TabsTrigger
                  value="matching"
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Matching ({comparisonResult.matching.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="missing"
                className="space-y-2 max-h-96 overflow-y-auto"
              >
                {comparisonResult.missing.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No missing keys found
                  </p>
                ) : (
                  comparisonResult.missing.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500"
                    >
                      <div>
                        <Badge variant="destructive" className="mb-1">
                          Missing
                        </Badge>
                        <div className="font-mono text-sm font-medium">
                          {item.path}
                          <span className="text-xs text-muted-foreground ml-2">
                            (Line{" "}
                            {comparisonResult.leftLines[item.path] ||
                              comparisonResult.rightLines[item.path] ||
                              "N/A"}
                            )
                          </span>
                        </div>
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        {formatValue(item.value)}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent
                value="added"
                className="space-y-2 max-h-96 overflow-y-auto"
              >
                {comparisonResult.added.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No added keys found
                  </p>
                ) : (
                  comparisonResult.added.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500"
                    >
                      <div>
                        <Badge className="mb-1 bg-green-600">Added</Badge>
                        <div className="font-mono text-sm font-medium">
                          {item.path}
                          <span className="text-xs text-muted-foreground ml-2">
                            (Line{" "}
                            {comparisonResult.leftLines[item.path] ||
                              comparisonResult.rightLines[item.path] ||
                              "N/A"}
                            )
                          </span>
                        </div>
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        {formatValue(item.value)}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent
                value="modified"
                className="space-y-2 max-h-96 overflow-y-auto"
              >
                {comparisonResult.modified.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No modified keys found
                  </p>
                ) : (
                  comparisonResult.modified.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className="border-yellow-500 text-yellow-700"
                        >
                          Modified
                        </Badge>
                        <div className="font-mono text-sm font-medium">
                          {item.path}
                          <span className="text-xs text-muted-foreground ml-2">
                            (Line{" "}
                            {comparisonResult.leftLines[item.path] ||
                              comparisonResult.rightLines[item.path] ||
                              "N/A"}
                            )
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-red-600 font-medium">
                            - Old:{" "}
                          </span>
                          <span className="font-mono">
                            {formatValue(item.oldValue)}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-600 font-medium">
                            + New:{" "}
                          </span>
                          <span className="font-mono">
                            {formatValue(item.newValue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent
                value="matching"
                className="space-y-2 max-h-96 overflow-y-auto"
              >
                {comparisonResult.matching.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No matching keys found
                  </p>
                ) : (
                  comparisonResult.matching.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500"
                    >
                      <div>
                        <Badge
                          variant="outline"
                          className="mb-1 border-blue-500 text-blue-700"
                        >
                          Matching
                        </Badge>
                        <div className="font-mono text-sm font-medium">
                          {item.path}
                          <span className="text-xs text-muted-foreground ml-2">
                            (Line{" "}
                            {comparisonResult.leftLines[item.path] ||
                              comparisonResult.rightLines[item.path] ||
                              "N/A"}
                            )
                          </span>
                        </div>
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        {formatValue(item.value)}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Features Info */}
      <BenefitsSection
        cardOneIcon="🔍"
        cardOneTitle="Deep Comparison"
        cardOneDescription="Analyzes nested objects and arrays to find all differences at any
              level"
        cardTwoIcon="📊"
        cardTwoTitle="Detailed Analysis"
        cardTwoDescription="Shows missing, added, modified, and matching keys with full path
              information"
        cardThreeIcon="💾"
        cardThreeTitle="Export Results"
        cardThreeDescription="Copy or download comparison results in structured format for
              further analysis"
      />
    </div>
  );
}
