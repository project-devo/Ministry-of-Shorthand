import { Resend } from "resend";

const getBaseUrl = () => {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
};

const getFromEmail = () => {
  return process.env.RESEND_FROM_EMAIL ?? "Ministry of Shorthand <onboarding@resend.dev>";
};

const sendEmail = async ({
  subject,
  to,
  html,
}: {
  subject: string;
  to: string | string[];
  html: string;
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: getFromEmail(),
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async ({
  email,
  token,
  name,
}: {
  email: string;
  token: string;
  name: string;
}) => {
  const verificationUrl = `${getBaseUrl()}/api/auth/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Verify your Ministry of Shorthand account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Welcome, ${name}</h2>
        <p>Verify your email to activate your Ministry of Shorthand account.</p>
        <p><a href="${verificationUrl}" style="display:inline-block;padding:12px 20px;background:#ef7d5d;color:#ffffff;text-decoration:none;border-radius:8px;">Verify email</a></p>
        <p>If the button does not work, use this link:</p>
        <p>${verificationUrl}</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your Ministry of Shorthand password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Password reset request</h2>
        <p>Use the link below to choose a new password for your Ministry of Shorthand account.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#ef7d5d;color:#ffffff;text-decoration:none;border-radius:8px;">Reset password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
        <p>${resetUrl}</p>
      </div>
    `,
  });
};

export const sendInquiryNotificationEmail = async ({
  inquiry,
  recipients,
}: {
  inquiry: {
    name: string;
    email: string;
    phone: string;
    interest: string;
    message: string;
  };
  recipients: string[];
}) => {
  if (recipients.length === 0) {
    return;
  }

  await sendEmail({
    to: recipients,
    subject: `New inquiry from ${inquiry.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>New website inquiry</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone}</p>
        <p><strong>Interest:</strong> ${inquiry.interest}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
      </div>
    `,
  });
};
