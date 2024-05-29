const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle updating item amounts
app.post('/update-amount', (req, res) => {
    const { name, amount } = req.body;
    fs.readFile(path.join(__dirname, 'data', 'clothing.json'), (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const items = JSON.parse(data);
        const item = items.find(item => item.name === name);
        if (item) {
            item.amount = amount;
            fs.writeFile(path.join(__dirname, 'data', 'clothing.json'), JSON.stringify(items, null, 2), (err) => {
                if (err) return res.status(500).send('Error writing file');
                res.send({ success: true });
            });
        } else {
            res.status(404).send('Item not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
