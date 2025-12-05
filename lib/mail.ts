import axios from "axios";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const response = await axios.post(
      "https://api.zeptomail.com/v1.1/email",
      {
        from: {
          address: process.env.ZEPTOMAIL_FROM_EMAIL!,
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
          Authorization: `${process.env.ZEPTOMAIL_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(
      "Email sending failed:",
      error.response?.data || error.message
    );
    return { success: false, error: error.response?.data || error.message };
  }
}
