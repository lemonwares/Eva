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

const DEFAULT_FROM = process.env.EMAIL_FROM || "EVA <noreply@eva.events>";

// Detect which email provider is configured
function getEmailProvider(): "resend" | "sendgrid" | "development" {
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SENDGRID_API_KEY) return "sendgrid";
  return "development";
}

// Send email using Resend
async function sendWithResend(options: EmailOptions): Promise<boolean> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: options.from || DEFAULT_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Resend error:", error);
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }

  return true;
}

// Send email using SendGrid
async function sendWithSendGrid(options: EmailOptions): Promise<boolean> {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: options.to }] }],
      from: { email: options.from || DEFAULT_FROM },
      subject: options.subject,
      content: [
        { type: "text/plain", value: options.text || "" },
        { type: "text/html", value: options.html },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("SendGrid error:", error);
    throw new Error(`SendGrid error: ${error}`);
  }

  return true;
}

// Send email (auto-detects provider)
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const provider = getEmailProvider();

  try {
    switch (provider) {
      case "resend":
        console.log(`📧 Sending email via Resend to: ${options.to}`);
        return await sendWithResend(options);

      case "sendgrid":
        console.log(`📧 Sending email via SendGrid to: ${options.to}`);
        return await sendWithSendGrid(options);

      case "development":
      default:
        // In development, just log the email
        console.log("📧 [DEV MODE] Email would be sent:", {
          from: options.from || DEFAULT_FROM,
          to: options.to,
          subject: options.subject,
          preview:
            options.text?.substring(0, 100) || options.html.substring(0, 100),
        });
        return true;
    }
  } catch (error) {
    console.error("Email sending failed:", error);
    // In production, you might want to throw the error
    // For now, we log and return false
    return false;
  }
}

// Email templates
export const emailTemplates = {
  // Welcome email after registration
  welcome: (name: string): EmailTemplate => ({
    subject: "Welcome to EVA - Your Event Vendor Journey Begins!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to EVA! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for joining EVA - the premier platform for discovering exceptional event vendors.</p>
              <p>Whether you're planning a wedding, corporate event, or cultural celebration, we're here to connect you with the best vendors in your area.</p>
              <a href="${
                process.env.NEXTAUTH_URL
              }/browse" class="button">Start Exploring</a>
              <p>Need help? Our team is always here for you.</p>
              <p>Best regards,<br>The EVA Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EVA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${name},\n\nWelcome to EVA! Thank you for joining us.\n\nStart exploring vendors at ${process.env.NEXTAUTH_URL}/browse\n\nBest regards,\nThe EVA Team`,
  }),

  // Email verification
  verifyEmail: (name: string, verificationUrl: string): EmailTemplate => ({
    subject: "Verify Your EVA Account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Please verify your email address to complete your EVA registration.</p>
              <a href="${verificationUrl}" class="button">Verify Email</a>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EVA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${name},\n\nPlease verify your email: ${verificationUrl}\n\nThis link expires in 24 hours.`,
  }),

  // Password reset
  passwordReset: (name: string, resetUrl: string): EmailTemplate => ({
    subject: "Reset Your EVA Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We received a request to reset your password.</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>This link will expire in 1 hour.</p>
              <div class="warning">
                <strong>Didn't request this?</strong> If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EVA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${name},\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
  }),

  // New inquiry notification (to vendor)
  newInquiry: (
    vendorName: string,
    clientName: string,
    eventType: string,
    eventDate: string,
    inquiryUrl: string
  ): EmailTemplate => ({
    subject: `New Inquiry from ${clientName} - ${eventType}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .details { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; }
            .details p { margin: 8px 0; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Inquiry!</h1>
            </div>
            <div class="content">
              <p>Hi ${vendorName},</p>
              <p>Great news! You have a new inquiry.</p>
              <div class="details">
                <p><strong>From:</strong> ${clientName}</p>
                <p><strong>Event Type:</strong> ${eventType}</p>
                <p><strong>Event Date:</strong> ${eventDate}</p>
              </div>
              <a href="${inquiryUrl}" class="button">View Inquiry & Respond</a>
              <p>Quick responses lead to more bookings!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EVA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${vendorName},\n\nYou have a new inquiry from ${clientName} for ${eventType} on ${eventDate}.\n\nView it at: ${inquiryUrl}`,
  }),

  // Quote sent notification (to client)
  quoteSent: (
    clientName: string,
    vendorName: string,
    totalPrice: string,
    quoteUrl: string
  ): EmailTemplate => ({
    subject: `Quote from ${vendorName} - ₦${totalPrice}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .price { font-size: 32px; font-weight: bold; color: #7c3aed; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You've Got a Quote!</h1>
            </div>
            <div class="content">
              <p>Hi ${clientName},</p>
              <p>${vendorName} has sent you a quote for your event.</p>
              <div class="price">₦${totalPrice}</div>
              <a href="${quoteUrl}" class="button">View Full Quote</a>
              <p>Review the details and respond to secure your booking!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EVA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${clientName},\n\n${vendorName} has sent you a quote for ₦${totalPrice}.\n\nView it at: ${quoteUrl}`,
  }),

  // Booking confirmed notification
  bookingConfirmed: (
    name: string,
    vendorName: string,
    eventDate: string,
    eventType: string,
    bookingUrl: string
  ): EmailTemplate => ({
    subject: `Booking Confirmed with ${vendorName}! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .details { background: #ecfdf5; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #a7f3d0; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Your booking with ${vendorName} is confirmed!</p>
              <div class="details">
                <p><strong>Vendor:</strong> ${vendorName}</p>
                <p><strong>Event:</strong> ${eventType}</p>
                <p><strong>Date:</strong> ${eventDate}</p>
              </div>
              <a href="${bookingUrl}" class="button">View Booking Details</a>
              <p>We're excited for your event!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EVA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${name},\n\nYour booking with ${vendorName} is confirmed!\n\nEvent: ${eventType}\nDate: ${eventDate}\n\nView details: ${bookingUrl}`,
  }),

  // Review request (after event)
  reviewRequest: (
    clientName: string,
    vendorName: string,
    reviewUrl: string
  ): EmailTemplate => ({
    subject: `How was ${vendorName}? Share your experience!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'IBM Plex Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7c3aed; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .stars { font-size: 32px; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Share Your Experience</h1>
            </div>
            <div class="content">
              <p>Hi ${clientName},</p>
              <p>We hope you had an amazing event with ${vendorName}!</p>
              <p>Your feedback helps other clients find great vendors.</p>
              <div class="stars">⭐⭐⭐⭐⭐</div>
              <a href="${reviewUrl}" class="button">Write a Review</a>
              <p>It only takes a minute!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EVA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${clientName},\n\nHow was your experience with ${vendorName}?\n\nLeave a review: ${reviewUrl}`,
  }),
};

// Helper function to send templated emails
export async function sendTemplatedEmail(
  to: string,
  template: EmailTemplate
): Promise<boolean> {
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
