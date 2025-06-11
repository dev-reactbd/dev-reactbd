"use client";

import { useState, useMemo } from "react";
import {
  Download,
  Copy,
  FileSpreadsheet,
  X,
  Table,
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

// CSV Highlighter with Line Numbers
const CSVHighlighter = ({
  csv,
  lineWrap,
}: {
  csv: string;
  lineWrap: boolean;
}) => {
  const highlightedLines = useMemo(() => {
    if (!csv) return [];

    const lines = csv.split("\n");
    const isHeader = (index: number) => index === 0;

    return lines.map((line, index) => {
      const lineNumber = index + 1;

      // Highlight CSV - headers in blue, values in different colors
      const highlightedLine = isHeader(index)
        ? `<span class="text-blue-600 dark:text-blue-400 font-medium">${line}</span>`
        : line
            .split(",")
            .map((cell, i) => {
              // Alternate colors for better readability
              const colorClass =
                i % 2 === 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-purple-600 dark:text-purple-400";
              return `<span class="${colorClass}">${cell}</span>`;
            })
            .join('<span class="text-gray-600 dark:text-gray-400">,</span>');

      return {
        number: lineNumber,
        content: highlightedLine,
        raw: line,
      };
    });
  }, [csv]);

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

export default function JSONToCSVClient() {
  const [inputJSON, setInputJSON] = useState("");
  const [csvData, setCsvData] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [inputLineWrap, setInputLineWrap] = useState(false);
  const [outputLineWrap, setOutputLineWrap] = useState(false);

  const convertToCSV = () => {
    try {
      const parsed = JSON.parse(inputJSON);

      if (!Array.isArray(parsed)) {
        setError("JSON must be an array of objects to convert to CSV");
        setCsvData("");
        setPreviewData([]);
        return;
      }

      if (parsed.length === 0) {
        setError("JSON array is empty");
        setCsvData("");
        setPreviewData([]);
        return;
      }

      // Get all unique keys from all objects
      const allKeys = new Set<string>();
      parsed.forEach((obj) => {
        if (typeof obj === "object" && obj !== null) {
          Object.keys(obj).forEach((key) => allKeys.add(key));
        }
      });

      const headers = Array.from(allKeys);

      // Create CSV content
      const csvRows = [
        headers.join(","), // Header row
        ...parsed.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              // Handle different data types
              if (value === null || value === undefined) {
                return "";
              }
              if (typeof value === "string") {
                // Escape quotes and wrap in quotes if contains comma, quote, or newline
                const escaped = value.replace(/"/g, '""');
                return /[",\n\r]/.test(value) ? `"${escaped}"` : escaped;
              }
              if (typeof value === "object") {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
              }
              return String(value);
            })
            .join(",")
        ),
      ];

      setCsvData(csvRows.join("\n"));
      setPreviewData(parsed.slice(0, 5)); // Show first 5 rows for preview
      setError("");
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
      setCsvData("");
      setPreviewData([]);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(csvData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearInput = () => {
    setInputJSON("");
    setCsvData("");
    setError("");
    setPreviewData([]);
  };

  const loadSampleJSON = () => {
    const sample = `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "city": "New York",
    "description": "A software engineer with 5+ years of experience in full-stack development, specializing in React and Node.js applications."
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25,
    "city": "Los Angeles",
    "description": "Product manager passionate about user experience and data-driven decision making in the tech industry."
  },
  {
    "id": 3,
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "age": 35,
    "city": "Chicago",
    "description": "Senior data scientist with expertise in machine learning, statistical analysis, and business intelligence solutions."
  },
  {
    "id": 4,
    "name": "Alice Williams",
    "email": "alice@example.com",
    "age": 28,
    "city": "Boston",
    "description": "UX/UI designer focused on creating intuitive and accessible digital experiences for web and mobile platforms."
  },
  {
    "id": 5,
    "name": "Charlie Brown",
    "email": "charlie@example.com",
    "age": 32,
    "city": "San Francisco",
    "description": "DevOps engineer specializing in cloud infrastructure, containerization, and continuous integration/deployment pipelines."
  }
]`;
    setInputJSON(sample);
    setCsvData("");
    setError("");
    setPreviewData([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">JSON to CSV Converter</h1>
        <p className="text-xl text-muted-foreground">
          Convert JSON arrays to CSV format for spreadsheets and data analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>JSON Array Input</CardTitle>
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
                  placeholder="Paste your JSON array here..."
                  value={inputJSON}
                  onChange={(e) => setInputJSON(e.target.value)}
                  className="font-mono text-sm h-full resize-none border-0 focus-visible:ring-0"
                />
              )}
            </div>
            <Button
              onClick={convertToCSV}
              className="w-full flex-shrink-0"
              size="lg"
              disabled={!inputJSON.trim()}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Convert to CSV
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>CSV Output</CardTitle>
              {csvData && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              )}
            </div>
            {/* Output Display Options */}
            {csvData && (
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

            {csvData ? (
              <div className="h-full border rounded-lg overflow-auto bg-background">
                <CSVHighlighter csv={csvData} lineWrap={outputLineWrap} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                <div>
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-lg font-medium mb-2">
                    CSV output will appear here
                  </p>
                  <p className="text-sm">
                    Paste a JSON array and click "Convert to CSV"
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Table */}
      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Table className="w-5 h-5 mr-2" />
              Data Preview (First 5 rows)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-muted">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-muted px-4 py-2 text-left font-semibold">
                      #
                    </th>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        className="border border-muted px-4 py-2 text-left font-semibold"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="border border-muted px-4 py-2 font-medium text-muted-foreground">
                        {index + 1}
                      </td>
                      {Object.keys(previewData[0]).map((key) => (
                        <td key={key} className="border border-muted px-4 py-2">
                          {typeof row[key] === "object"
                            ? JSON.stringify(row[key])
                            : String(row[key] || "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      <Alert>
        <AlertDescription>
          <strong>Requirements:</strong> Your JSON must be an array of objects
          with consistent structure. Each object represents a row, and object
          properties become CSV columns.
        </AlertDescription>
      </Alert>

      {/* Use Cases */}
      <BenefitsSection
        cardOneIcon="📈"
        cardOneTitle="Data Analysis"
        cardOneDescription="Import JSON data into Excel, Google Sheets, or other tools"
        cardTwoIcon="📊"
        cardTwoTitle="Reporting"
        cardTwoDescription="Convert API responses to CSV for business reports"
        cardThreeIcon="🔄"
        cardThreeTitle="Data Migration"
        cardThreeDescription="Transform JSON data for database imports and migrations"
      />
    </div>
  );
}
