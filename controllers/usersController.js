const { poolPromise, sql } = require('../config/db');
const transporter = require('../mail');

// In-memory OTP store (use Redis in production)
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

exports.signup = async (req, res) => {
  const { email, name, phone, password, confirmPassword } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!password || password !== confirmPassword) {
    return res.status(400).json({ error: 'Password and confirm password are required and must match' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const otp = generateOTP();
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

  console.log("OTP for", email, ":", otp);

  try {
    // Store user data temporarily in database
    const pool = await poolPromise;
    const query = 'INSERT INTO sd_Userprofile (username, email, phone, password, status, created_at) VALUES (@name, @email, @phone, @password, @status, CURRENT_TIMESTAMP) ON CONFLICT (email) DO UPDATE SET username = @name, phone = @phone, password = @password, status = @status';
    
    await pool.request()
      .input('name', sql.VarChar, name || null)
      .input('email', sql.VarChar, email)
      .input('phone', sql.VarChar, phone || null)
      .input('password', sql.VarChar, password)
      .input('status', sql.VarChar, 'pending_verification')
      .query(query);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<h2>Your OTP is:</h2><h1>${otp}</h1>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error('❌ signup Error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

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
    
    // Update user status to verified
    const query = 'UPDATE sd_Userprofile SET status = @status WHERE email = @email AND status = @pendingStatus';
    
    const result = await pool.request()
      .input('status', sql.VarChar, 'verified')
      .input('email', sql.VarChar, email)
      .input('pendingStatus', sql.VarChar, 'pending_verification')
      .query(query);

    if (result.rowsAffected && result.rowsAffected[0] === 0) {
      return res.status(400).json({ error: 'User not found or already verified' });
    }

    otpStore.delete(email); // Clean up

    // Get the verified user data
    const userQuery = 'SELECT id, username, email, phone FROM sd_Userprofile WHERE email = @email';
    const userResult = await pool.request()
      .input('email', sql.VarChar, email)
      .query(userQuery);

    const user = userResult.recordset[0];

    console.log('✅ OTP verified and account activated for', email);
    res.json({ message: 'Account verified successfully', user: { id: user.id, username: user.username, email: user.email, phone: user.phone } });
  } catch (err) {
    console.error('❌ verifyOTP Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM sd_Userprofile');
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
        
        const query = 'INSERT INTO sd_Userprofile (username, email, phone, password, created_at) VALUES (@name, @email, @phone, @password, CURRENT_TIMESTAMP)';
        
        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('phone', sql.VarChar, phone)
            .input('password', sql.VarChar, password)
            .query(query);
        
        console.log('✅ User added successfully');
        res.json({ message: 'User added successfully' });
    } catch (err) {
        console.error('❌ addUser Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const pool = await poolPromise;
        const query = 'SELECT * FROM sd_Userprofile WHERE email = @email AND password = @password AND status = @status';
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('status', sql.VarChar, 'verified')
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password, or account not verified' });
        }

        const user = result.recordset[0];
        res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email, phone: user.phone } });
    } catch (err) {
        console.error('❌ login Error:', err);
        res.status(500).json({ error: err.message });
    }
};