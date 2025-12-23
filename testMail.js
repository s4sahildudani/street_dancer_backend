require("dotenv").config();
const transporter = require("./mail");

transporter.sendMail(
  {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // khud ke email par test
    subject: "Test Email from Node.js",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .header { background-color: #007bff; color: #ffffff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; }
          .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Test Email Notification</h1>
          </div>
          <div class="content">
            <p>Dear User,</p>
            <p>This is a test email to verify that our email system is functioning correctly.</p>
            <p>If you received this email, it means our email service is working properly.</p>
            <p>Thank you for testing our system!</p>
            <p>Best regards,<br>Your Development Team</p>
          </div>
          <div class="footer">
            <p>This is an automated test email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
  (err, info) => {
    if (err) {
      console.log("❌ Error:", err);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  }
);
