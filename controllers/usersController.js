const { poolPromise, sql } = require('../config/db');
const transporter = require('../mail');

// In-memory OTP store (Redis recommended for production)
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

/* =========================
   SIGNUP + SEND OTP EMAIL
========================= */
exports.signup = async (req, res) => {
  const { email, name, phone, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const otp = generateOTP();

  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  try {
    const pool = await poolPromise;

    // Save user as pending verification
    const query = `
      INSERT INTO sd_Userprofile (username, email, phone, password, status, created_at)
      VALUES (@name, @email, @phone, @password, @status, CURRENT_TIMESTAMP)
      ON CONFLICT (email)
      DO UPDATE SET
        username = @name,
        phone = @phone,
        password = @password,
        status = @status
    `;

    await pool.request()
      .input('name', sql.VarChar, name || null)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone || null)
      .input('password', sql.VarChar, password)
      .input('status', sql.VarChar, 'pending_verification')
      .query(query);

    /* ===== Gmail Safe Email ===== */
    await transporter.sendMail({
      from: `"Dance Studio 🎭" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Dance Studio account',
      html: `
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#f2f2f2;padding:30px;font-family:Arial,sans-serif;">
  <tr>
    <td align="left">
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:12px;padding:35px;color:#111111;">

        <!-- HEADER -->
        <tr>
          <td align="left" style="padding-bottom:20px;">
            <span style="
              display:inline-block;
              width:42px;
              height:42px;
              line-height:42px;
              text-align:center;
              border-radius:50%;
              background:#111111;
              color:#ffffff;
              font-size:18px;">
              ✉️
            </span>
          </td>
        </tr>

        <!-- TITLE -->
        <tr>
          <td style="font-size:26px;font-weight:bold;padding-bottom:8px;">
            Verify your email
          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="font-size:15px;color:#333333;line-height:1.6;padding-bottom:25px;">
            Hello,<br/><br/>
            We’ve sent a <b>6-digit verification code</b> to
            <span style="color:#000000;font-weight:600;">${email}</span>.
            Please enter this code to complete your
            <b>Dance Studio</b> account setup.
          </td>
        </tr>

        <!-- OTP -->
        <tr>
          <td align="center" style="padding:20px 0 30px 0;">
            <div style="
              display:inline-block;
              background:#111111;
              color:#ffffff;
              font-size:30px;
              letter-spacing:10px;
              padding:16px 28px;
              border-radius:8px;
              font-weight:bold;">
              ${otp}
            </div>
          </td>
        </tr>

        <!-- INFO -->
        <tr>
          <td style="font-size:14px;color:#555555;line-height:1.6;padding-bottom:25px;">
            ⏰ This code will expire in <b>5 minutes</b>.<br/>
            If you didn’t request this email, you can safely ignore it.
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="
            font-size:12px;
            color:#777777;
            border-top:1px solid #e5e5e5;
            padding-top:18px;">
            © ${new Date().getFullYear()} Dance Studio<br/>
            This is an automated message. Please do not reply.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`


    });

    console.log('✅ OTP sent to:', email);
    res.json({ message: 'OTP sent to email' });

  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

/* =========================
   VERIFY OTP
========================= */
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const stored = otpStore.get(email);

  if (!stored || stored.otp != otp || Date.now() > stored.expires) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  try {
    const pool = await poolPromise;

    const updateQuery = `
      UPDATE sd_Userprofile
      SET status = @status
      WHERE email = @email AND status = @pending
    `;

    const result = await pool.request()
      .input('status', sql.VarChar, 'verified')
      .input('pending', sql.VarChar, 'pending_verification')
      .input('email', sql.VarChar, email)
      .query(updateQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(400).json({ error: 'User not found or already verified' });
    }

    otpStore.delete(email);

    const userResult = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id, username, email, phone FROM sd_Userprofile WHERE email = @email');

    res.json({
      message: 'Account verified successfully',
      user: userResult.recordset[0]
    });

  } catch (err) {
    console.error('❌ verifyOTP Error:', err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   LOGIN (Allow login, include verified status)
========================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT id, username, email, phone, status
        FROM sd_Userprofile
        WHERE email = @email AND password = @password
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.recordset[0];
    const verified = user.status === 'verified';

    const response = {
      message: verified ? 'Login successful' : 'Please verify your email',
      verified: verified
    };

    res.json(response);

  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, username, email, phone, status, created_at FROM sd_Userprofile');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ getAllUsers Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.addUser = async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  console.log('📥 Received data:', { name, email, phone });

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const pool = await poolPromise;

    const query = 'INSERT INTO sd_Userprofile (username, email, phone, password, status, created_at) VALUES (@name, @email, @phone, @password, @status, CURRENT_TIMESTAMP)';

    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone)
      .input('password', sql.VarChar, password)
      .input('status', sql.VarChar, 'verified')
      .query(query);

    console.log('✅ User added successfully');
    res.json({ message: 'User added successfully' });
  } catch (err) {
    console.error('❌ addUser Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
