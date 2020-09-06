require('dotenv').config()
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = (req.headers.authorization || '').split(/\s/)
    const token = authorizationHeader && (authorizationHeader.length > 0) && authorizationHeader[1]

    jwt.verify(token, process.env.AUTH_CONFIG, function(err, decoded) {
      console.log(decoded)
      if (decoded && decoded.id) {
        req.userId = decoded.id;

        next();      
      } else {
        res.status(403).json({
          message: 'Voce precisa estar logado para seguir'
        });
      }
  });
  } catch {
        res.status(401).json({
          message: new Error('Invalid request!')
        });
  }
};
