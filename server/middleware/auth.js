const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: 'Немає токена' });
    }

    const token = header.split(' ')[1];

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = data.id;
        next();
    } catch (error) { return res.status(401).json({ message: 'Невірний токен' }); }
}

module.exports = checkAuth;