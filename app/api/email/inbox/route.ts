import { type NextRequest, NextResponse } from "next/server";

// In-memory storage for demo when database is not available
const emailAddresses = new Map<
  string,
  {
    created: Date;
    expires: Date;
    emails: [];
  }
>();

// Sample emails for demo
const sampleEmails = [
  {
    id: "demo-1",
    from_address: "noreply@github.com",
    subject: "Welcome to GitHub!",
    body: "Thank you for signing up for GitHub. Please verify your email address by clicking the link below.\n\nVerify Email: https://github.com/verify/abc123\n\nIf you didn't create this account, please ignore this email.\n\nBest regards,\nThe GitHub Team",
    html_body: null,
    received_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    is_read: false,
    attachments: [],
  },
  {
    id: "demo-2",
    from_address: "support@netflix.com",
    subject: "Your Netflix trial is ending soon",
    body: "Hi there,\n\nYour Netflix free trial will end in 3 days. To continue enjoying unlimited movies and TV shows, please update your payment method.\n\nUpdate Payment: https://netflix.com/billing\n\nThanks,\nNetflix Team",
    html_body: null,
    received_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_read: true,
    attachments: [],
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email address required" },
        { status: 400 }
      );
    }

    // Try to use Supabase if available
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_ANON_KEY
        );

        // Get email address info
        const { data: emailAddress, error: addressError } = await supabase
          .from("email_addresses")
          .select("*")
          .eq("email", email)
          .single();

        if (addressError || !emailAddress) {
          return NextResponse.json({ emails: [], expired: true });
        }

        // Check if email address has expired
        if (new Date() > new Date(emailAddress.expires_at)) {
          await supabase
            .from("email_addresses")
            .update({ is_active: false })
            .eq("id", emailAddress.id);
          return NextResponse.json({ emails: [], expired: true });
        }

        // Get emails for this address
        const { data: emails, error: emailsError } = await supabase
          .from("emails")
          .select(
            `
            *,
            attachments (*)
          `
          )
          .eq("address_id", emailAddress.id)
          .order("received_at", { ascending: false })
          .limit(50);

        if (emailsError) {
          throw new Error("Database error");
        }

        const transformedEmails =
          emails?.map((email) => ({
            id: email.id,
            from: email.from_address,
            subject: email.subject,
            body: email.body,
            html: email.html_body,
            timestamp: new Date(email.received_at),
            isRead: email.is_read,
            attachments:
              email.attachments?.map((att) => ({
                filename: att.filename,
                contentType: att.content_type,
                size: att.size,
              })) || [],
          })) || [];

        return NextResponse.json({
          emails: transformedEmails,
          expiresAt: emailAddress.expires_at,
          storage: "database",
        });
      } else {
        throw new Error("Database not configured");
      }
    } catch (dbError) {
      // Fallback to in-memory storage with sample emails for demo
      console.log("Using in-memory storage for demo:", dbError);

      const emailData = emailAddresses.get(email);

      if (!emailData) {
        // Create demo data if email exists
        if (
          email.includes("@reactbd.org") ||
          email.includes("@temp.reactbd.org") ||
          email.includes("@mail.reactbd.org")
        ) {
          // Return sample emails for demo
          const transformedEmails = sampleEmails.map((email) => ({
            id: email.id,
            from: email.from_address,
            subject: email.subject,
            body: email.body,
            html: email.html_body,
            timestamp: new Date(email.received_at),
            isRead: email.is_read,
            attachments: email.attachments || [],
          }));

          return NextResponse.json({
            emails: transformedEmails,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            storage: "memory",
          });
        }
        return NextResponse.json({ emails: [], expired: true });
      }

      // Check if email address has expired
      if (new Date() > emailData.expires) {
        emailAddresses.delete(email);
        return NextResponse.json({ emails: [], expired: true });
      }

      // Add sample emails to the stored data if empty
      if (emailData.emails.length === 0) {
        emailData.emails = [...sampleEmails];
      }

      const transformedEmails = emailData.emails.map((email) => ({
        id: email.id,
        from: email.from_address,
        subject: email.subject,
        body: email.body,
        html: email.html_body,
        timestamp: new Date(email.received_at),
        isRead: email.is_read,
        attachments: email.attachments || [],
      }));

      return NextResponse.json({
        emails: transformedEmails,
        expiresAt: emailData.expires.toISOString(),
        storage: "memory",
      });
    }
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
