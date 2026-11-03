import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export function getMailer() {
  const mailer = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    // auth: {
    //   user: process.env.MAIL_USER,
    //   pass: process.env.MAIL_PW,
    // },
    tls: {
      rejectUnauthorized: false,
    },
  });

  console.log('loading...');

  return mailer;
}

export async function sendCatchupMail({
  to,
  name = 'there',
  when = 'sometime next week',
  where = 'a place that suits you',
}) {
  const mailer = getMailer();

  const info = await mailer.sendMail({
    from: 'Sambath Udomreachea <sambath.udomreachea@moc.gov.kh>',
    to,
    subject: "Let's catch up!",
    text: [
      `Hi ${name},`,
      '',
      "It's been a while since we last talked, and I'd love to catch up.",
      `Would you be free ${when}? We could meet at ${where}, or wherever is most convenient for you.`,
      '',
      'Let me know what works best, and feel free to suggest another time if that one is difficult.',
      '',
      'Looking forward to hearing from you!',
      '',
      'Best regards,',
      'Sambath Udomreachea',
    ].join('\n'),
    html: `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f5f7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background-color:#1a3c6e;padding:20px 32px;color:#ffffff;font-size:20px;font-weight:bold;">
                Let's catch up!
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#333333;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 16px;">Hi ${name},</p>
                <p style="margin:0 0 16px;">It's been a while since we last talked, and I'd love to catch up.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 24px;background-color:#f0f4fa;border-left:4px solid #1a3c6e;border-radius:4px;">
                  <tr>
                    <td style="padding:16px 20px;font-size:15px;color:#1a3c6e;">
                      <div style="margin-bottom:6px;"><b>When:</b> ${when}</div>
                      <div><b>Where:</b> ${where}</div>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 16px;">Let me know what works best, and feel free to suggest another time if that one is difficult.</p>
                <p style="margin:0 0 24px;">Looking forward to hearing from you!</p>
                <p style="margin:0;">Best regards,<br /><b>Sambath Udomreachea</b></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  });

  return info;
}

// Run directly: node index.js <to> [name] [when] [where]
if (import.meta.url === `file://${process.argv[1]}`) {
  const [to, name, when, where] = process.argv.slice(2);
  if (!to) {
    console.error('Usage: node index.js <to> [name] [when] [where]');
    process.exit(1);
  }

  try {
    const info = await sendCatchupMail({ to, name, when, where });
    console.log('Mail sent:', info.messageId, info.response);
  } catch (err) {
    console.error('Failed to send mail:', err);
    process.exit(1);
  }
}
