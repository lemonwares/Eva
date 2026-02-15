import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";
import { emailTemplates } from "@/templates/templateLoader";
import { contactSchema, formatValidationErrors } from "@/lib/validations";
import {
  checkRateLimit,
  getRateLimitIdentifier,
  rateLimitResponse,
  rateLimitPresets,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 submissions per hour
    const identifier = getRateLimitIdentifier(request);
    const rateCheck = checkRateLimit(
      `contact:${identifier}`,
      rateLimitPresets.contact,
    );
    if (!rateCheck.success) return rateLimitResponse(rateCheck);

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          errors: formatValidationErrors(parsed.error.issues),
        },
        { status: 400 },
      );
    }
    const { name, email, message } = parsed.data;

    // Generate reference ID for tracking
    const referenceId = `EVA-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Send notification email to support team
    const supportEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Reference ID:</strong> ${referenceId}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-left: 4px solid #6366f1; margin: 10px 0;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          Please respond to this inquiry within 24 hours.
        </p>
      </div>
    `;

    // Send confirmation email to user using the template
    const confirmationEmailHtml = emailTemplates.contactSupport(
      name,
      message,
      referenceId,
      `${process.env.AUTH_URL}/dashboard`,
      `${process.env.AUTH_URL}/faq`,
      `${process.env.AUTH_URL}/terms`,
      `${process.env.AUTH_URL}/privacy`,
    );

    // Send both emails
    const [supportEmailResult, confirmationEmailResult] = await Promise.all([
      sendEmail({
        to: process.env.ZEPTOMAIL_SUPPORT_EMAIL || "hello@evalocal.com",
        subject: `New Contact Form Submission - ${referenceId}`,
        html: supportEmailHtml,
      }),
      sendEmail({
        to: email,
        subject: "We've received your message - EVA Support",
        html: confirmationEmailHtml,
      }),
    ]);

    // Check if emails were sent successfully
    if (!supportEmailResult.success || !confirmationEmailResult.success) {
      logger.error("Email sending failed:", {
        support: supportEmailResult,
        confirmation: confirmationEmailResult,
      });

      return NextResponse.json(
        {
          error:
            "Failed to send emails. Please try again or contact us directly.",
          referenceId,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
      referenceId,
    });
  } catch (error) {
    logger.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
