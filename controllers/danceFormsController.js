const { poolPromise } = require('../config/db');

exports.getAllDanceForms = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM dance_forms_india where isActive = 1');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};