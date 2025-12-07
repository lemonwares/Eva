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

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Inquiry - EVA</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'IBM Plex Sans', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #f9fafb;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          /* Header */
          .header {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }

          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .header p {
            font-size: 14px;
            opacity: 0.95;
          }

          /* Content */
          .content {
            padding: 30px;
          }

          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #1f2937;
          }

          .greeting strong {
            color: #7c3aed;
          }

          /* Inquiry Details Section */
          .details-section {
            background: #f3f4f6;
            border-left: 4px solid #7c3aed;
            padding: 20px;
            margin: 24px 0;
            border-radius: 8px;
          }

          .details-section h3 {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-bottom: 16px;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }

          .detail-item:last-child {
            border-bottom: none;
          }

          .detail-label {
            font-weight: 500;
            color: #4b5563;
            font-size: 13px;
          }

          .detail-value {
            color: #1f2937;
            font-weight: 600;
            font-size: 14px;
          }

          .detail-value.highlight {
            color: #7c3aed;
          }

          /* Client Info */
          .client-info {
            background: #f0f9ff;
            border: 1px solid #bfdbfe;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
          }

          .client-info h4 {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1e40af;
            margin-bottom: 12px;
          }

          .client-info p {
            font-size: 14px;
            color: #1f2937;
            margin-bottom: 6px;
          }

          .client-info p:last-child {
            margin-bottom: 0;
          }

          /* Message Section */
          .message-section {
            margin: 24px 0;
          }

          .message-section h4 {
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-bottom: 12px;
          }

          .message-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 14px;
            border-radius: 6px;
            font-size: 14px;
            color: #374151;
            line-height: 1.6;
            font-style: italic;
          }

          /* CTA Button */
          .cta-section {
            text-align: center;
            margin: 30px 0;
          }

          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            transition: opacity 0.2s;
            border: none;
            cursor: pointer;
          }

          .cta-button:hover {
            opacity: 0.9;
          }

          /* Secondary Action */
          .secondary-text {
            text-align: center;
            font-size: 13px;
            color: #6b7280;
            margin: 16px 0 0 0;
          }

          .secondary-text a {
            color: #7c3aed;
            text-decoration: none;
            font-weight: 500;
          }

          /* Info Box */
          .info-box {
            background: #ede9fe;
            border: 1px solid #ddd6fe;
            padding: 14px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 13px;
            color: #5b21b6;
            line-height: 1.5;
          }

          .info-box strong {
            color: #5b21b6;
          }

          /* Footer */
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }

          .footer p {
            font-size: 12px;
            color: #6b7280;
            margin: 4px 0;
          }

          .footer a {
            color: #7c3aed;
            text-decoration: none;
          }

          /* Responsive */
          @media (max-width: 600px) {
            .header {
              padding: 30px 20px;
            }

            .header h1 {
              font-size: 24px;
            }

            .content {
              padding: 20px;
            }

            .details-section {
              padding: 16px;
            }

            .cta-button {
              display: block;
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>🎉 New Inquiry!</h1>
            <p>You have a new event inquiry</p>
          </div>

          <!-- Main Content -->
          <div class="content">
            <p class="greeting">
              Hi <strong>${vendorName}</strong>,
            </p>

            <p>
              Congratulations! <strong>${clientName}</strong> is interested in your services for their upcoming event.
              This is a great opportunity to showcase your work and land a new booking.
            </p>

            <!-- Event Details -->
            <div class="details-section">
              <h3>📋 Event Details</h3>

              <div class="detail-item">
                <span class="detail-label">Event Type:</span>
                <span class="detail-value highlight">${eventType}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Event Date:</span>
                <span class="detail-value">${new Date(eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>

              ${
                location
                  ? `
              <div class="detail-item">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${location}</span>
              </div>
              `
                  : ""
              }

              ${
                guestCount
                  ? `
              <div class="detail-item">
                <span class="detail-label">Guest Count:</span>
                <span class="detail-value">${guestCount} guests</span>
              </div>
              `
                  : ""
              }

              <div class="detail-item">
                <span class="detail-label">Budget:</span>
                <span class="detail-value highlight">${budgetDisplay}</span>
              </div>
            </div>

            <!-- Client Info -->
            <div class="client-info">
              <h4>👤 Client Information</h4>
              <p><strong>Name:</strong> ${clientName}</p>
              <p><strong>Email:</strong> ${clientEmail}</p>
            </div>

            ${
              message
                ? `
            <!-- Client Message -->
            <div class="message-section">
              <h4>💬 Client's Message</h4>
              <div class="message-box">
                "${message}"
              </div>
            </div>
            `
                : ""
            }

            <!-- Info Box -->
            <div class="info-box">
              <strong>💡 Pro Tip:</strong> Quick responses to inquiries significantly increase your chances of landing the booking.
              We recommend responding within 24 hours!
            </div>

            <!-- CTA Button -->
            <div class="cta-section">
              <a href="${inquiryUrl}" class="cta-button">View Inquiry & Respond</a>
              <p class="secondary-text">
                or copy this link: <a href="${inquiryUrl}">${inquiryUrl}</a>
              </p>
            </div>

            <!-- Action Items -->
            <p style="font-size: 14px; color: #374151; margin-top: 24px; margin-bottom: 8px;">
              <strong>What happens next?</strong>
            </p>
            <ul style="font-size: 13px; color: #6b7280; margin-left: 20px; line-height: 1.8;">
              <li>Review the event details and client requirements</li>
              <li>Respond with your quote and availability</li>
              <li>Negotiate terms if needed</li>
              <li>Receive confirmation and payment once accepted</li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© ${new Date().getFullYear()} EVA. All rights reserved.</p>
            <p>
              <a href="${process.env.NEXTAUTH_URL || "https://eva.events"}">EVA.events</a> |
              <a href="${process.env.NEXTAUTH_URL || "https://eva.events"}/vendor/dashboard">Your Dashboard</a>
            </p>
            <p style="margin-top: 12px; color: #9ca3af;">
              This is an automated email. Please don't reply to this message.
            </p>
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
