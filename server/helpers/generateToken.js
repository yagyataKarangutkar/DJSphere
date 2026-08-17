import jwt from 'jsonwebtoken';

/**
 * Generate JWT token containing user id and role
 * @param {string} id - User ID
 * @param {string} role - User Role
 * @returns {string} Signed JWT Token
 */
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};

/**
 * Helper to set HTTP-only cookie with JWT token
 * @param {object} res - Express response object
 * @param {string} token - Signed JWT Token
 */
export const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('token', token, cookieOptions);
};

export default generateToken;
