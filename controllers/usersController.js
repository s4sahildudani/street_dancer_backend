const { poolPromise, sql } = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('select * from sd_Userprofile');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addUser = async (req, res) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Validate password match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('phone', sql.VarChar, phone)
            .input('password', sql.VarChar, password)
            .query('Insert into sd_Userprofile (full_name,email,phone,created_at,password) values (@name,@email,@phone,GETDATE(),@password)');
        
        res.json({ message: 'User added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};