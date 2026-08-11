import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All form fields (name, email, subject, message) are required." },
        { status: 400 }
      );
    }

    // Backend Email Service Integration Point (e.g. Resend, SendGrid, AWS SES)
    // Example:
    // await sendEmail({ to: siteConfig.supportEmail, from: email, subject, text: message });

    console.log(`[Contact Form Submission] Received message for ${siteConfig.supportEmail}:`, {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact submission received successfully.",
        recipient: siteConfig.supportEmail,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error processing contact submission." },
      { status: 500 }
    );
  }
}
