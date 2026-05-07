import mongoose from 'mongoose';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/tokenUtils.js';
import { generateInviteCode } from '../utils/inviteCode.js';
import { logAuditEvent } from '../middleware/audit.js';

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, orgAction, inviteCode, orgName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    let organizationId;
    let role = 'member';

    if (orgAction === 'create') {
      // Create both records with a shared ObjectId to satisfy required refs
      const userId = new mongoose.Types.ObjectId();

      // Create a new organization — this user becomes admin
      const org = await Organization.create({
        name: orgName,
        inviteCode: generateInviteCode(),
        createdBy: userId,
      });
      organizationId = org._id;
      role = 'admin';

      // Create user
      const user = await User.create({
        _id: userId,
        name,
        email,
        password,
        role,
        organizationId,
      });

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      setRefreshTokenCookie(res, refreshToken);

      await logAuditEvent({
        userId: user._id,
        userName: user.name,
        organizationId,
        action: 'LOGIN',
        ipAddress: req.ip,
        details: 'Registered and created organization',
      });

      return res.status(201).json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, organizationId },
        accessToken,
        inviteCode: org.inviteCode,
      });
    } else {
      // Join existing organization
      const org = await Organization.findOne({ inviteCode });
      if (!org) {
        return res.status(404).json({ message: 'Invalid invite code.' });
      }
      organizationId = org._id;

      const user = await User.create({ name, email, password, role, organizationId });

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      setRefreshTokenCookie(res, refreshToken);

      await logAuditEvent({
        userId: user._id,
        userName: user.name,
        organizationId,
        action: 'LOGIN',
        ipAddress: req.ip,
        details: 'Registered and joined organization',
      });

      return res.status(201).json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, organizationId },
        accessToken,
      });
    }
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account has been deactivated.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    await logAuditEvent({
      userId: user._id,
      userName: user.name,
      organizationId: user.organizationId,
      action: 'LOGIN',
      ipAddress: req.ip,
    });

    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken }).select('+refreshToken');
      if (user) {
        await logAuditEvent({
          userId: user._id,
          userName: user.name,
          organizationId: user.organizationId,
          action: 'LOGOUT',
          ipAddress: req.ip,
        });

        user.refreshToken = null;
        await user.save();
      }
    }

    clearRefreshTokenCookie(res);
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/refresh
export const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken || !user.isActive) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({ message: 'Invalid refresh token.' });
    }

    // Rotate refresh token
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId },
      accessToken: newAccessToken,
    });
  } catch (error) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ message: 'Invalid refresh token.' });
  }
};
