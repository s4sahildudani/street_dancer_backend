const { poolPromise, sql } = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM sd_userprofile');
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
        
        const query = 'INSERT INTO sd_userprofile (username, email, phone, password, created_at) VALUES (@name, @email, @phone, @password, CURRENT_TIMESTAMP)';
        
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