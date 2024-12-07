const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Database connection

// Fetch all users
router.get('/', (req, res) => {
    const query = `
        SELECT 
            c.ID_client AS id,
            CONCAT(c.nom, ' ', c.prenom) AS name,
            c.age,
            r.libelle AS region
        FROM client c
        LEFT JOIN region r ON c.ID_region = r.ID_region;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(results); // Respond with the query results
    });
});

module.exports = router;
