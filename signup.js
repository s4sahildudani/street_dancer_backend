const express = require("express");
const app = express();
const transporter = require("./mail");

app.use(express.json());
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}
app.post("/signup", async (req, res) => {
  const { email } = req.body;
  
  const otp = generateOTP();
  console.log("OTP:", otp);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email dance studio",
    html: ` <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
              padding: 0;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
              background-size: 400% 400%;
              animation: gradientShift 4s ease infinite;
              color: #ffffff;
              padding: 30px 20px;
              text-align: center;
              position: relative;
            }
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .header .icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .content {
              padding: 40px 30px;
              color: #333;
              line-height: 1.6;
              text-align: center;
            }
            .otp-box {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 15px;
              margin: 20px 0;
              box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 10px 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .footer {
              background: #f8f9fa;
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e9ecef;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">🎭</div>
              <h1>Welcome to Dance Studio!</h1>
            </div>
            <div class="content">
              <p><strong>Hello there! 👋</strong></p>
              <p>Thank you for joining our dance community! To complete your registration, please verify your email address.</p>

              <div class="otp-box">
                <div class="emoji">🔐</div>
                <h3>Your Verification Code</h3>
                <div class="otp-code">${otp}</div>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> This code will expire in 5 minutes. Please use it immediately to verify your account.
              </div>

              <p>Get ready to explore amazing dance classes and connect with talented instructors! 💃🕺</p>

              <p><em>If you didn't request this verification, please ignore this email.</em></p>
            </div>
            <div class="footer">
              <p>🚀 Powered by Dance Studio | 🎨 Where Passion Meets Movement</p>
              <p>This is an automated verification email • Please do not reply</p>
            </div>
          </div>
        </body>
        </html>`,
  });

  res.json({ message: "OTP sent to email" });
});
