"use client";

import { useState, useMemo } from "react";
import { Check, X, AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ValidationError {
  line: number;
  column: number;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  message: string;
  details?: string;
  error?: ValidationError;
}

// JSON Syntax Highlighter with Line Numbers
const JSONHighlighter = ({
  json,
  errorLine,
}: {
  json: string;
  errorLine?: number;
}) => {
  const highlightedLines = useMemo(() => {
    if (!json) return [];

    const lines = json.split("\n");

    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const isErrorLine = errorLine === lineNumber;

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
        isError: isErrorLine,
        raw: line,
      };
    });
  }, [json, errorLine]);

  return (
    <div className="relative">
      <div className="flex text-sm font-mono">
        {/* Line Numbers */}
        <div className="flex-shrink-0 w-12 bg-muted/50 border-r border-border text-right pr-2 py-2 text-muted-foreground select-none">
          {highlightedLines.map((line) => (
            <div
              key={line.number}
              className={`leading-6 ${
                line.isError
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold"
                  : ""
              }`}
            >
              {line.number}
            </div>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-x-auto">
          <pre className="p-2 leading-6">
            {highlightedLines.map((line) => (
              <div
                key={line.number}
                className={`${
                  line.isError
                    ? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 pl-2 -ml-2"
                    : ""
                }`}
              >
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

// Enhanced JSON parser with detailed error information
const parseJSONWithDetails = (jsonString: string): ValidationResult => {
  if (!jsonString.trim()) {
    return {
      valid: false,
      message: "Please enter JSON to validate",
    };
  }

  try {
    JSON.parse(jsonString);
    return {
      valid: true,
      message: "Valid JSON! ✅",
      details: "Your JSON syntax is correct and can be parsed successfully.",
    };
  } catch (err) {
    const error = err as Error;
    const errorMessage = error.message;

    // Extract line and column information from error message
    let line = 1;
    let column = 1;

    // Try to extract position from different error message formats
    const positionMatch = errorMessage.match(/at position (\d+)/);
    const lineColumnMatch = errorMessage.match(/line (\d+) column (\d+)/);

    if (lineColumnMatch) {
      line = Number.parseInt(lineColumnMatch[1], 10);
      column = Number.parseInt(lineColumnMatch[2], 10);
    } else if (positionMatch) {
      const position = Number.parseInt(positionMatch[1], 10);
      const lines = jsonString.substring(0, position).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else {
      // Try to find the error position by parsing character by character
      const chars = jsonString.split("");
      let currentLine = 1;
      let currentColumn = 1;

      for (let i = 0; i < chars.length; i++) {
        try {
          JSON.parse(jsonString.substring(0, i + 1));
        } catch {
          // Continue until we find where it breaks
        }

        if (chars[i] === "\n") {
          currentLine++;
          currentColumn = 1;
        } else {
          currentColumn++;
        }
      }

      line = currentLine;
      column = currentColumn;
    }

    return {
      valid: false,
      message: "Invalid JSON",
      details: errorMessage,
      error: {
        line,
        column,
        message: errorMessage,
      },
    };
  }
};

export default function JSONValidatorClient() {
  const [inputJSON, setInputJSON] = useState("");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const validateJSON = () => {
    const result = parseJSONWithDetails(inputJSON);
    setValidationResult(result);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(inputJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearInput = () => {
    setInputJSON("");
    setValidationResult(null);
  };

  const loadSampleJSON = () => {
    const sample = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true
}`;
    setInputJSON(sample);
    setValidationResult(null);
  };

  const loadInvalidSampleJSON = () => {
    const sample = `{
  'name': "John Doe", // This has single quotes and comments
  "age": 30,
  "email": 'john@example.com',
  address: { // Unquoted key
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true,
  "status": undefined, // undefined value
}`;
    setInputJSON(sample);
    setValidationResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">JSON Validator</h1>
        <p className="text-xl text-muted-foreground">
          Validate your JSON syntax and get detailed error information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>JSON Input</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSampleJSON}>
                  Valid Sample
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadInvalidSampleJSON}
                >
                  Invalid Sample
                </Button>
                {inputJSON && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearInput}>
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <Textarea
                placeholder="Paste your JSON here to validate..."
                value={inputJSON}
                onChange={(e) => setInputJSON(e.target.value)}
                className="font-mono text-sm h-full resize-none"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={validateJSON}
                className="flex-1"
                size="lg"
                disabled={!inputJSON.trim()}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Validate JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Validation Result</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {validationResult && (
              <div className="space-y-4 h-full flex flex-col">
                <Alert
                  variant={validationResult.valid ? "default" : "destructive"}
                >
                  {validationResult.valid ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {validationResult.message}
                      </p>
                      {validationResult.details && (
                        <p className="text-sm">{validationResult.details}</p>
                      )}
                      {validationResult.error && (
                        <div className="text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded border-l-4 border-red-500">
                          <p className="font-medium text-red-800 dark:text-red-200">
                            Error at Line {validationResult.error.line}, Column{" "}
                            {validationResult.error.column}
                          </p>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>

                {inputJSON && (
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full border rounded-lg overflow-auto bg-background">
                      <JSONHighlighter
                        json={inputJSON}
                        errorLine={validationResult.error?.line}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {!validationResult && inputJSON && (
              <div className="h-full border rounded-lg overflow-auto bg-background">
                <JSONHighlighter json={inputJSON} />
              </div>
            )}

            {!inputJSON && (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground border-2 border-dashed border-muted rounded-lg">
                <div>
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-lg font-medium mb-2">
                    JSON validation will appear here
                  </p>
                  <p className="text-sm">
                    Paste JSON in the input area and click &quot;Validate
                    JSON&quot;
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Validation Tips */}
      <Card>
        <CardHeader>
          <CardTitle>JSON Validation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Common JSON Rules:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use double quotes for strings</li>
                <li>• No trailing commas allowed</li>
                <li>• Property names must be quoted</li>
                <li>• No comments allowed in JSON</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Quick Fix Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Removes trailing commas automatically</li>
                <li>• Converts single quotes to double quotes</li>
                <li>• Adds quotes around unquoted keys</li>
                <li>• Replaces undefined with null</li>
                <li>• Removes JavaScript comments</li>
                <li>• Fixes missing/extra commas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
