import { formatCurrency } from "./formatters";
import { logger } from "./logger";
import { loadTemplate } from "./email-loader";
import {
  generateBookingConfirmationHTMLClient,
  generateBookingConfirmationTextClient,
  generateBookingConfirmationHTMLVendor,
  generateBookingConfirmationTextVendor,
  type BookingConfirmationEmailData,
} from "./templates/booking-confirmation-email";

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
const APP_URL = process.env.NEXTAUTH_URL || "https://evalocal.com";

// ─── ZeptoMail sender ────────────────────────────────────────────────────────

async function sendWithZeptoMail(options: EmailOptions): Promise<boolean> {
  const response = await fetch("https://api.zeptomail.com/v1.1/email", {
    method: "POST",
    headers: {
      Authorization: process.env.ZEPTOMAIL_TOKEN || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: { address: options.from || DEFAULT_FROM, name: DEFAULT_FROM_NAME },
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

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (process.env.DISABLE_EMAIL_SENDING === "true") {
    logger.info("📧 [EMAIL DISABLED] Would send:", {
      to: options.to,
      subject: options.subject,
    });
    return true;
  }

  if (!process.env.ZEPTOMAIL_TOKEN || !process.env.ZEPTOMAIL_FROM_EMAIL) {
    logger.warn("📧 [DEV MODE] ZeptoMail not configured. Would send:", {
      to: options.to,
      subject: options.subject,
    });
    return true;
  }

  const maxRetries = 5;
  const delayMs = 2000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      logger.info(`Sending email via ZeptoMail to: ${options.to}`);
      return await sendWithZeptoMail(options);
    } catch (error) {
      logger.error(`Email sending failed (attempt ${attempt + 1}):`, error);
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  return false;
}

// ─── Shared layout vars ───────────────────────────────────────────────────────

function baseVars(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    appUrl: APP_URL,
    headerClass: "",
    gifBlock: "",
    footerTagline: "Connecting you with the best event service providers",
    ...overrides,
  };
}

function gifBlock(url: string): string {
  return `<div class="gif-container"><img src="${url}" alt="Animation" class="gif-image" /></div>`;
}

// ─── Email templates ──────────────────────────────────────────────────────────

export const emailTemplates = {
  welcome: (name: string): EmailTemplate => ({
    subject: "Welcome to EVA Local - Your Event Vendor Journey Begins!",
    html: loadTemplate("welcome", baseVars({
      title: "Welcome to EVA Local!",
      headerTitle: "Welcome to EVA Local!",
      gifBlock: gifBlock("https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif"),
      name,
    })),
    text: `Hi ${name},\n\nWelcome to EVA Local!\n\nStart exploring: ${APP_URL}/vendors\n\nBest regards,\nThe EVA Local Team`,
  }),

  verifyEmail: (name: string, verificationUrl: string): EmailTemplate => ({
    subject: "Verify Your EVA Local Account",
    html: loadTemplate("verify-email", baseVars({
      title: "Verify Your Email",
      headerTitle: "Verify Your Email",
      gifBlock: gifBlock("https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"),
      name,
      verificationUrl,
    })),
    text: `Hi ${name},\n\nVerify your email: ${verificationUrl}\n\nThis link expires in 24 hours.`,
  }),

  passwordReset: (name: string, resetUrl: string): EmailTemplate => ({
    subject: "Reset Your EVA Local Password",
    html: loadTemplate("password-reset", baseVars({
      title: "Reset Your Password",
      headerTitle: "Reset Your Password",
      gifBlock: gifBlock("https://media.giphy.com/media/l2JhpjWPccQhsAMfu/giphy.gif"),
      name,
      resetUrl,
    })),
    text: `Hi ${name},\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
  }),

  newInquiry: (
    vendorName: string,
    clientName: string,
    eventType: string,
    eventDate: string,
    inquiryUrl: string,
  ): EmailTemplate => ({
    subject: `New Inquiry from ${clientName} - ${eventType}`,
    html: loadTemplate("new-inquiry", baseVars({
      title: "New Inquiry",
      headerTitle: "New Inquiry!",
      headerClass: "header-green",
      footerTagline: "Providing you with the best tools to grow your event business",
      vendorName,
      clientName,
      eventType,
      eventDate,
      inquiryUrl,
    })),
    text: `Hi ${vendorName},\n\nNew inquiry from ${clientName} for ${eventType} on ${eventDate}.\n\nView it: ${inquiryUrl}`,
  }),

  quoteSent: (
    clientName: string,
    vendorName: string,
    totalPrice: string | number,
    quoteUrl: string,
  ): EmailTemplate => {
    const formattedPrice = formatCurrency(Number(totalPrice) || 0);
    return {
      subject: `Quote from ${vendorName} - ${formattedPrice}`,
      html: loadTemplate("quote-sent", baseVars({
        title: "New Quote Received",
        headerTitle: "You've Got a Quote!",
        clientName,
        vendorName,
        formattedPrice,
        quoteUrl,
      })),
      text: `Hi ${clientName},\n\n${vendorName} sent you a quote for ${formattedPrice}.\n\nView it: ${quoteUrl}`,
    };
  },

  bookingConfirmed: (
    name: string,
    vendorName: string,
    eventDate: string,
    eventType: string,
    bookingUrl: string,
  ): EmailTemplate => ({
    subject: `Booking Confirmed with ${vendorName}! 🎉`,
    html: loadTemplate("booking-confirmed", baseVars({
      title: "Booking Confirmed",
      headerTitle: "Booking Confirmed!",
      headerClass: "header-green",
      footerTagline: "Thank you for choosing EVA for your event needs",
      name,
      vendorName,
      eventDate,
      eventType,
      bookingUrl,
    })),
    text: `Hi ${name},\n\nBooking with ${vendorName} confirmed!\n\nEvent: ${eventType}\nDate: ${eventDate}\n\nView: ${bookingUrl}`,
  }),

  bookingCompleted: (
    clientName: string,
    vendorName: string,
    eventType: string,
    eventDate: string,
    bookingUrl: string,
  ): EmailTemplate => ({
    subject: `Booking Completed with ${vendorName} ✅`,
    html: loadTemplate("booking-completed", baseVars({
      title: "Booking Completed",
      headerTitle: "Event Completed!",
      headerClass: "header-green",
      footerTagline: "Thank you for using EVA for your event",
      clientName,
      vendorName,
      eventType,
      eventDate,
      bookingUrl,
    })),
    text: `Hi ${clientName},\n\nYour event with ${vendorName} is completed!\n\nEvent: ${eventType}\nDate: ${eventDate}\n\nView: ${bookingUrl}`,
  }),

  bookingCancelledClient: (
    clientName: string,
    vendorName: string,
    eventDate: string,
    reason: string,
    cancelledBy: string,
    bookingUrl: string,
  ): EmailTemplate => ({
    subject: `Booking with ${vendorName} Cancelled`,
    html: loadTemplate("booking-cancelled-client", baseVars({
      title: "Booking Cancelled",
      headerTitle: "Booking Cancelled",
      clientName,
      vendorName,
      eventDate,
      reason,
      cancelledBy,
      bookingUrl,
    })),
    text: `Hi ${clientName},\n\nBooking with ${vendorName} on ${eventDate} cancelled.\n\nBy: ${cancelledBy}\nReason: ${reason}\n\nView: ${bookingUrl}`,
  }),

  bookingCancelledVendor: (
    vendorName: string,
    clientName: string,
    eventDate: string,
    reason: string,
    cancelledBy: string,
    bookingUrl: string,
  ): EmailTemplate => ({
    subject: `Booking Cancelled - ${clientName}`,
    html: loadTemplate("booking-cancelled-vendor", baseVars({
      title: "Booking Cancelled",
      headerTitle: "Booking Cancelled",
      vendorName,
      clientName,
      eventDate,
      reason,
      cancelledBy,
      bookingUrl,
    })),
    text: `Hi ${vendorName},\n\nBooking from ${clientName} on ${eventDate} cancelled.\n\nBy: ${cancelledBy}\nReason: ${reason}\n\nView: ${bookingUrl}`,
  }),

  reviewRequest: (
    clientName: string,
    vendorName: string,
    reviewUrl: string,
  ): EmailTemplate => ({
    subject: `How was ${vendorName}? Share your experience!`,
    html: loadTemplate("review-request", baseVars({
      title: "Share Your Experience",
      headerTitle: "Share Your Experience",
      clientName,
      vendorName,
      reviewUrl,
    })),
    text: `Hi ${clientName},\n\nHow was your experience with ${vendorName}?\n\nLeave a review: ${reviewUrl}`,
  }),

  vendorInvite: (
    name: string,
    businessName: string,
    inviteUrl: string,
  ): EmailTemplate => ({
    subject: `You're invited to join EVA Local as a vendor`,
    html: loadTemplate("vendor-invite", baseVars({
      title: "Vendor Invitation",
      name,
      businessName,
      inviteUrl,
    })),
    text: `Hi ${name},\n\nYou've been invited to join EVA Local as a vendor for ${businessName}.\n\nAccept your invitation: ${inviteUrl}\n\nThis link expires in 72 hours.`,
  }),

  // Booking confirmation after payment (uses existing .ts templates)
  bookingConfirmationClient: (data: BookingConfirmationEmailData): EmailTemplate => ({
    subject: `✅ Booking Confirmed with ${data.vendorName}! 🎉`,
    html: generateBookingConfirmationHTMLClient(data),
    text: generateBookingConfirmationTextClient(data),
  }),

  bookingConfirmationVendor: (
    data: BookingConfirmationEmailData & { vendorBusinessName: string },
  ): EmailTemplate => ({
    subject: `🎉 New Booking Confirmed - ${data.clientName}`,
    html: generateBookingConfirmationHTMLVendor(data),
    text: generateBookingConfirmationTextVendor(data),
  }),
};

// ─── Helper ───────────────────────────────────────────────────────────────────

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
