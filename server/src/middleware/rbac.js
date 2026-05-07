/**
 * rbac — Role-Based Access Control middleware.
 * Accepts an array of allowed roles and checks the user's role against it.
 * This is the second layer of verification (backend DB level).
 *
 * Usage: router.get('/admin', auth, rbac(['admin']), controller)
 */
export const rbac = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};
