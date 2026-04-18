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

function iconBlock(type: "welcome" | "verify" | "reset" | "inquiry" | "quote" | "booking" | "cancel" | "review" | "invite"): string {
  const icons: Record<string, string> = {
    welcome: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div></div>`,
    verify: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div></div>`,
    reset: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div></div>`,
    inquiry: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div></div>`,
    quote: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div></div>`,
    booking: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div></div>`,
    cancel: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div></div>`,
    review: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div></div>`,
    invite: `<div style="margin:28px 0;text-align:center"><div style="display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.2)"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></div></div>`,
  };
  return icons[type] || "";
}

// ─── Email templates ──────────────────────────────────────────────────────────

export const emailTemplates = {
  welcome: (name: string): EmailTemplate => ({
    subject: "Welcome to EVA Local - Your Event Vendor Journey Begins!",
    html: loadTemplate("welcome", baseVars({
      title: "Welcome to EVA Local!",
      headerTitle: "Welcome to EVA Local!",
      gifBlock: iconBlock("welcome"),
      name,
    })),
    text: `Hi ${name},\n\nWelcome to EVA Local!\n\nStart exploring: ${APP_URL}/vendors\n\nBest regards,\nThe EVA Local Team`,
  }),

  verifyEmail: (name: string, verificationUrl: string): EmailTemplate => ({
    subject: "Verify Your EVA Local Account",
    html: loadTemplate("verify-email", baseVars({
      title: "Verify Your Email",
      headerTitle: "Verify Your Email",
      gifBlock: iconBlock("verify"),
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
      gifBlock: iconBlock("reset"),
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
      gifBlock: iconBlock("inquiry"),
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
        gifBlock: iconBlock("quote"),
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
      gifBlock: iconBlock("booking"),
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
      gifBlock: iconBlock("booking"),
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
      gifBlock: iconBlock("cancel"),
      clientName,
      vendorName,
      eventDate,
      reason,
      cancelledBy,
      bookingUrl,
    })),
    text: `Hi ${clientName},\n\nBooking with ${vendorName} on ${eventDate} cancelled.\n\nBy: ${cancelledBy}\nReason: ${reason}\n\nRefund: If a payment was made, a full refund will be processed within 24–48 hours to your original payment method.\n\nView: ${bookingUrl}`,
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
      gifBlock: iconBlock("cancel"),
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
      gifBlock: iconBlock("review"),
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
      gifBlock: iconBlock("invite"),
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
