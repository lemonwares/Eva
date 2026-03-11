import { formatCurrency } from "./formatters";
import { logger } from "./logger";
import {
  generateBookingConfirmationHTMLClient,
  generateBookingConfirmationTextClient,
  generateBookingConfirmationHTMLVendor,
  generateBookingConfirmationTextVendor,
  type BookingConfirmationEmailData,
} from "./templates/booking-confirmation-email";

const EMAIL_STYLE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Red Hat Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; color: #0f172a; margin: 0; padding: 0; line-height: 1.6; -webkit-font-smoothing: antialiased; }
  .email-wrapper { background: #fafafa; padding: 40px 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; box-shadow: 0 4px 24px rgba(124, 58, 237, 0.08); overflow: hidden; }
  .header { padding: 48px 32px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); }
  .header-green { background: linear-gradient(135deg, #059669 0%, #10b981 100%); }
  .logo-container { margin-bottom: 24px; }
  .logo { max-width: 140px; height: auto; }
  .gif-container { margin: 32px 0; text-align: center; }
  .gif-image { max-width: 200px; height: auto; border-radius: 12px; }
  .header-title { font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 0; line-height: 1.3; }
  .body { padding: 40px 32px; }
  .greeting { font-size: 18px; color: #0f172a; margin-bottom: 20px; font-weight: 600; }
  .content-text { color: #475569; margin-bottom: 24px; font-size: 15px; line-height: 1.8; }
  .button-container { text-align: center; margin: 36px 0; }
  .button { display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35); }
  .button-green { background: linear-gradient(135deg, #059669 0%, #10b981 100%); box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35); }
  .details-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px 24px; border-radius: 12px; margin: 24px 0; }
  .details-box-green { background: #ecfdf5; border-color: #a7f3d0; }
  .warning-box { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 4px solid #f59e0b; padding: 18px 24px; margin: 28px 0; border-radius: 12px; font-size: 14px; color: #92400e; line-height: 1.6; }
  .footer { background: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
  .footer-logo { max-width: 100px; height: auto; margin-bottom: 12px; }
  .footer-tagline { color: #64748b; font-size: 13px; margin-bottom: 12px; }
  .footer-contact { color: #94a3b8; font-size: 13px; }
  .footer-contact a { color: #7c3aed; text-decoration: none; }
`;

const EMAIL_LAYOUT = (
  title: string,
  gifUrl: string,
  headerTitle: string,
  content: string,
  footerTagline: string = "Connecting you with the best event service providers",
  isGreen: boolean = false,
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    ${EMAIL_STYLE}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header ${isGreen ? 'header-green' : ''}">
        <div class="logo-container">
          <img src="${process.env.NEXTAUTH_URL || 'https://evalocal.com'}/images/brand/eva-logo-light.png" alt="EVA Local" class="logo" />
        </div>
        ${gifUrl ? `<div class="gif-container"><img src="${gifUrl}" alt="Animation" class="gif-image" /></div>` : ''}
        <div class="header-title">${headerTitle}</div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <img src="${process.env.NEXTAUTH_URL || 'https://evalocal.com'}/images/brand/eva-logo-dark.png" alt="EVA Local" class="footer-logo" />
        <div class="footer-tagline">${footerTagline}</div>
        <div class="footer-contact"><a href="mailto:hello@evalocal.com">hello@evalocal.com</a></div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Email service for transactional emails
// Supports: Resend, SendGrid, or development mode (logging)

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const DEFAULT_FROM = process.env.ZEPTOMAIL_FROM_EMAIL || "noreply@eva.events";
const DEFAULT_FROM_NAME = process.env.ZEPTOMAIL_FROM_NAME || "EVA";

// Send email using ZeptoMail
async function sendWithZeptoMail(options: EmailOptions): Promise<boolean> {
  const response = await fetch("https://api.zeptomail.com/v1.1/email", {
    method: "POST",
    headers: {
      Authorization: process.env.ZEPTOMAIL_TOKEN || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: {
        address: options.from || DEFAULT_FROM,
        name: DEFAULT_FROM_NAME,
      },
      to: [
        {
          email_address: {
            address: options.to,
            name: options.to.split("@")[0],
          },
        },
      ],
      subject: options.subject,
      htmlbody: options.html,
      textbody: options.text,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    logger.error("ZeptoMail error:", error);
    throw new Error(`ZeptoMail error: ${JSON.stringify(error)}`);
  }

  return true;
}

// Send email (uses ZeptoMail)
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Check if email sending is disabled
  if (process.env.DISABLE_EMAIL_SENDING === "true") {
    logger.info(
      "📧 [EMAIL DISABLED] Email sending is disabled. Email would be sent:",
      {
        from: options.from || DEFAULT_FROM,
        to: options.to,
        subject: options.subject,
        preview:
          options.text?.substring(0, 100) || options.html.substring(0, 100),
      },
    );
    return true;
  }

  // Check if ZeptoMail is configured
  if (!process.env.ZEPTOMAIL_TOKEN || !process.env.ZEPTOMAIL_FROM_EMAIL) {
    logger.warn(
      "📧 [DEV MODE] ZeptoMail not configured. Email would be sent:",
      {
        from: options.from || DEFAULT_FROM,
        to: options.to,
        subject: options.subject,
        preview:
          options.text?.substring(0, 100) || options.html.substring(0, 100),
      },
    );
    return true;
  }

  const maxRetries = 5;
  const delayMs = 2000;
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    try {
      logger.info(`Sending email via ZeptoMail to: ${options.to}`);
      return await sendWithZeptoMail(options);
    } catch (error) {
      lastError = error;
      logger.error(`Email sending failed (attempt ${attempt + 1}):`, error);
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
    attempt++;
  }
  return false;
}

// Email templates
export const emailTemplates = {
  // Welcome email after registration
  welcome: (name: string): EmailTemplate => ({
    subject: "Welcome to EVA Local - Your Event Vendor Journey Begins!",
    html: EMAIL_LAYOUT(
      "Welcome to EVA Local!",
      "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif", // Welcome celebration GIF
      "Welcome to EVA Local!",
      `
        <div class="greeting">Hi ${name},</div>
        <div class="content-text">
          Thank you for joining EVA Local - the premier platform for discovering exceptional event vendors across the UK.
        </div>
        <div class="content-text">
          Whether you're planning a wedding, corporate event, or cultural celebration, we're here to connect you with the best vendors in your area.
        </div>
        <div class="button-container">
          <a href="${process.env.NEXTAUTH_URL}/browse" class="button">Start Exploring</a>
        </div>
        <div class="content-text">
          Need help? Our team is always here for you.
        </div>
        <div class="content-text" style="margin-bottom: 0;">
          Best regards,<br>The EVA Local Team
        </div>
      `,
    ),
    text: `Hi ${name},\n\nWelcome to EVA Local! Thank you for joining us.\n\nStart exploring vendors at ${process.env.NEXTAUTH_URL}/browse\n\nBest regards,\nThe EVA Local Team`,
  }),

  // Email verification
  verifyEmail: (name: string, verificationUrl: string): EmailTemplate => ({
    subject: "Verify Your EVA Local Account",
    html: EMAIL_LAYOUT(
      "Verify Your Email",
      "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif", // Email verification GIF
      "Verify Your Email",
      `
        <div class="greeting">Hi ${name},</div>
        <div class="content-text">
          Please verify your email address to complete your EVA Local registration and start connecting with amazing vendors.
        </div>
        <div class="button-container">
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        <div class="warning-box">
          ⏰ <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
        </div>
        <div class="content-text" style="margin-bottom: 0;">
          If you didn't create an account, you can safely ignore this email.
        </div>
      `,
    ),
    text: `Hi ${name},\n\nPlease verify your email: ${verificationUrl}\n\nThis link expires in 24 hours.`,
  }),

  // Password reset
  passwordReset: (name: string, resetUrl: string): EmailTemplate => ({
    subject: "Reset Your EVA Local Password",
    html: EMAIL_LAYOUT(
      "Reset Your Password",
      "https://media.giphy.com/media/l2JhpjWPccQhsAMfu/giphy.gif", // Security/lock GIF
      "Reset Your Password",
      `
        <div class="greeting">Hi ${name},</div>
        <div class="content-text">
          We received a request to reset your password for your EVA Local account. Click the button below to create a new password.
        </div>
        <div class="button-container">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        <div class="warning-box">
          🛡️ <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email or contact support.
        </div>
      `,
    ),
    text: `Hi ${name},\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
  }),

  // New inquiry notification (to vendor)
  newInquiry: (
    vendorName: string,
    clientName: string,
    eventType: string,
    eventDate: string,
    inquiryUrl: string,
  ): EmailTemplate => ({
    subject: `New Inquiry from ${clientName} - ${eventType}`,
    html: EMAIL_LAYOUT(
      "New Inquiry",
      "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // Celebration/success GIF
      "New Inquiry!",
      `
        <div class="greeting">Hi ${vendorName},</div>
        <div class="content-text">
          Great news! You have a new inquiry from a potential client.
        </div>
        <div class="details-box">
          <div class="content-text" style="margin-bottom: 8px;"><strong>Client:</strong> ${clientName}</div>
          <div class="content-text" style="margin-bottom: 8px;"><strong>Event Type:</strong> ${eventType}</div>
          <div class="content-text" style="margin-bottom: 0;"><strong>Event Date:</strong> ${eventDate}</div>
        </div>
        <div class="button-container">
          <a href="${inquiryUrl}" class="button button-green">View & Respond</a>
        </div>
        <div class="content-text" style="margin-bottom: 0;">
          Quick responses lead to more bookings! Good luck!
        </div>
      `,
      "Providing you with the best tools to grow your event business",
      true,
    ),
    text: `Hi ${vendorName},\n\nYou have a new inquiry from ${clientName} for ${eventType} on ${eventDate}.\n\nView it at: ${inquiryUrl}`,
  }),

  // Quote sent notification (to client)
  quoteSent: (
    clientName: string,
    vendorName: string,
    totalPrice: string | number,
    quoteUrl: string,
  ): EmailTemplate => {
    const formattedPrice = formatCurrency(Number(totalPrice) || 0);
    return {
      subject: `Quote from ${vendorName} - ${formattedPrice}`,
      html: EMAIL_LAYOUT(
        "New Quote Received",
        "💰",
        "You've Got a Quote!",
        `
          <div class="greeting">Hi ${clientName},</div>
          <div class="content-text">
            ${vendorName} has sent you a professional quote for your upcoming event.
          </div>
          <div class="details-box" style="text-align: center;">
            <div style="font-size: 32px; font-weight: 800; color: #7c3aed;">${formattedPrice}</div>
          </div>
          <div class="button-container">
            <a href="${quoteUrl}" class="button">View Full Quote</a>
          </div>
          <div class="content-text" style="margin-bottom: 0;">
            Review the details and respond to secure your booking!
          </div>
        `,
      ),
      text: `Hi ${clientName},\n\n${vendorName} has sent you a quote for ${formattedPrice}.\n\nView it at: ${quoteUrl}`,
    };
  },

  // Booking confirmed notification
  bookingConfirmed: (
    name: string,
    vendorName: string,
    eventDate: string,
    eventType: string,
    bookingUrl: string,
  ): EmailTemplate => ({
    subject: `Booking Confirmed with ${vendorName}! 🎉`,
    html: EMAIL_LAYOUT(
      "Booking Confirmed",
      "✅",
      "Booking Confirmed!",
      `
        <div class="greeting">Hi ${name},</div>
        <div class="content-text">
          Your booking with <strong>${vendorName}</strong> has been successfully confirmed!
        </div>
        <div class="details-box details-box-green">
          <div class="content-text" style="margin-bottom: 8px;"><strong>Vendor:</strong> ${vendorName}</div>
          <div class="content-text" style="margin-bottom: 8px;"><strong>Event:</strong> ${eventType}</div>
          <div class="content-text" style="margin-bottom: 0;"><strong>Date:</strong> ${eventDate}</div>
        </div>
        <div class="button-container">
          <a href="${bookingUrl}" class="button button-green">View Booking Details</a>
        </div>
        <div class="content-text" style="margin-bottom: 0;">
          We're excited to help make your event special!
        </div>
      `,
      "Thank you for choosing EVA for your event needs",
      true,
    ),
    text: `Hi ${name},\n\nYour booking with ${vendorName} is confirmed!\n\nEvent: ${eventType}\nDate: ${eventDate}\n\nView details: ${bookingUrl}`,
  }),

  // Review request (after event)
  reviewRequest: (
    clientName: string,
    vendorName: string,
    reviewUrl: string,
  ): EmailTemplate => ({
    subject: `How was ${vendorName}? Share your experience!`,
    html: EMAIL_LAYOUT(
      "Share Your Experience",
      "⭐",
      "Share Your Experience",
      `
        <div class="greeting">Hi ${clientName},</div>
        <div class="content-text">
          We hope you had an amazing event with <strong>${vendorName}</strong>!
        </div>
        <div class="content-text">
          Your feedback helps other clients find great vendors and helps our community grow.
        </div>
        <div class="details-box" style="text-align: center; border: none; background: transparent;">
          <div style="font-size: 36px; letter-spacing: 4px;">⭐⭐⭐⭐⭐</div>
        </div>
        <div class="button-container">
          <a href="${reviewUrl}" class="button">Write a Review</a>
        </div>
        <div class="content-text" style="margin-bottom: 0; text-align: center;">
          It only takes a minute of your time!
        </div>
      `,
    ),
    text: `Hi ${clientName},\n\nHow was your experience with ${vendorName}?\n\nLeave a review: ${reviewUrl}`,
  }),

  // Booking confirmation (client notification - after payment)
  bookingConfirmationClient: (
    data: BookingConfirmationEmailData,
  ): EmailTemplate => ({
    subject: `✅ Booking Confirmed with ${data.vendorName}! 🎉`,
    html: generateBookingConfirmationHTMLClient(data),
    text: generateBookingConfirmationTextClient(data),
  }),

  // Booking confirmation (vendor notification - after payment)
  bookingConfirmationVendor: (
    data: BookingConfirmationEmailData & { vendorBusinessName: string },
  ): EmailTemplate => ({
    subject: `🎉 New Booking Confirmed - ${data.clientName}`,
    html: generateBookingConfirmationHTMLVendor(data),
    text: generateBookingConfirmationTextVendor(data),
  }),

  // Booking completed notification (to client)
  bookingCompleted: (
    clientName: string,
    vendorName: string,
    eventType: string,
    eventDate: string,
    bookingUrl: string,
  ): EmailTemplate => ({
    subject: `Booking Completed with ${vendorName} ✅`,
    html: EMAIL_LAYOUT(
      "Booking Completed",
      "🎊",
      "Event Completed!",
      `
        <div class="greeting">Hi ${clientName},</div>
        <div class="content-text">
          Your event with <strong>${vendorName}</strong> has been marked as completed. We hope everything went perfectly!
        </div>
        <div class="details-box details-box-green">
          <div class="content-text" style="margin-bottom: 8px;"><strong>Vendor:</strong> ${vendorName}</div>
          <div class="content-text" style="margin-bottom: 8px;"><strong>Event:</strong> ${eventType}</div>
          <div class="content-text" style="margin-bottom: 0;"><strong>Date:</strong> ${eventDate}</div>
        </div>
        <div class="button-container">
          <a href="${bookingUrl}" class="button button-green">View Booking</a>
        </div>
        <div class="content-text" style="margin-bottom: 0;">
          Consider leaving a review to help other clients find great vendors!
        </div>
      `,
      "Thank you for using EVA for your event",
      true,
    ),
    text: `Hi ${clientName},\n\nYour event with ${vendorName} is completed!\n\nEvent: ${eventType}\nDate: ${eventDate}\n\nView details: ${bookingUrl}`,
  }),

  // Booking cancelled notification (to client)
  bookingCancelledClient: (
    clientName: string,
    vendorName: string,
    eventDate: string,
    reason: string,
    cancelledBy: string,
    bookingUrl: string,
  ): EmailTemplate => ({
    subject: `Booking with ${vendorName} Cancelled`,
    html: EMAIL_LAYOUT(
      "Booking Cancelled",
      "❌",
      "Booking Cancelled",
      `
        <div class="greeting">Hi ${clientName},</div>
        <div class="content-text">
          We're sorry to inform you that your booking with <strong>${vendorName}</strong> has been cancelled.
        </div>
        <div class="details-box" style="border-left: 4px solid #ef4444;">
          <div class="content-text" style="margin-bottom: 8px;"><strong>Vendor:</strong> ${vendorName}</div>
          <div class="content-text" style="margin-bottom: 8px;"><strong>Event Date:</strong> ${eventDate}</div>
          <div class="content-text" style="margin-bottom: 8px;"><strong>Cancelled By:</strong> ${cancelledBy}</div>
          <div class="content-text" style="margin-bottom: 0;"><strong>Reason:</strong> ${reason}</div>
        </div>
        <div class="button-container">
          <a href="${bookingUrl}" class="button">View Details</a>
        </div>
        <div class="content-text" style="margin-bottom: 0;">
          If you have any questions, please contact our support team.
        </div>
      `,
    ),
    text: `Hi ${clientName},\n\nYour booking with ${vendorName} on ${eventDate} has been cancelled.\n\nCancelled by: ${cancelledBy}\nReason: ${reason}\n\nView details: ${bookingUrl}`,
  }),

  // Booking cancelled notification (to vendor)
  bookingCancelledVendor: (
    vendorName: string,
    clientName: string,
    eventDate: string,
    reason: string,
    cancelledBy: string,
    bookingUrl: string,
  ): EmailTemplate => ({
    subject: `Booking Cancelled - ${clientName}`,
    html: EMAIL_LAYOUT(
      "Booking Cancelled",
      "❌",
      "Booking Cancelled",
      `
        <div class="greeting">Hi ${vendorName},</div>
        <div class="content-text">
          A booking has been cancelled.
        </div>
        <div class="details-box" style="border-left: 4px solid #ef4444;">
          <div class="content-text" style="margin-bottom: 8px;"><strong>Client:</strong> ${clientName}</div>
          <div class="content-text" style="margin-bottom: 8px;"><strong>Event Date:</strong> ${eventDate}</div>
          <div class="content-text" style="margin-bottom: 8px;"><strong>Cancelled By:</strong> ${cancelledBy}</div>
          <div class="content-text" style="margin-bottom: 0;"><strong>Reason:</strong> ${reason}</div>
        </div>
        <div class="button-container">
          <a href="${bookingUrl}" class="button">View Details</a>
        </div>
      `,
      "Managing your event business with EVA",
      true,
    ),
    text: `Hi ${vendorName},\n\nBooking from ${clientName} on ${eventDate} has been cancelled.\n\nCancelled by: ${cancelledBy}\nReason: ${reason}\n\nView details: ${bookingUrl}`,
  }),
};

// Helper function to send templated emails
export async function sendTemplatedEmail(
  to: string,
  template: EmailTemplate,
): Promise<boolean> {
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
