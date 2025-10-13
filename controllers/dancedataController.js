const { poolPromise, sql } = require('../config/db');

exports.getAllDanceData = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('select * from sd_Dance_data');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addDanceData = async (req, res) => {
    const { name, price } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('price', sql.Decimal(10,2), price)
            .query('INSERT INTO Products (name, price) VALUES (@name, @price)');
        res.json({ message: 'Product added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};