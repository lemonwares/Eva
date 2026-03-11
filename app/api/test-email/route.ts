import { NextRequest, NextResponse } from "next/server";
import { emailTemplates, sendTemplatedEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

// POST /api/test-email - Send test emails
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, template, name } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email address is required" },
        { status: 400 }
      );
    }

    if (!template) {
      return NextResponse.json(
        { message: "Template type is required" },
        { status: 400 }
      );
    }

    const testName = name || "Test User";
    const testUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/test-link`;

    let emailTemplate;

    switch (template) {
      case "welcome":
        emailTemplate = emailTemplates.welcome(testName);
        break;
      
      case "verifyEmail":
        emailTemplate = emailTemplates.verifyEmail(testName, testUrl);
        break;
      
      case "passwordReset":
        emailTemplate = emailTemplates.passwordReset(testName, testUrl);
        break;
      
      case "newInquiry":
        emailTemplate = emailTemplates.newInquiry(
          testName,
          "John Smith",
          "Wedding Reception",
          "June 15, 2024",
          testUrl
        );
        break;
      
      case "quoteSent":
        emailTemplate = emailTemplates.quoteSent(
          testName,
          "Amazing Catering Co.",
          "£2,500.00",
          testUrl
        );
        break;
      
      case "bookingConfirmed":
        emailTemplate = emailTemplates.bookingConfirmed(
          testName,
          "Amazing Catering Co.",
          "June 15, 2024",
          "Wedding Reception",
          testUrl
        );
        break;
      
      case "reviewRequest":
        emailTemplate = emailTemplates.reviewRequest(
          testName,
          "Amazing Catering Co.",
          testUrl
        );
        break;
      
      default:
        return NextResponse.json(
          { message: "Invalid template type" },
          { status: 400 }
        );
    }

    // Send the email
    const success = await sendTemplatedEmail(email, emailTemplate);

    if (success) {
      logger.info(`Test email sent successfully to ${email} using template: ${template}`);
      return NextResponse.json({
        message: "Test email sent successfully!",
        template,
        recipient: email,
        subject: emailTemplate.subject,
      });
    } else {
      return NextResponse.json(
        { message: "Failed to send test email" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    logger.error("Error sending test email:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/test-email - Get available templates and preview
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const template = searchParams.get("template");
  const preview = searchParams.get("preview") === "true";

  if (preview && template) {
    // Return HTML preview of the template
    const testName = "Test User";
    const testUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/test-link`;

    let emailTemplate;

    switch (template) {
      case "welcome":
        emailTemplate = emailTemplates.welcome(testName);
        break;
      case "verifyEmail":
        emailTemplate = emailTemplates.verifyEmail(testName, testUrl);
        break;
      case "passwordReset":
        emailTemplate = emailTemplates.passwordReset(testName, testUrl);
        break;
      case "newInquiry":
        emailTemplate = emailTemplates.newInquiry(
          testName,
          "John Smith",
          "Wedding Reception",
          "June 15, 2024",
          testUrl
        );
        break;
      case "quoteSent":
        emailTemplate = emailTemplates.quoteSent(
          testName,
          "Amazing Catering Co.",
          "£2,500.00",
          testUrl
        );
        break;
      case "bookingConfirmed":
        emailTemplate = emailTemplates.bookingConfirmed(
          testName,
          "Amazing Catering Co.",
          "June 15, 2024",
          "Wedding Reception",
          testUrl
        );
        break;
      case "reviewRequest":
        emailTemplate = emailTemplates.reviewRequest(
          testName,
          "Amazing Catering Co.",
          testUrl
        );
        break;
      default:
        return NextResponse.json(
          { message: "Invalid template type" },
          { status: 400 }
        );
    }

    return new NextResponse(emailTemplate.html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Return available templates
  return NextResponse.json({
    message: "EVA Local Email Testing API",
    availableTemplates: [
      "welcome",
      "verifyEmail", 
      "passwordReset",
      "newInquiry",
      "quoteSent",
      "bookingConfirmed",
      "reviewRequest"
    ],
    usage: {
      sendEmail: "POST /api/test-email with { email, template, name? }",
      preview: "GET /api/test-email?template=TEMPLATE_NAME&preview=true"
    },
    examples: {
      sendWelcome: {
        method: "POST",
        body: {
          email: "test@example.com",
          template: "welcome",
          name: "John Doe"
        }
      },
      previewVerification: "GET /api/test-email?template=verifyEmail&preview=true"
    }
  });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";