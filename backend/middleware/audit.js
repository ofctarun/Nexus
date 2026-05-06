import AuditLog from '../models/AuditLog.js';

export const auditLog = (action) => {
  return async (req, res, next) => {
    // Capture response to log after it finishes
    res.on('finish', async () => {
      if (req.user) {
        try {
          await AuditLog.create({
            user: req.user._id,
            organization: req.user.organization,
            action: action,
            details: `${req.method} ${req.originalUrl} - Status: ${res.statusCode}`,
            ip_address: req.ip,
            result: res.statusCode >= 400 ? 'Failure' : 'Success'
          });
        } catch (error) {
          console.error('Audit log failed', error);
        }
      }
    });
    next();
  };
};
