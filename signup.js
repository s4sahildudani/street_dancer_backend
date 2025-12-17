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
    subject: "Verify your email",
    html: `<h2>Your OTP is:</h2><h1>${otp}</h1>`,
  });

  res.json({ message: "OTP sent to email" });
});
