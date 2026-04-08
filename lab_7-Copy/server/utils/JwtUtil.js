const jwt = require('jsonwebtoken');
const JwtUtil = {
  genToken(id) {
    return jwt.sign({ id: id }, 'SECRET_KEY', { expiresIn: '1d' });
  },
  checkToken(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
        if (err) return res.json({ success: false, message: 'Token invalid' });
        req.decoded = decoded;
        next();
      });
    } else {
      return res.json({ success: false, message: 'No token provided' });
    }
  }
};
module.exports = JwtUtil;   