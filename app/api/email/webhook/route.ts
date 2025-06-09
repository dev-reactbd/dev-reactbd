import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Verify webhook signature from Cloudflare
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("cf-webhook-signature");

    // Verify webhook signature (if configured)
    if (process.env.WEBHOOK_SECRET && signature) {
      if (
        !verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)
      ) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const emailData = JSON.parse(body);

    // Extract email information from Cloudflare webhook
    const {
      to,
      from,
      subject,
      text: textBody,
      html: htmlBody,
      headers,
      attachments = [],
    } = emailData;

    console.log(`Received email for ${to} from ${from}: ${subject}`);

    // Find the recipient email address in database
    const { data: emailAddress, error: findError } = await supabase
      .from("email_addresses")
      .select("*")
      .eq("email", to)
      .eq("is_active", true)
      .single();

    if (findError || !emailAddress) {
      console.log(`Email address not found: ${to}`);
      return NextResponse.json(
        { error: "Email address not found" },
        { status: 404 }
      );
    }

    // Check if email address has expired
    if (new Date() > new Date(emailAddress.expires_at)) {
      // Mark as inactive and don't accept new emails
      await supabase
        .from("email_addresses")
        .update({ is_active: false })
        .eq("id", emailAddress.id);

      console.log(`Email address expired: ${to}`);
      return NextResponse.json(
        { error: "Email address expired" },
        { status: 410 }
      );
    }

    // Insert the email into database
    const { data: newEmail, error: insertError } = await supabase
      .from("emails")
      .insert({
        address_id: emailAddress.id,
        from_address: from,
        subject: subject || "(No Subject)",
        body: textBody || "",
        html_body: htmlBody || "",
        message_id: headers?.["message-id"] || null,
        raw_email: body,
        received_at: new Date().toISOString(),
        is_read: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting email:", insertError);
      return NextResponse.json(
        { error: "Failed to save email" },
        { status: 500 }
      );
    }

    // Handle attachments if present
    if (attachments && attachments.length > 0) {
      const attachmentPromises = attachments.map(async (attachment: any) => {
        return supabase.from("attachments").insert({
          email_id: newEmail.id,
          filename: attachment.filename,
          content_type: attachment.contentType,
          size: attachment.size,
          data: attachment.content, // Base64 encoded content
        });
      });

      await Promise.all(attachmentPromises);
    }

    console.log(`Email saved successfully: ${newEmail.id}`);

    return NextResponse.json({
      success: true,
      emailId: newEmail.id,
      message: "Email received and processed",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({
    status: "Webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
