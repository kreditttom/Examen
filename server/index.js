require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db');
const authRoutes = require('./routes/auth');
const violationRoutes = require('./routes/violations');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // з запасом, для фото пізніше - ШІ

// проста перевірка, що сервер живий (можна відкрити в браузері) - ШІ
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/violations', violationRoutes);

const PORT = process.env.PORT || 3000;
// '0.0.0.0' щоб телефон у тій же Wi-Fi мережі міг достукатись - ШІ
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server started on port ' + PORT);
});