import AuditLog from '../models/AuditLog.js';

/**
 * audit — Middleware factory to log critical actions to the database.
 *
 * Usage: router.post('/login', audit('LOGIN'), controller)
 */
export const audit = (action) => {
  return async (req, res, next) => {
    // Store the original res.json to intercept the response
    const originalJson = res.json.bind(res);

    res.json = (data) => {
      // Log after the response is determined
      const logEntry = {
        userId: req.user?._id || data?.user?._id,
        userName: req.user?.name || data?.user?.name,
        organizationId: req.user?.organizationId || data?.user?.organizationId,
        action,
        ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
        result: res.statusCode < 400 ? 'success' : 'failure',
        details: data?.message || '',
      };

      // Only log if we have enough info
      if (logEntry.userId && logEntry.organizationId) {
        AuditLog.create(logEntry).catch((err) => {
          console.error('Audit log error:', err.message);
        });
      }

      return originalJson(data);
    };

    next();
  };
};

/**
 * Helper to log audit events directly (for use in controllers).
 */
export const logAuditEvent = async ({ userId, userName, organizationId, action, ipAddress, result, details }) => {
  try {
    await AuditLog.create({
      userId,
      userName,
      organizationId,
      action,
      ipAddress: ipAddress || 'unknown',
      result: result || 'success',
      details: details || '',
    });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};
