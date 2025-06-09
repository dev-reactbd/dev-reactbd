"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  RefreshCw,
  Mail,
  Trash2,
  User,
  ChevronDown,
  Eye,
  Download,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  html?: string;
  timestamp: Date | string;
  isRead: boolean;
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}

const domains = ["reactbd.org", "temp.reactbd.org", "mail.reactbd.org"];

export default function EmailFakerClient() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(domains[0]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Generate random email on mount
  useEffect(() => {
    generateNewEmail();
  }, [selectedDomain]);

  // Auto refresh emails every 5 seconds
  useEffect(() => {
    if (!autoRefresh || !currentEmail) return;

    const interval = setInterval(() => {
      fetchEmails();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, currentEmail]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateNewEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    const newEmail = `${randomString}@${selectedDomain}`;
    setCurrentEmail(newEmail);
    setEmails([]); // Clear emails when generating new address
    setSelectedEmail(null);
    setTimeLeft(600); // Reset timer

    // Create the email address on the server
    createEmailAddress(newEmail);
  };

  const createEmailAddress = async (email: string) => {
    try {
      const response = await fetch("/api/email/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to create email address");
      }

      toast.success("Email address created successfully!", {
        description: `Your temporary email ${email} is ready to use`,
      });
    } catch (error) {
      console.error("Error creating email address:", error);
      toast.error("Failed to create email address", {
        description: "Please try again or refresh the page",
      });
    }
  };

  const fetchEmails = async () => {
    if (!currentEmail) return;

    try {
      const response = await fetch(
        `/api/email/inbox?email=${encodeURIComponent(currentEmail)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch emails");
      }

      const data = await response.json();
      const transformedEmails = (data.emails || []).map((email: any) => ({
        ...email,
        timestamp: new Date(email.timestamp || email.received_at || Date.now()),
      }));

      // Check if we have new emails
      if (transformedEmails.length > emails.length) {
        const newEmailCount = transformedEmails.length - emails.length;
        toast.success(
          `${newEmailCount} new email${newEmailCount > 1 ? "s" : ""} received!`,
          {
            description: "Check your inbox for new messages",
          }
        );
      }

      setEmails(transformedEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast.error("Failed to fetch emails", {
        description: "Unable to check for new messages",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentEmail);
      toast.success("Email address copied!", {
        description: "The email address has been copied to your clipboard",
      });
    } catch (err) {
      toast.error("Failed to copy email address", {
        description: "Please try selecting and copying manually",
      });
    }
  };

  const refreshEmails = async () => {
    setIsRefreshing(true);
    await fetchEmails();
    setIsRefreshing(false);
    toast.success("Inbox refreshed", {
      description: "Your inbox has been updated with the latest emails",
    });
  };

  const deleteEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/email/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailId, address: currentEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete email");
      }

      setEmails((prev) => prev.filter((email) => email.id !== emailId));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }

      toast.success("Email deleted", {
        description: "The email has been permanently removed",
      });
    } catch (error) {
      console.error("Error deleting email:", error);
      toast.error("Failed to delete email", {
        description: "Please try again",
      });
    }
  };

  const markAsRead = async (emailId: string) => {
    try {
      await fetch(`/api/email/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailId, address: currentEmail }),
      });

      setEmails((prev) =>
        prev.map((email) =>
          email.id === emailId ? { ...email, isRead: true } : email
        )
      );
    } catch (error) {
      console.error("Error marking email as read:", error);
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return dateObj.toLocaleDateString();
  };

  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Setup Status */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Setup Status:</strong> This temporary email service is
            powered by your reactbd.org domain. Follow the setup guide to enable
            real email reception via Cloudflare Email Routing.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email Generator & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Your Temporary Email
                </CardTitle>
                <CardDescription>
                  Powered by reactbd.org • Expires in {formatTimeLeft(timeLeft)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={currentEmail}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    size="icon"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        @{selectedDomain}
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {domains.map((domain) => (
                        <DropdownMenuItem
                          key={domain}
                          onClick={() => setSelectedDomain(domain)}
                        >
                          @{domain}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={generateNewEmail} variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={refreshEmails}
                  disabled={isRefreshing}
                  className="w-full"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing..." : "Check for new emails"}
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    • Send emails to:{" "}
                    <span className="font-mono">{currentEmail}</span>
                  </p>
                  <p>• Emails will appear automatically</p>
                  <p>• Auto-refresh every 5 seconds</p>
                  <p>• Powered by Cloudflare Email Routing</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {emails.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Emails</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {emails.filter((e) => !e.isRead).length}
                    </div>
                    <div className="text-sm text-gray-500">Unread</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email List */}
          <div className="lg:col-span-1">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Inbox ({emails.length})</span>
                  <Badge variant={autoRefresh ? "default" : "secondary"}>
                    Auto-refresh {autoRefresh ? "ON" : "OFF"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {emails.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                      <Mail className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-center font-medium">No emails yet</p>
                      <p className="text-sm text-center mt-2">
                        Send an email to:
                      </p>
                      <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                        {currentEmail}
                      </p>
                      <p className="text-xs text-center mt-2 text-gray-400">
                        It will appear here automatically
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {emails.map((email) => (
                        <div
                          key={email.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !email.isRead
                              ? "bg-blue-50 border-l-4 border-l-blue-500"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedEmail(email);
                            markAsRead(email.id);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {email.from}
                                </p>
                                {!email.isRead && (
                                  <Badge variant="default" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 truncate mt-1">
                                {email.subject}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTime(email.timestamp)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEmail(email.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Email Content */}
          <div className="lg:col-span-1">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Email Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEmail ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">From:</div>
                      <div className="font-medium">{selectedEmail.from}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Subject:</div>
                      <div className="font-medium">{selectedEmail.subject}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date:</div>
                      <div className="text-sm">
                        {new Date(selectedEmail.timestamp).toLocaleString()}
                      </div>
                    </div>
                    {selectedEmail.attachments &&
                      selectedEmail.attachments.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-500">
                            Attachments:
                          </div>
                          <div className="space-y-1">
                            {selectedEmail.attachments.map(
                              (attachment, index) => (
                                <div
                                  key={index}
                                  className="text-sm bg-gray-100 p-2 rounded"
                                >
                                  {attachment.filename} (
                                  {(attachment.size / 1024).toFixed(1)} KB)
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    <Separator />
                    <ScrollArea className="h-[300px]">
                      {selectedEmail.html ? (
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: selectedEmail.html,
                          }}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {selectedEmail.body}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast.success("Download started", {
                            description:
                              "Email content is being prepared for download",
                          });
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEmail(selectedEmail.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Mail className="h-12 w-12 mb-4 opacity-50" />
                    <p>Select an email to view its content</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
