const jwt = require('jsonwebtoken');

/**
 * Sign JWT token and attach it as an HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {string} userId - User ID database key
 * @returns {string} token
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretflonestkey1234!', {
    expiresIn: '30d'
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('token', token, cookieOptions);
  return token;
};

module.exports = generateToken;
