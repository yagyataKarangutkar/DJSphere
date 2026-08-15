/**
 * Middleware to restrict access based on user roles
 * @param {...string} roles - Permitted roles (e.g., 'club_admin', 'super_admin')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, please log in first' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not authorized to access this resource`,
      });
    }

    next();
  };
};

/**
 * Middleware allowing only club_admin or super_admin
 */
export const adminMiddleware = authorizeRoles('club_admin', 'super_admin');

/**
 * Middleware allowing only super_admin
 */
export const superAdminMiddleware = authorizeRoles('super_admin');

export default adminMiddleware;
