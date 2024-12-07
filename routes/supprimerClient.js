const express = require('express');
const router = express.Router();
const db = require('../db/db');

// DELETE client by ID
router.delete('/:ID_client', (req, res) => {
    const ID_client = req.params.ID_client;

    if (!ID_client) {
        return res.status(400).json({ error: 'Client ID is required' });
    }

    db.query('DELETE FROM client WHERE ID_client = ?', [ID_client], (err, results) => {
        if (err) {
            console.error('Error deleting client:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
});

module.exports = router;
