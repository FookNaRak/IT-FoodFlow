const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

// Open the SQLite database
const db = new sqlite3.Database('./itfoodflow.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS menu (
            menuID INTEGER PRIMARY KEY AUTOINCREMENT,
            shopID INTEGER NOT NULL,
            menuName TEXT NOT NULL,
            menuPrice INTEGER NOT NULL
        )`);
    }
});

// API to get all menu items
app.get('/api/menu', (req, res) => {
    db.all('SELECT * FROM menu', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// API to add a new menu item
app.post('/api/menu', (req, res) => {
    const { shopID, menuName, menuPrice } = req.body;
    const sql = 'INSERT INTO menu (shopID, menuName, menuPrice) VALUES (?, ?, ?)';
    db.run(sql, [shopID, menuName, menuPrice], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ menuID: this.lastID });
        }
    });
});

// API to update a menu item
app.put('/api/menu/:id', (req, res) => {
    const { menuName, menuPrice } = req.body;
    const sql = 'UPDATE menu SET menuName = ?, menuPrice = ? WHERE menuID = ?';
    db.run(sql, [menuName, menuPrice, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ updatedRows: this.changes });
        }
    });
});

// API to delete a menu item
app.delete('/api/menu/:id', (req, res) => {
    const sql = 'DELETE FROM menu WHERE menuID = ?';
    db.run(sql, req.params.id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ deletedRows: this.changes });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
