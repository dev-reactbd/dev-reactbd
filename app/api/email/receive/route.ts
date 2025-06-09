import { type NextRequest, NextResponse } from "next/server";

// In-memory storage for demo (use database in production)
const emailAddresses = new Map<
  string,
  {
    created: Date;
    expires: Date;
    emails: any[];
  }
>();

// This endpoint would be called by your mail server when an email is received
export async function POST(request: NextRequest) {
  try {
    const emailData = await request.json();

    const { to, from, subject, body, html, attachments } = emailData;

    // Find the recipient email address
    const recipientData = emailAddresses.get(to);

    if (!recipientData) {
      return NextResponse.json(
        { error: "Email address not found" },
        { status: 404 }
      );
    }

    // Check if email address has expired
    if (new Date() > recipientData.expires) {
      emailAddresses.delete(to);
      return NextResponse.json(
        { error: "Email address expired" },
        { status: 410 }
      );
    }

    // Add the email to the inbox
    const newEmail = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      from,
      subject,
      body,
      html,
      timestamp: new Date(),
      isRead: false,
      attachments: attachments || [],
    };

    recipientData.emails.unshift(newEmail);

    // Keep only the last 50 emails
    if (recipientData.emails.length > 50) {
      recipientData.emails = recipientData.emails.slice(0, 50);
    }

    console.log(`Received email for ${to} from ${from}: ${subject}`);

    return NextResponse.json({ success: true, emailId: newEmail.id });
  } catch (error) {
    console.error("Error receiving email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
