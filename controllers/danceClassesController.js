const { poolPromise, sql } = require('../config/db');

exports.addDanceClass = async (req, res) => {
    const { name, city, instructor, style } = req.body;
    if (!name || !city || !instructor || !style) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('city', sql.VarChar, city)
            .input('instructor', sql.VarChar, instructor)
            .input('style', sql.VarChar, style)
            .query('INSERT INTO dance_classes (name, city, instructor, style) VALUES (@name, @city, @instructor, @style)');
        res.json({ message: 'Dance class added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDanceClassesByCity = async (req, res) => {
    const { city } = req.query;
    if (!city) {
        return res.status(400).json({ error: 'City is required as query parameter' });
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('city', sql.VarChar, city)
            .query('SELECT * FROM dance_classes WHERE city = @city');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};