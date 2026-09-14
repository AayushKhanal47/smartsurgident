import nodemailer from "nodemailer";
import SiteSettings from "../models/SiteSettings";

const DEFAULT_ADMIN_EMAIL = "surgidentsmart@gmail.com";

// The address admin notification emails (new order/quote/contact message)
// go to — the same CMS-editable contact email shown on the site (Admin →
// Settings), not a separate hardcoded address, so updating it in one place
// keeps notifications in sync automatically.
export const getAdminNotificationEmail = async (): Promise<string> => {
  const settings = await SiteSettings.findOne({ key: "singleton" });
  return settings?.email?.trim() || DEFAULT_ADMIN_EMAIL;
};

// User-submitted text (names, messages, addresses) gets embedded directly
// into these HTML emails — escape it first so a submission can't inject
// markup into whatever inbox/client renders the notification.
export const escapeHtml = (value: string): string =>
  value.replace(/[&<>'"]/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!
  );

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailInput): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("[email] EMAIL_USER/EMAIL_PASS not set — skipping email send");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Smart Surgident" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("[email] Failed to send email:", error);
  }
};