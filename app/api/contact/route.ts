import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import { emailTemplates } from "@/public/templates/templateLoader";

const contactSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  subject: z.string().min(1).max(200).optional(),
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

    const {
      name = "Guest",
      email,
      subject = "Support Request",
      message,
      type,
    } = validation.data;

    const referenceId = `EVA-${Date.now().toString(36).toUpperCase()}`;

    // Send confirmation email to user with branded template
    try {
      const userEmailHtml = emailTemplates.contactSupport(
        name,
        message,
        referenceId
      );
      await sendEmail({
        to: email,
        subject: "We've received your message - EVA Support",
        html: userEmailHtml,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if confirmation email fails
    }

    // Send notification email to support team
    try {
      await sendEmail({
        to: process.env.SUPPORT_EMAIL || "hello@eva.com",
        subject: `[${type.toUpperCase()}] ${subject} - ${referenceId}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Reference ID:</strong> ${referenceId}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
          <hr />
          <p><small>Submitted at: ${new Date().toISOString()}</small></p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send support notification:", emailError);
      // Don't fail the request if support email fails
    }

    console.log("Contact form submission processed:", {
      name,
      email,
      subject,
      type,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Thank you for your message. We'll get back to you shortly.",
      referenceId,
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
