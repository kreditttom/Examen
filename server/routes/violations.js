const express = require('express');
const db = require('../db');
const checkAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/violations/dates?from=2026-10-01&to=2026-11-09
// дн в яких є правопорушення
router.get('/dates', (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) { return res.status(400).json({ message: 'Потрібні from і to' });}

    const rows = db
        .prepare('select distinct date from violations where date >= ? and date <= ?')
        .all(from, to);

    res.json(rows.map((row) => row.date));
});

// GET /api/violations/locations
// усі координати
router.get('/locations', (req, res) => {
    const rows = db
        .prepare('select id, latitude, longitude from violations where latitude is not null and longitude is not null')
        .all();
    res.json(rows);
});

// GET /api/violations/by-date?date=2026-10-31
// правопорушення за ктнй ден
router.get('/by-date', (req, res) => {
    const { date } = req.query;
    if (!date) { return res.status(400).json({ message: 'Потрібна date' });}

    const rows = db
        .prepare(`
      select v.*, u.firstName, u.lastName
      from violations v
      join users u on u.id = v.userId
      where v.date = ?
      order by v.id
    `)
        .all(date);
    res.json(rows);
});

// GET /api/violations/by-location?lat=49.99&lng=36.23
// правопорушення в одній точці
router.get('/by-location', (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (isNaN(lat) || isNaN(lng)) { return res.status(400).json({ message: 'Потрібні lat і lng' });}

    const delta = 0.0001;
    const rows = db
        .prepare(`
      select v.*, u.firstName, u.lastName
      from violations v
      join users u on u.id = v.userId
      where abs(v.latitude - ?) < ? and abs(v.longitude - ?) < ?
      order by v.id
    `)
        .all(lat, delta, lng, delta);
    res.json(rows);
});

// POST /api/violations
// тільки для залогінених
router.post('/', checkAuth, (req, res) => {
    const { description, url, date, time, latitude, longitude } = req.body;

    if (!description || !date) { return res.status(400).json({ message: 'Потрібні опис і дата' });}

    const result = db
        .prepare('insert into violations (description, url, date, time, userId, latitude, longitude) values (?, ?, ?, ?, ?, ?, ?)')
        .run(description, url || null, date, time || null, req.userId, latitude ?? null, longitude ?? null);

    res.status(201).json({ id: result.lastInsertRowid });
});

module.exports = router;