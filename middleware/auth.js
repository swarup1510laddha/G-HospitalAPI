const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Acess denied. No token provided');

    try {
        const decode = jwt.verify(token, config.get('clinic_jwtPrivateKey'));
        next();
    }
    catch(ex) {
        res.status(400).send('Invalid token');
    }
}

