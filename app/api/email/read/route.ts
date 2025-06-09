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

export async function POST(request: NextRequest) {
  try {
    const { emailId, address } = await request.json();

    if (!emailId || !address) {
      return NextResponse.json(
        { error: "Email ID and address required" },
        { status: 400 }
      );
    }

    const emailData = emailAddresses.get(address);

    if (!emailData) {
      return NextResponse.json(
        { error: "Email address not found" },
        { status: 404 }
      );
    }

    // Mark email as read
    const email = emailData.emails.find((email) => email.id === emailId);
    if (email) {
      email.isRead = true;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking email as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
