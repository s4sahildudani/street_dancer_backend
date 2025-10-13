const { poolPromise, sql } = require('../config/db');

exports.getAllInstructors = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM sd_DanceClassDetails');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};