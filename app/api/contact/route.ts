import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  type: z
    .enum(["general", "support", "vendor", "partnership"])
    .default("general"),
});

// POST /api/contact - Submit a contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, email, subject, message, type } = validation.data;

    // In production, this would:
    // 1. Save to database
    // 2. Send email notification to support
    // 3. Send confirmation email to user

    // For now, just log it
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      type,
      message: message.substring(0, 100) + "...",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Thank you for your message. We'll get back to you shortly.",
      referenceId: `EVA-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
