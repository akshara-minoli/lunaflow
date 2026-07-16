const nodemailer = require('nodemailer');

/**
 * Send email utility using Nodemailer
 * @param {Object} options - contains destination email, subject, text/html content
 */
const sendEmail = async (options) => {
  // If SMTP variables are missing in development, output to console to avoid crashes
  const isSmtpConfigured = 
    process.env.EMAIL_HOST && 
    process.env.EMAIL_USER && 
    process.env.EMAIL_PASS;

  if (!isSmtpConfigured && process.env.NODE_ENV !== 'production') {
    console.log('\n=================== MOCK EMAIL (SMTP OFFLINE) ===================');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.message}`);
    console.log('=================================================================\n');
    return;
  }

  // Configure SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: `"FloNest Support" <noreply@flonest.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`
  };

  const info = await transporter.sendMail(message);
  console.log(`Email dispatched successfully. Message ID: ${info.messageId}`);
};

module.exports = sendEmail;
