import { formatCurrency } from "../formatters";

/**
 * Email template for new inquiry notifications sent to vendors
 * Matches EVA's brand colors and design system
 */

interface InquiryEmailData {
  vendorName: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  eventDate: string;
  location?: string;
  guestCount?: number;
  budget?: number;
  message?: string;
  inquiryUrl: string;
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
  .details-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; margin: 24px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { font-size: 13px; color: #64748b; font-weight: 500; }
  .detail-value { font-size: 14px; color: #0f172a; font-weight: 700; }
  .client-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bfdbfe; border-radius: 16px; padding: 24px; margin: 24px 0; }
  .client-name { font-size: 18px; font-weight: 800; color: #1e40af; margin-bottom: 12px; }
  .client-info { font-size: 14px; color: #1e3a8a; line-height: 1.8; }
  .message-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; margin: 24px 0; font-style: italic; color: #475569; position: relative; }
  .message-box::before { content: '"'; font-size: 40px; color: #cbd5e1; position: absolute; top: 10px; left: 10px; opacity: 0.5; }
  .button-container { text-align: center; margin: 36px 0; }
  .button { display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35); }
  .pro-tip { background: #fffbeb; border: 1px solid #fde68a; padding: 20px; border-radius: 16px; color: #92400e; font-size: 14px; margin: 24px 0; }
  .pro-tip strong { color: #d97706; }
  .footer { background: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
  .footer-logo { font-weight: 800; color: #7c3aed; font-size: 18px; letter-spacing: 2px; margin-bottom: 8px; }
  .footer-tagline { color: #64748b; font-size: 13px; margin-bottom: 12px; }
  .footer-contact { color: #94a3b8; font-size: 12px; margin-top: 16px; }
  .footer-links { margin-top: 16px; }
  .footer-links a { color: #7c3aed; text-decoration: none; font-size: 12px; margin: 0 12px; }
`;

export function generateInquiryEmailHTML(data: InquiryEmailData): string {
  const {
    vendorName,
    clientName,
    clientEmail,
    eventType,
    eventDate,
    location,
    guestCount,
    budget,
    message,
    inquiryUrl,
  } = data;

  const budgetDisplay = budget ? formatCurrency(budget) : "Not specified";
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <div class="header-icon">🎉</div>
        <div class="logo">EVA</div>
        <div class="header-title">New Inquiry!</div>
      </div>

      <div class="body">
        <p class="greeting">Hi ${vendorName},</p>
        
        <p class="content-text">
          Congratulations! <strong>${clientName}</strong> is interested in your services for their upcoming event. This is a great opportunity to showcase your work and land a new booking.
        </p>

        <div class="section-title">Inquiry Details</div>
        <div class="details-box">
          <div class="detail-row">
            <span class="detail-label">Event Type</span>
            <span class="detail-value" style="color: #7c3aed;">${eventType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Date</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
          ${
            location
              ? `
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${location}</span>
          </div>`
              : ""
          }
          ${
            guestCount
              ? `
          <div class="detail-row">
            <span class="detail-label">Guest Count</span>
            <span class="detail-value">${guestCount} guests</span>
          </div>`
              : ""
          }
          <div class="detail-row">
            <span class="detail-label">Budget</span>
            <span class="detail-value" style="color: #7c3aed;">${budgetDisplay}</span>
          </div>
        </div>

        <div class="section-title">Client Information</div>
        <div class="client-card">
          <div class="client-name">${clientName}</div>
          <div class="client-info">
            <div>📧 <a href="mailto:${clientEmail}" style="color: #1e40af; text-decoration: none;">${clientEmail}</a></div>
          </div>
        </div>

        ${
          message
            ? `
        <div class="section-title">Client's Message</div>
        <div class="message-box">
          <div style="padding-left: 10px;">${message}</div>
        </div>
        `
            : ""
        }

        <div class="pro-tip">
          <strong>💡 Pro Tip:</strong> Quick responses to inquiries significantly increase your chances of landing the booking. We recommend responding within 24 hours!
        </div>

        <div class="button-container">
          <a href="${inquiryUrl}" class="button">View & Respond</a>
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
          }/vendor/dashboard">Dashboard</a>
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

export function generateInquiryEmailText(data: InquiryEmailData): string {
  const {
    vendorName,
    clientName,
    clientEmail,
    eventType,
    eventDate,
    location,
    guestCount,
    budget,
    message,
    inquiryUrl,
  } = data;

  const budgetDisplay = budget ? formatCurrency(budget) : "Not specified";
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let text = `Hi ${vendorName},

🎉 NEW INQUIRY!

You have a new event inquiry from ${clientName}.

EVENT DETAILS:
- Event Type: ${eventType}
- Date: ${formattedDate}
${location ? `- Location: ${location}` : ""}
${guestCount ? `- Guests: ${guestCount}` : ""}
- Budget: ${budgetDisplay}

CLIENT INFORMATION:
- Name: ${clientName}
- Email: ${clientEmail}`;

  if (message) {
    text += `

CLIENT'S MESSAGE:
"${message}"`;
  }

  text += `

💡 PRO TIP: Quick responses increase your booking chances!

VIEW INQUIRY & RESPOND:
${inquiryUrl}

--
© ${new Date().getFullYear()} EVA
${process.env.NEXTAUTH_URL || "https://eva.events"}`;

  return text;
}

export default {
  generateInquiryEmailHTML,
  generateInquiryEmailText,
};
