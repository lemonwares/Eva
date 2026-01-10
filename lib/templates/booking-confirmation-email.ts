import { formatCurrency } from "@/lib/formatters";

export interface BookingConfirmationEmailData {
  clientName: string;
  vendorName: string;
  bookingId: string;
  eventDate: string;
  eventType: string;
  eventLocation?: string;
  guestsCount?: number;
  totalAmount: number;
  paymentMode: string;
  depositAmount?: number;
  balanceAmount?: number;
  balanceDueDate?: string;
  bookingUrl: string;
  vendorEmail?: string;
  vendorPhone?: string;
  vendorWebsite?: string;
}

const EMAIL_STYLE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Red Hat Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; color: #0f172a; margin: 0; padding: 0; line-height: 1.6; -webkit-font-smoothing: antialiased; }
  .email-wrapper { background: #fafafa; padding: 40px 20px; }
  .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; box-shadow: 0 4px 24px rgba(124, 58, 237, 0.08); overflow: hidden; }
  .header { padding: 48px 32px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); }
  .header-green { background: linear-gradient(135deg, #059669 0%, #10b981 100%); }
  .header-icon { font-size: 56px; margin-bottom: 16px; }
  .logo { font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #ffffff; margin-bottom: 16px; }
  .header-title { font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 0; line-height: 1.3; }
  .body { padding: 40px 32px; }
  .greeting { font-size: 18px; color: #0f172a; margin-bottom: 20px; font-weight: 600; }
  .content-text { color: #475569; margin-bottom: 24px; font-size: 15px; line-height: 1.8; }
  .section-title { font-size: 14px; font-weight: 800; color: #7c3aed; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
  .details-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; margin: 24px 0; }
  .details-box-green { background: #ecfdf5; border-color: #a7f3d0; }
  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { font-size: 13px; color: #64748b; font-weight: 500; }
  .detail-value { font-size: 14px; color: #0f172a; font-weight: 700; }
  .vendor-card { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1px solid #c4b5fd; border-radius: 16px; padding: 24px; margin: 24px 0; }
  .vendor-name { font-size: 18px; font-weight: 800; color: #5b21b6; margin-bottom: 12px; }
  .vendor-info { font-size: 14px; color: #6d28d9; line-height: 1.8; }
  .pricing-box { background: #ffffff; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; margin: 24px 0; }
  .price-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; color: #475569; }
  .price-row-total { padding-top: 16px; margin-top: 16px; border-top: 2px solid #e2e8f0; font-size: 20px; font-weight: 800; color: #0f172a; }
  .price-row-success { color: #059669; }
  .button-container { text-align: center; margin: 36px 0; }
  .button { display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35); }
  .button-green { background: linear-gradient(135deg, #059669 0%, #10b981 100%); box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35); }
  .checklist { list-style: none; background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; }
  .checklist-item { padding: 10px 0 10px 32px; position: relative; font-size: 14px; color: #475569; }
  .checklist-item::before { content: "✓"; position: absolute; left: 0; color: #7c3aed; font-weight: 900; font-size: 18px; }
  .footer { background: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0; }
  .footer-logo { font-weight: 800; color: #7c3aed; font-size: 18px; letter-spacing: 2px; margin-bottom: 8px; }
  .footer-tagline { color: #64748b; font-size: 13px; margin-bottom: 12px; }
  .footer-contact { color: #94a3b8; font-size: 12px; margin-top: 16px; }
  .footer-links { margin-top: 16px; }
  .footer-links a { color: #7c3aed; text-decoration: none; font-size: 12px; margin: 0 12px; }
`;

export function generateBookingConfirmationHTMLClient(
  data: BookingConfirmationEmailData
): string {
  const formattedTotal = formatCurrency(data.totalAmount);
  const depositFormatted = data.depositAmount
    ? formatCurrency(data.depositAmount)
    : null;
  const balanceFormatted = data.balanceAmount
    ? formatCurrency(data.balanceAmount)
    : null;

  const paymentModeText = data.paymentMode.replace(/_/g, " ");

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
      <div class="header header-green">
        <div class="header-icon">✅</div>
        <div class="logo">EVA</div>
        <div class="header-title">Booking Confirmed!</div>
      </div>

      <div class="body">
        <p class="greeting">Hi ${data.clientName},</p>
        
        <p class="content-text">
          <strong>Great news!</strong> Your booking with <strong>${
            data.vendorName
          }</strong> is now confirmed. Your payment has been processed successfully.
        </p>

        <div class="section-title">Booking Details</div>
        <div class="details-box">
          <div class="detail-row">
            <span class="detail-label">Booking ID</span>
            <span class="detail-value">#${data.bookingId
              .slice(0, 8)
              .toUpperCase()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Type</span>
            <span class="detail-value">${data.eventType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Date</span>
            <span class="detail-value">${data.eventDate}</span>
          </div>
          ${
            data.eventLocation
              ? `
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${data.eventLocation}</span>
          </div>`
              : ""
          }
          ${
            data.guestsCount
              ? `
          <div class="detail-row">
            <span class="detail-label">Guest Count</span>
            <span class="detail-value">${data.guestsCount} Guests</span>
          </div>`
              : ""
          }
           <div class="detail-row">
            <span class="detail-label">Payment Mode</span>
            <span class="detail-value">${paymentModeText}</span>
          </div>
        </div>

        <div class="section-title">Vendor Information</div>
        <div class="vendor-card">
          <div class="vendor-name">${data.vendorName}</div>
          <div class="vendor-info">
            ${
              data.vendorEmail
                ? `<div>📧 <a href="mailto:${data.vendorEmail}" style="color: #6d28d9; text-decoration: none;">${data.vendorEmail}</a></div>`
                : ""
            }
            ${
              data.vendorPhone
                ? `<div>📱 <span style="color: #6d28d9;">${data.vendorPhone}</span></div>`
                : ""
            }
          </div>
        </div>

        <div class="section-title">Payment Summary</div>
        <div class="pricing-box">
          ${
            data.paymentMode === "FULL_PAYMENT"
              ? `
            <div class="price-row">
              <span>Full Amount Paid</span>
              <span>${formattedTotal}</span>
            </div>
            <div class="price-row-total price-row-success">
              <span>Secured ✓</span>
              <span>${formattedTotal}</span>
            </div>`
              : data.paymentMode === "DEPOSIT_BALANCE"
              ? `
            <div class="price-row">
              <span>Deposit Paid</span>
              <span>${depositFormatted}</span>
            </div>
            <div class="price-row">
              <span>Remaining Balance</span>
              <span>${balanceFormatted}</span>
            </div>
            ${
              data.balanceDueDate
                ? `<div class="price-row">
              <span>Due Date</span>
              <span>${data.balanceDueDate}</span>
            </div>`
                : ""
            }
            <div class="price-row-total">
              <span>Total Value</span>
              <span>${formattedTotal}</span>
            </div>`
              : `
            <div class="price-row-total">
              <span>Total Amount</span>
              <span>${formattedTotal}</span>
            </div>`
          }
        </div>

        <div class="button-container">
          <a href="${data.bookingUrl}" class="button button-green">View My Booking</a>
        </div>

        <div class="section-title">Next Steps</div>
        <ul class="checklist">
          <li class="checklist-item">Reach out to ${data.vendorName} to finalise event details</li>
          <li class="checklist-item">Review any specific instructions on your dashboard</li>
          ${
            data.paymentMode === "DEPOSIT_BALANCE"
              ? `<li class="checklist-item">Note your balance due date: ${data.balanceDueDate}</li>`
              : ""
          }
          <li class="checklist-item">Keep an eye on your dashboard for updates</li>
        </ul>

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
          }/bookings">Bookings</a>
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

export function generateBookingConfirmationTextClient(
  data: BookingConfirmationEmailData
): string {
  const formattedTotal = formatCurrency(data.totalAmount);
  const paymentModeText = data.paymentMode.replace(/_/g, " ");

  let text = `Hi ${data.clientName},\n\n`;
  text += `✅ BOOKING CONFIRMED!\n\n`;
  text += `Your booking with ${data.vendorName} is now confirmed. Your payment has been successfully processed.\n\n`;

  text += `BOOKING DETAILS\n`;
  text += `---------------\n`;
  text += `Booking ID: #${data.bookingId.slice(0, 8).toUpperCase()}\n`;
  text += `Event Type: ${data.eventType}\n`;
  text += `Event Date: ${data.eventDate}\n`;
  if (data.eventLocation) {
    text += `Location: ${data.eventLocation}\n`;
  }
  if (data.guestsCount) {
    text += `Guests: ${data.guestsCount}\n`;
  }
  text += `Payment Mode: ${paymentModeText}\n\n`;

  text += `PAYMENT SUMMARY\n`;
  text += `---------------\n`;
  if (data.paymentMode === "FULL_PAYMENT") {
    text += `Full Payment Completed: ${formattedTotal}\n`;
  } else if (data.paymentMode === "DEPOSIT_BALANCE") {
    const depositFormatted = data.depositAmount
      ? formatCurrency(data.depositAmount)
      : "TBD";
    const balanceFormatted = data.balanceAmount
      ? formatCurrency(data.balanceAmount)
      : "TBD";
    text += `Deposit Paid: ${depositFormatted}\n`;
    text += `Balance Due: ${balanceFormatted}\n`;
    if (data.balanceDueDate) {
      text += `Balance Due Date: ${data.balanceDueDate}\n`;
    }
    text += `Total Amount: ${formattedTotal}\n`;
  } else {
    text += `Amount Paid: ${formattedTotal}\n`;
  }

  text += `\n`;
  text += `VENDOR CONTACT\n`;
  text += `---------------\n`;
  text += `${data.vendorName}\n`;
  if (data.vendorEmail) {
    text += `Email: ${data.vendorEmail}\n`;
  }
  if (data.vendorPhone) {
    text += `Phone: ${data.vendorPhone}\n`;
  }
  if (data.vendorWebsite) {
    text += `Website: ${data.vendorWebsite}\n`;
  }

  text += `\n`;
  text += `NEXT STEPS\n`;
  text += `----------\n`;
  text += `1. Review your booking details at: ${data.bookingUrl}\n`;
  text += `2. Connect with your vendor to discuss final arrangements\n`;
  if (data.paymentMode === "DEPOSIT_BALANCE") {
    text += `3. Note the balance due date in your calendar\n`;
  }
  text += `4. Watch for updates and reminders in your email\n\n`;

  text += `Thank you for choosing EVA!\n\n`;
  text += `© ${new Date().getFullYear()} EVA. All rights reserved.`;

  return text;
}

export function generateBookingConfirmationHTMLVendor(
  data: BookingConfirmationEmailData & { vendorBusinessName: string }
): string {
  const formattedTotal = formatCurrency(data.totalAmount);
  const depositFormatted = data.depositAmount
    ? formatCurrency(data.depositAmount)
    : null;
  const paymentModeText = data.paymentMode.replace(/_/g, " ");

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
        <div class="header-title">New Booking Confirmed!</div>
      </div>

      <div class="body">
        <p class="greeting">Hi ${data.vendorBusinessName},</p>
        
        <p class="content-text">
          <strong>Excellent news!</strong> You have a new confirmed booking from <strong>${
            data.clientName
          }</strong>. Payment has been processed successfully!
        </p>

        <div class="section-title">Client Information</div>
        <div class="vendor-card">
          <div class="vendor-name">${data.clientName}</div>
          <div class="vendor-info">
            ${
              data.vendorEmail
                ? `<div>📧 <a href="mailto:${data.vendorEmail}" style="color: #6d28d9; text-decoration: none;">${data.vendorEmail}</a></div>`
                : ""
            }
            ${
              data.vendorPhone
                ? `<div>📱 <span style="color: #6d28d9;">${data.vendorPhone}</span></div>`
                : ""
            }
          </div>
        </div>

        <div class="section-title">Event Details</div>
        <div class="details-box">
          <div class="detail-row">
            <span class="detail-label">Booking ID</span>
            <span class="detail-value">#${data.bookingId
              .slice(0, 8)
              .toUpperCase()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Type</span>
            <span class="detail-value">${data.eventType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Date</span>
            <span class="detail-value">${data.eventDate}</span>
          </div>
          ${
            data.eventLocation
              ? `
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${data.eventLocation}</span>
          </div>`
              : ""
          }
          ${
            data.guestsCount
              ? `
          <div class="detail-row">
            <span class="detail-label">Guest Count</span>
            <span class="detail-value">${data.guestsCount} Guests</span>
          </div>`
              : ""
          }
          <div class="detail-row">
            <span class="detail-label">Payment Mode</span>
            <span class="detail-value">${paymentModeText}</span>
          </div>
        </div>

        <div class="section-title">Booking Summary</div>
        <div class="pricing-box">
          ${
            data.paymentMode === "FULL_PAYMENT"
              ? `<div class="price-row">
              <span>Full Amount Received</span>
              <span>${formattedTotal}</span>
            </div>
            <div class="price-row-total">
              <span>Total Value</span>
              <span>${formattedTotal}</span>
            </div>`
              : data.paymentMode === "DEPOSIT_BALANCE"
              ? `<div class="price-row">
              <span>Deposit Received</span>
              <span>${depositFormatted}</span>
            </div>
            <div class="price-row-total">
              <span>Total Value</span>
              <span>${formattedTotal}</span>
            </div>`
              : `<div class="price-row-total">
              <span>Booking Value</span>
              <span>${formattedTotal}</span>
            </div>`
          }
        </div>

        <div class="button-container">
          <a href="${data.bookingUrl}" class="button">View Booking Details</a>
        </div>

        <div class="section-title">Actions for You</div>
        <ul class="checklist">
          <li class="checklist-item">Reach out to ${
            data.clientName
          } to confirm final arrangements</li>
          <li class="checklist-item">Update your schedule for ${data.eventDate}</li>
          ${
            data.paymentMode === "DEPOSIT_BALANCE"
              ? `<li class="checklist-item">Set a reminder for the balance payment</li>`
              : ""
          }
          <li class="checklist-item">Mark this booking on your calendar</li>
        </ul>

        <p class="content-text" style="margin-top: 32px; font-size: 14px; text-align: center; color: #94a3b8;">
          Find vendors who get your traditions
        </p>
      </div>

      <div class="footer">
        <div class="footer-logo">EVA</div>
        <div class="footer-tagline">Connecting you with the best event service providers</div>
        <p class="footer-contact">© ${new Date().getFullYear()} EVA. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateBookingConfirmationTextVendor(
  data: BookingConfirmationEmailData & { vendorBusinessName: string }
): string {
  const formattedTotal = formatCurrency(data.totalAmount);
  const depositFormatted = data.depositAmount
    ? formatCurrency(data.depositAmount)
    : null;
  const paymentModeText = data.paymentMode.replace(/_/g, " ");

  let text = `Hi ${data.vendorBusinessName},\n\n`;
  text += `🎉 NEW BOOKING CONFIRMED!\n\n`;
  text += `Great news! You have a new confirmed booking. Payment has been successfully processed.\n\n`;

  text += `CLIENT INFORMATION\n`;
  text += `------------------\n`;
  text += `Name: ${data.clientName}\n`;
  if (data.vendorEmail) {
    text += `Email: ${data.vendorEmail}\n`;
  }
  if (data.vendorPhone) {
    text += `Phone: ${data.vendorPhone}\n`;
  }
  text += `\n`;

  text += `EVENT DETAILS\n`;
  text += `-------------\n`;
  text += `Booking ID: #${data.bookingId.slice(0, 8).toUpperCase()}\n`;
  text += `Event Type: ${data.eventType}\n`;
  text += `Event Date: ${data.eventDate}\n`;
  if (data.eventLocation) {
    text += `Location: ${data.eventLocation}\n`;
  }
  if (data.guestsCount) {
    text += `Guest Count: ${data.guestsCount}\n`;
  }
  text += `Payment Mode: ${paymentModeText}\n\n`;

  text += `PAYMENT SUMMARY\n`;
  text += `---------------\n`;
  if (data.paymentMode === "FULL_PAYMENT") {
    text += `Full Payment Received: ${formattedTotal}\n`;
  } else if (data.paymentMode === "DEPOSIT_BALANCE") {
    text += `Deposit Received: ${depositFormatted}\n`;
    text += `Total Booking Value: ${formattedTotal}\n`;
  } else {
    text += `Amount: ${formattedTotal}\n`;
  }

  text += `\n`;
  text += `ACTION ITEMS\n`;
  text += `------------\n`;
  text += `✓ Reach out to ${data.clientName} to confirm event details\n`;
  text += `✓ Discuss final arrangements and timeline\n`;
  if (data.paymentMode === "DEPOSIT_BALANCE") {
    text += `✓ Note the balance payment due date\n`;
  }
  text += `✓ Share any additional requirements\n`;
  text += `✓ Log in to your dashboard to manage this booking\n\n`;

  text += `Manage this booking at: ${
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  }/vendor/bookings\n\n`;
  text += `Thank you for being an EVA partner!\n\n`;
  text += `© ${new Date().getFullYear()} EVA. All rights reserved.`;

  return text;
}
