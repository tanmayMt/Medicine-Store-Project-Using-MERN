import nodemailer from "nodemailer";

const createTransport = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_GMAIL,
      pass: process.env.SENDER_GMAIL_PASSCODE,
    },
  });

export async function sendOrderEmail(to, subject, text) {
  if (!process.env.SENDER_GMAIL || !to) {
    console.warn("[orderNotifications] Missing SENDER_GMAIL or recipient");
    return;
  }
  const transporter = createTransport();
  await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.SENDER_GMAIL,
        to,
        subject,
        text,
      },
      (err) => (err ? reject(err) : resolve())
    );
  });
}

/** Placeholder for SMS / WhatsApp — wire Twilio / Meta API when available */
export async function notifySmsWhatsapp(user, channel, message) {
  console.log(`[SMS/WhatsApp stub] ${channel} → ${user?.phone || "no-phone"}: ${message}`);
}
