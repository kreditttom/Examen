const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const checkAuth = require('../middleware/auth');

const router = express.Router();

function makeToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) { return res.status(400).json({ message: 'Заповніть усі поля' }); }
    if (password.length < 6) { return res.status(400).json({ message: 'Пароль мінімум 6 символів' }); }

    const exists = db.prepare('select id from users where email = ?').get(email);
    if (exists) { return res.status(400).json({ message: 'Такий email вже зареєстрований' }); }

    const hash = bcrypt.hashSync(password, 10);

    const result = db
        .prepare('insert into users (firstName, lastName, email, password) values (?, ?, ?, ?)')
        .run(firstName, lastName, email, hash);

    const userId = result.lastInsertRowid;
    res.status(201).json({
        token: makeToken(userId),
        user: { id: userId, firstName, lastName, email },
    });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) { return res.status(400).json({ message: 'Заповніть усі поля' });}

    const user = db.prepare('select * from users where email = ?').get(email);
    if (!user) {
        return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) {
        return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    res.json({
        token: makeToken(user.id),
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
    });
});

// GET /api/auth/me
router.get('/me', checkAuth, (req, res) => {
    const user = db
        .prepare('select id, firstName, lastName, email from users where id = ?')
        .get(req.userId);
    res.json(user);
});

module.exports = router;