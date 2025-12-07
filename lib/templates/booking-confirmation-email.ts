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
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 650px;
      margin: 0 auto;
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .header-subtitle {
      margin: 8px 0 0 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 24px;
      color: #1f2937;
    }
    .success-message {
      background-color: #ecfdf5;
      border-left: 4px solid #059669;
      padding: 16px;
      margin: 24px 0;
      border-radius: 6px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .detail-item {
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-item:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .detail-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    .vendor-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .vendor-name {
      font-size: 18px;
      font-weight: 700;
      color: #0369a1;
      margin: 0 0 12px 0;
    }
    .vendor-info {
      font-size: 14px;
      color: #475569;
      line-height: 1.8;
    }
    .vendor-info a {
      color: #0369a1;
      text-decoration: none;
    }
    .vendor-info a:hover {
      text-decoration: underline;
    }
    .pricing-section {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      margin: 12px 0;
      font-size: 15px;
    }
    .price-row.total {
      font-size: 18px;
      font-weight: 700;
      color: #059669;
      border-top: 2px solid #e5e7eb;
      padding-top: 12px;
      margin-top: 16px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(5, 150, 105, 0.3);
    }
    .checklist {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .checklist-item {
      padding: 12px 0;
      padding-left: 32px;
      position: relative;
      color: #4b5563;
    }
    .checklist-item:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #059669;
      font-weight: bold;
      font-size: 18px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      font-size: 13px;
      color: #6b7280;
      margin: 8px 0;
    }
    .footer-links a {
      color: #059669;
      text-decoration: none;
      margin: 0 12px;
      font-size: 12px;
    }
    @media (max-width: 600px) {
      .container {
        border-radius: 0;
      }
      .content {
        padding: 24px 20px;
      }
      .details-grid {
        grid-template-columns: 1fr;
        gap: 0;
      }
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Booking Confirmed!</h1>
      <p class="header-subtitle">Your payment has been processed successfully</p>
    </div>

    <div class="content">
      <p class="greeting">Hi ${data.clientName},</p>

      <div class="success-message">
        <strong>Great news!</strong> Your booking with <strong>${
          data.vendorName
        }</strong> is now confirmed. We're thrilled to help make your event unforgettable!
      </div>

      <div class="section">
        <h3 class="section-title">Booking Details</h3>
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Booking ID</div>
            <div class="detail-value">#${data.bookingId
              .slice(0, 8)
              .toUpperCase()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Event Type</div>
            <div class="detail-value">${data.eventType}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Event Date</div>
            <div class="detail-value">${data.eventDate}</div>
          </div>
          ${
            data.eventLocation
              ? `
          <div class="detail-item">
            <div class="detail-label">Location</div>
            <div class="detail-value">${data.eventLocation}</div>
          </div>`
              : ""
          }
          ${
            data.guestsCount
              ? `
          <div class="detail-item">
            <div class="detail-label">Guest Count</div>
            <div class="detail-value">${data.guestsCount} Guests</div>
          </div>`
              : ""
          }
          <div class="detail-item">
            <div class="detail-label">Payment Mode</div>
            <div class="detail-value">${paymentModeText}</div>
          </div>
        </div>
      </div>

      <div class="vendor-card">
        <h4 class="vendor-name">${data.vendorName}</h4>
        <div class="vendor-info">
          ${
            data.vendorEmail
              ? `<div>📧 <a href="mailto:${data.vendorEmail}">${data.vendorEmail}</a></div>`
              : ""
          }
          ${data.vendorPhone ? `<div>📱 ${data.vendorPhone}</div>` : ""}
          ${
            data.vendorWebsite
              ? `<div>🌐 <a href="${data.vendorWebsite}" target="_blank">Visit Website</a></div>`
              : ""
          }
        </div>
      </div>

      <div class="pricing-section">
        <h3 class="section-title">Payment Summary</h3>
        ${
          data.paymentMode === "FULL_PAYMENT"
            ? `
          <div class="price-row">
            <span>Total Amount Paid</span>
            <span>${formattedTotal}</span>
          </div>
          <div class="price-row total">
            <span>Booking Secured ✓</span>
            <span>${formattedTotal}</span>
          </div>`
            : data.paymentMode === "DEPOSIT_BALANCE"
            ? `
          <div class="price-row">
            <span>Deposit Paid</span>
            <span>${depositFormatted}</span>
          </div>
          <div class="price-row">
            <span>Balance Due</span>
            <span>${balanceFormatted}</span>
          </div>
          ${
            data.balanceDueDate
              ? `<div class="price-row">
            <span>Balance Due Date</span>
            <span>${data.balanceDueDate}</span>
          </div>`
              : ""
          }
          <div class="price-row total">
            <span>Total Amount</span>
            <span>${formattedTotal}</span>
          </div>`
            : `
          <div class="price-row total">
            <span>Total Amount</span>
            <span>${formattedTotal}</span>
          </div>`
        }
      </div>

      <div class="button-container">
        <a href="${data.bookingUrl}" class="button">View Booking</a>
      </div>

      <div class="section">
        <h3 class="section-title">What's Next?</h3>
        <ul class="checklist">
          <li class="checklist-item">Review your booking details and event information</li>
          <li class="checklist-item">Connect with your vendor to discuss final arrangements</li>
          ${
            data.paymentMode === "DEPOSIT_BALANCE"
              ? `<li class="checklist-item">Note the balance due date: ${data.balanceDueDate}</li>`
              : ""
          }
          <li class="checklist-item">Check your email for updates and reminders</li>
        </ul>
      </div>

      <p style="color: #6b7280; line-height: 1.8;">
        If you have any questions or need to make changes to your booking, please don't hesitate to contact ${
          data.vendorName
        } directly.
        <br><br>
        Thank you for choosing EVA to find your perfect vendor! We can't wait to hear how your event goes.
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">© ${new Date().getFullYear()} EVA. All rights reserved.</p>
      <p class="footer-text">This is an automated email. Please do not reply to this message.</p>
      <div class="footer-links">
        <a href="${
          process.env.NEXTAUTH_URL || "https://eva.events"
        }/bookings">My Bookings</a>
        <a href="${
          process.env.NEXTAUTH_URL || "https://eva.events"
        }/help">Help Center</a>
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
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 650px;
      margin: 0 auto;
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .header-subtitle {
      margin: 8px 0 0 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 24px;
      color: #1f2937;
    }
    .success-message {
      background-color: #faf5ff;
      border-left: 4px solid #7c3aed;
      padding: 16px;
      margin: 24px 0;
      border-radius: 6px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .client-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .client-name {
      font-size: 18px;
      font-weight: 700;
      color: #0369a1;
      margin: 0 0 12px 0;
    }
    .client-info {
      font-size: 14px;
      color: #475569;
      line-height: 1.8;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .detail-item {
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-item:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .detail-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    .pricing-section {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      margin: 12px 0;
      font-size: 15px;
    }
    .price-row.total {
      font-size: 18px;
      font-weight: 700;
      color: #7c3aed;
      border-top: 2px solid #e5e7eb;
      padding-top: 12px;
      margin-top: 16px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(124, 58, 237, 0.3);
    }
    .action-items {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .action-items h4 {
      margin-top: 0;
      color: #1f2937;
    }
    .action-items ul {
      margin: 0;
      padding-left: 20px;
      color: #4b5563;
    }
    .action-items li {
      margin: 8px 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      font-size: 13px;
      color: #6b7280;
      margin: 8px 0;
    }
    @media (max-width: 600px) {
      .container {
        border-radius: 0;
      }
      .content {
        padding: 24px 20px;
      }
      .details-grid {
        grid-template-columns: 1fr;
        gap: 0;
      }
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 New Booking Confirmed!</h1>
      <p class="header-subtitle">Payment has been received</p>
    </div>

    <div class="content">
      <p class="greeting">Hi ${data.vendorBusinessName},</p>

      <div class="success-message">
        <strong>Excellent news!</strong> You have a new confirmed booking from <strong>${
          data.clientName
        }</strong>. Payment has been successfully processed!
      </div>

      <div class="client-card">
        <h4 class="client-name">Client: ${data.clientName}</h4>
        <div class="client-info">
          ${
            data.vendorEmail
              ? `<div>📧 <a href="mailto:${data.vendorEmail}" style="color: #0369a1; text-decoration: none;">${data.vendorEmail}</a></div>`
              : ""
          }
          ${data.vendorPhone ? `<div>📱 ${data.vendorPhone}</div>` : ""}
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Event Details</h3>
        <div class="details-grid">
          <div class="detail-item">
            <div class="detail-label">Booking ID</div>
            <div class="detail-value">#${data.bookingId
              .slice(0, 8)
              .toUpperCase()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Event Type</div>
            <div class="detail-value">${data.eventType}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Event Date</div>
            <div class="detail-value">${data.eventDate}</div>
          </div>
          ${
            data.eventLocation
              ? `
          <div class="detail-item">
            <div class="detail-label">Location</div>
            <div class="detail-value">${data.eventLocation}</div>
          </div>`
              : ""
          }
          ${
            data.guestsCount
              ? `
          <div class="detail-item">
            <div class="detail-label">Guest Count</div>
            <div class="detail-value">${data.guestsCount} Guests</div>
          </div>`
              : ""
          }
          <div class="detail-item">
            <div class="detail-label">Payment Mode</div>
            <div class="detail-value">${paymentModeText}</div>
          </div>
        </div>
      </div>

      <div class="pricing-section">
        <h3 class="section-title">Payment Summary</h3>
        ${
          data.paymentMode === "FULL_PAYMENT"
            ? `<div class="price-row">
            <span>Full Payment Received</span>
            <span>${formattedTotal}</span>
          </div>
          <div class="price-row total">
            <span>Total Booking Value</span>
            <span>${formattedTotal}</span>
          </div>`
            : data.paymentMode === "DEPOSIT_BALANCE"
            ? `<div class="price-row">
            <span>Deposit Received</span>
            <span>${depositFormatted}</span>
          </div>
          <div class="price-row total">
            <span>Total Booking Value</span>
            <span>${formattedTotal}</span>
          </div>`
            : `<div class="price-row total">
            <span>Booking Value</span>
            <span>${formattedTotal}</span>
          </div>`
        }
      </div>

      <div class="action-items">
        <h4>Action Items for You</h4>
        <ul>
          <li>Reach out to ${data.clientName} to confirm event details</li>
          <li>Discuss final arrangements and timeline</li>
          ${
            data.paymentMode === "DEPOSIT_BALANCE"
              ? `<li>Set a reminder for balance payment due date</li>`
              : ""
          }
          <li>Share any additional requirements or next steps</li>
          <li>Log in to your dashboard to manage this booking</li>
        </ul>
      </div>

      <div class="button-container">
        <a href="${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/vendor/bookings" class="button">Manage Booking</a>
      </div>

      <p style="color: #6b7280; line-height: 1.8;">
        Start the conversation with your client right away to ensure a smooth event experience. The more connected you are, the better the outcome!
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">© ${new Date().getFullYear()} EVA. All rights reserved.</p>
      <p class="footer-text">This is an automated email. Please do not reply to this message.</p>
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
