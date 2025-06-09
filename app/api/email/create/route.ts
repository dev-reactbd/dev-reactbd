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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address required" },
        { status: 400 }
      );
    }

    // Validate email format and domain
    const allowedDomains = [
      "reactbd.org",
      "temp.reactbd.org",
      "mail.reactbd.org",
    ];
    const domain = email.split("@")[1];

    if (!allowedDomains.includes(domain)) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    // Create email address with 10-minute expiration
    const now = new Date();
    const expires = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    // Try to use Supabase if available, otherwise use in-memory storage
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_ANON_KEY
        );

        const { data, error } = await supabase
          .from("email_addresses")
          .insert({
            email,
            expires_at: expires.toISOString(),
            is_active: true,
          })
          .select()
          .single();

        if (error) {
          throw new Error("Database error");
        }

        console.log(`Created temporary email in database: ${email}`);

        return NextResponse.json({
          success: true,
          email,
          expires: expires.toISOString(),
          id: data.id,
          storage: "database",
        });
      } else {
        throw new Error("Database not configured");
      }
    } catch (dbError) {
      // Fallback to in-memory storage for demo
      console.log("Using in-memory storage for demo:", dbError);

      emailAddresses.set(email, {
        created: now,
        expires,
        emails: [],
      });

      console.log(`Created temporary email in memory: ${email}`);

      return NextResponse.json({
        success: true,
        email,
        expires: expires.toISOString(),
        id: `demo-${Date.now()}`,
        storage: "memory",
      });
    }
  } catch (error) {
    console.error("Error creating email address:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
