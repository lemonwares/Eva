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
  return `
  <div style="font-family: 'Inter', Arial, sans-serif; background: #f8fafc; color: #18181b; padding: 0; margin: 0;">
    <div style="background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%); padding: 32px 0; text-align: center;">
      <h1 style="color: #fff; font-size: 2.2rem; margin: 0; font-weight: 800; letter-spacing: -1px;">You've Got a Quote!</h1>
      <p style="color: #e0e7ff; font-size: 1.1rem; margin: 8px 0 0 0;">from <b>${vendorName}</b></p>
    </div>
    <div style="max-width: 520px; margin: 32px auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px;">
      <p style="font-size: 1.1rem; margin-bottom: 18px;">Hi <b>${clientName}</b>,</p>
      <p style="margin-bottom: 18px;">${vendorName} has sent you a quote for <span style="color: #7c3aed; font-weight: 700; font-size: 1.2rem;">€${quoteAmount.toLocaleString()}</span> for your event${
    eventType ? ` (<b>${eventType}</b>)` : ""
  }.</p>
      ${
        eventDate || location
          ? `<div style="margin-bottom: 18px; padding: 16px; background: #f3f4f6; border-radius: 10px;">
        ${eventDate ? `<div><b>Date:</b> ${eventDate}</div>` : ""}
        ${location ? `<div><b>Location:</b> ${location}</div>` : ""}
      </div>`
          : ""
      }
      ${
        message
          ? `<div style="margin-bottom: 18px;"><b>Vendor's note:</b><br><span style="color: #52525b;">${message}</span></div>`
          : ""
      }
      <a href="${quoteUrl}" style="display: inline-block; background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 1.1rem; margin: 24px 0;">View Full Quote</a>
      <div style="margin-top: 32px; color: #64748b; font-size: 0.98rem;">
        <b>What next?</b>
        <ul style="margin: 10px 0 0 18px; padding: 0;">
          <li>Review the quote details and terms</li>
          <li>Accept or decline the quote online</li>
          <li>Contact the vendor if you have questions</li>
        </ul>
      </div>
    </div>
    <div style="text-align: center; color: #a1a1aa; font-size: 0.95rem; margin: 32px 0 0 0;">EVA Events &copy; ${new Date().getFullYear()}</div>
  </div>
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
  return `Hi ${clientName},\n\n${vendorName} has sent you a quote for €${quoteAmount.toLocaleString()}${
    eventType ? ` (${eventType})` : ""
  }.\n${eventDate ? `Date: ${eventDate}\n` : ""}${
    location ? `Location: ${location}\n` : ""
  }${
    message ? `\nVendor's note: ${message}\n` : ""
  }\nView your quote: ${quoteUrl}\n\nWhat next?\n- Review the quote details and terms\n- Accept or decline the quote online\n- Contact the vendor if you have questions\n\nEVA Events`;
}
