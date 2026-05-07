import AuditLog from '../models/AuditLog.js';

// GET /api/audit/logs
export const getLogs = async (req, res, next) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const filter = { organizationId: req.user.organizationId };

    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(200);

    res.json(logs);
  } catch (error) {
    next(error);
  }
};
