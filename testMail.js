require("dotenv").config();
const transporter = require("./mail");

transporter.sendMail(
  {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // khud ke email par test
    subject: "Test Email from Node.js",
    html: "<h2>Email system working 🎉</h2>",
  },
  (err, info) => {
    if (err) {
      console.log("❌ Error:", err);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  }
);
