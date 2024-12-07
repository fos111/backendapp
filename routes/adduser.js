const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Render ajout_client form (optional, if you use server-side rendering)
router.get('/', (req, res) => {
    db.query('SELECT * FROM region', (err, regions) => {
        if (err) throw err;
        res.render('ajout_client', { regions });
    });
});

// Handle form submission (POST method)
router.post('/', (req, res) => {
    const { nom, prenom, age, ID_region } = req.body;

    // Check if all fields are provided
    if (!nom || !prenom || !age || !ID_region) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists in the database
    db.query(
        'SELECT * FROM client WHERE nom = ? AND prenom = ?',
        [nom, prenom],
        (err, results) => {
            if (err) {
                console.error('Error checking user existence:', err);
                return res.status(500).json({ error: 'Failed to check user existence' });
            }

            if (results.length > 0) {
                // User exists, update their information
                db.query(
                    'UPDATE client SET age = ?, ID_region = ? WHERE nom = ? AND prenom = ?',
                    [age, ID_region, nom, prenom],
                    (err) => {
                        if (err) {
                            console.error('Error updating user:', err);
                            return res.status(500).json({ error: 'Failed to update user' });
                        }
                        res.status(200).json({ message: 'User updated successfully' });
                    }
                );
            } else {
                // User does not exist, insert new user
                db.query(
                    'INSERT INTO client (nom, prenom, age, ID_region) VALUES (?, ?, ?, ?)',
                    [nom, prenom, age, ID_region],
                    (err) => {
                        if (err) {
                            console.error('Error inserting user:', err);
                            return res.status(500).json({ error: 'Failed to add user' });
                        }
                        res.status(201).json({ message: 'User added successfully' });
                    }
                );
            }
        }
    );
});

module.exports = router;
