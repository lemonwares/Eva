import { formatCurrency } from "../formatters";

// Dedicated quote email template for EVA
// Usage: generateQuoteEmailHTML(data), generateQuoteEmailText(data)

export interface QuoteEmailData {
  vendorName: string;
  clientName: string;
  clientEmail: string;
  quoteAmount: number;
  quoteUrl: string;
  eventType?: string;
  eventDate?: string;
  location?: string;
  message?: string;
}

const EMAIL_STYLE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Red Hat Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; color: #0f172a; margin: 0; padding: 0; line-height: 1.6; -webkit-font-smoothing: antialiased; }
  .email-wrapper { background: #fafafa; padding: 40px 20px; }
  .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; box-shadow: 0 4px 24px rgba(124, 58, 237, 0.08); overflow: hidden; }
  .header { padding: 48px 32px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); }
  .header-icon { font-size: 56px; margin-bottom: 16px; }
  .logo { font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #ffffff; margin-bottom: 16px; }
  .header-title { font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 0; line-height: 1.3; }
  .body { padding: 40px 32px; }
  .greeting { font-size: 18px; color: #0f172a; margin-bottom: 20px; font-weight: 600; }
  .content-text { color: #475569; margin-bottom: 24px; font-size: 15px; line-height: 1.8; }
  .section-title { font-size: 14px; font-weight: 800; color: #7c3aed; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
  .quote-box { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1px solid #c4b5fd; padding: 32px; border-radius: 20px; text-align: center; margin: 24px 0; }
  .quote-amount { font-size: 48px; font-weight: 900; color: #7c3aed; margin-bottom: 8px; }
  .quote-subtitle { font-size: 14px; color: #6d28d9; font-weight: 600; text-transform: uppercase; }
  .details-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; margin: 24px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { font-size: 13px; color: #64748b; font-weight: 500; }
  .detail-value { font-size: 14px; color: #0f172a; font-weight: 700; }
  .message-section { border-left: 4px solid #7c3aed; background: #f8fafc; padding: 20px; border-radius: 0 16px 16px 0; margin: 24px 0; font-style: italic; color: #475569; }
  .button-container { text-align: center; margin: 36px 0; }
  .button { display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35); }
  .footer { background: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
  .footer-logo { font-weight: 800; color: #7c3aed; font-size: 18px; letter-spacing: 2px; margin-bottom: 8px; }
  .footer-tagline { color: #64748b; font-size: 13px; margin-bottom: 12px; }
  .footer-contact { color: #94a3b8; font-size: 12px; margin-top: 16px; }
  .footer-links { margin-top: 16px; }
  .footer-links a { color: #7c3aed; text-decoration: none; font-size: 12px; margin: 0 12px; }
`;

export function generateQuoteEmailHTML({
  vendorName,
  clientName,
  quoteAmount,
  quoteUrl,
  eventType,
  eventDate,
  location,
  message,
}: QuoteEmailData) {
  const formattedAmount = formatCurrency(quoteAmount);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${EMAIL_STYLE}</style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="header-icon">✉️</div>
        <div class="logo">EVA</div>
        <div class="header-title">You've Got a Quote!</div>
      </div>

      <div class="body">
        <p class="greeting">Hi ${clientName},</p>
        
        <p class="content-text">
          Exciting news! <strong>${vendorName}</strong> has sent you a professional quote for your upcoming event. This is the first step towards securing their services.
        </p>

        <div class="quote-box">
          <div class="quote-subtitle">Total Quote Amount</div>
          <div class="quote-amount">${formattedAmount}</div>
          <div class="quote-subtitle">Secured with EVA</div>
        </div>

        ${
          eventType || eventDate || location
            ? `
        <div class="section-title">Event Information</div>
        <div class="details-box">
          ${
            eventType
              ? `
          <div class="detail-row">
            <span class="detail-label">Event Type</span>
            <span class="detail-value">${eventType}</span>
          </div>`
              : ""
          }
          ${
            eventDate
              ? `
          <div class="detail-row">
            <span class="detail-label">Event Date</span>
            <span class="detail-value">${eventDate}</span>
          </div>`
              : ""
          }
          ${
            location
              ? `
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${location}</span>
          </div>`
              : ""
          }
        </div>
        `
            : ""
        }

        ${
          message
            ? `
        <div class="section-title">A Message from the Vendor</div>
        <div class="message-section">
          "${message}"
        </div>
        `
            : ""
        }

        <div class="button-container">
          <a href="${quoteUrl}" class="button">View Full Quote</a>
        </div>

        <div class="section-title" style="margin-top: 40px;">What's Next?</div>
        <div class="content-text" style="font-size: 14px;">
          <ul style="margin-left: 20px;">
            <li style="margin-bottom: 8px;">Review the detailed breakdown and terms</li>
            <li style="margin-bottom: 8px;">Accept the quote to proceed with booking</li>
            <li style="margin-bottom: 8px;">Decline or request changes if needed</li>
          </ul>
        </div>

        <p class="content-text" style="margin-top: 32px; font-size: 14px; text-align: center; color: #94a3b8;">
          Find vendors who get your traditions
        </p>
      </div>

      <div class="footer">
        <div class="footer-logo">EVA</div>
        <div class="footer-tagline">Connecting you with the best event service providers</div>
        <div class="footer-links">
          <a href="${
            process.env.NEXTAUTH_URL || "https://eva.events"
          }/bookings">My Bookings</a>
          <a href="${
            process.env.NEXTAUTH_URL || "https://eva.events"
          }/help">Help Center</a>
        </div>
        <p class="footer-contact">© ${new Date().getFullYear()} EVA. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateQuoteEmailText({
  vendorName,
  clientName,
  quoteAmount,
  quoteUrl,
  eventType,
  eventDate,
  location,
  message,
}: QuoteEmailData) {
  return `Hi ${clientName},\n\n${vendorName} has sent you a quote for ${formatCurrency(
    quoteAmount
  )}${eventType ? ` (${eventType})` : ""}.\n${
    eventDate ? `Date: ${eventDate}\n` : ""
  }${location ? `Location: ${location}\n` : ""}${
    message ? `\nVendor's note: ${message}\n` : ""
  }\nView your quote: ${quoteUrl}\n\nWhat next?\n- Review the quote details and terms\n- Accept or decline the quote online\n- Contact the vendor if you have questions\n\n© ${new Date().getFullYear()} EVA. All rights reserved.`;
}
