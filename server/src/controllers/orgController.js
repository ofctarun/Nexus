import Organization from '../models/Organization.js';

// GET /api/org
export const getOrganization = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.user.organizationId);
    if (!org) return res.status(404).json({ message: 'Organization not found.' });
    res.json(org);
  } catch (error) {
    next(error);
  }
};
