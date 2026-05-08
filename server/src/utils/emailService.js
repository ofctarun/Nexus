import 'dotenv/config';
import nodemailer from 'nodemailer';

const createTransporter = () => {
  const MAIL_HOST = process.env.MAIL_HOST || 'smtp.gmail.com';
  const MAIL_PORT = process.env.MAIL_PORT || '587';
  const MAIL_USER = process.env.MAIL_USER || 'praneethkilaparthi@gmail.com';
  const MAIL_PASS = process.env.MAIL_PASS || 'ewlxtsxihtgalvzk';
  const MAIL_FROM = process.env.MAIL_FROM || 'Nexus <praneethkilaparthi@gmail.com>';
  const MAIL_SECURE = process.env.MAIL_SECURE || 'false';

  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: MAIL_SECURE === 'true' || Number(MAIL_PORT) === 465,
    auth: {
      user: 'praneethkilaparthi@gmail.com',
      pass: 'ewlxtsxihtgalvzk',
    },
  });
};

export const sendInvitationEmail = async ({ to, code, role, level, organizationName, acceptUrl }) => {
  const transporter = createTransporter();
  const subject = `You're invited to join ${organizationName}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#1f2937;">
      <h2 style="color:#111827;">Invitation to join ${organizationName}</h2>
      <p>You have been invited to join <strong>${organizationName}</strong> with role <strong>${role}</strong> and hierarchy level <strong>${level}</strong>.</p>
      <p><strong>Invite Code:</strong> <span style="font-family:monospace;background:#f3f4f6;padding:4px 8px;border-radius:6px;">${code}</span></p>
      <p>Click the button below to accept the invitation and sign up.</p>
      <p style="text-align:center; margin: 24px 0;"><a href="${acceptUrl}" style="background:#0f172a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;display:inline-block;">Accept Invitation</a></p>
      <p style="color:#6b7280;font-size:14px;">If the button does not work, paste this code into the signup form: ${code}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p style="font-size:13px;color:#6b7280;">This invitation code is one-time use and will expire after it is used.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
};
