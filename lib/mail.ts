import axios from "axios";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Check if email service is configured
  if (!process.env.ZEPTOMAIL_TOKEN || !process.env.ZEPTOMAIL_FROM_EMAIL) {
    console.warn("Email service not configured. Skipping email send to:", to);
    console.warn("Subject:", subject);
    // In development, log the email content for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Email HTML preview (first 500 chars):",
        html.substring(0, 500)
      );
    }
    return { success: false, error: "Email service not configured" };
  }

  try {
    const response = await axios.post(
      "https://api.zeptomail.com/v1.1/email",
      {
        from: {
          address: process.env.ZEPTOMAIL_FROM_EMAIL,
          name: process.env.ZEPTOMAIL_FROM_NAME || "Eva Marketplace",
        },
        to: [
          {
            email_address: {
              address: to,
              name: to.split("@")[0],
            },
          },
        ],
        subject,
        htmlbody: html,
      },
      {
        headers: {
          Authorization: process.env.ZEPTOMAIL_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: unknown };
      message?: string;
    };
    console.error(
      "Email sending failed:",
      axiosError.response?.data || axiosError.message
    );
    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
}
