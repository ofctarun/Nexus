import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { protect } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, inviteCode, orgName } = req.body;
    
    let organization;
    let role = 'Guest';

    if (inviteCode) {
      organization = await Organization.findOne({ inviteCode });
      if (!organization) return res.status(400).json({ message: 'Invalid invite code' });
      role = 'Member';
    } else if (orgName) {
      role = 'Admin';
    } else {
      return res.status(400).json({ message: 'Must provide invite code or organization name' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role, 
      organization: organization ? organization._id : null
    });

    if (role === 'Admin') {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      organization = await Organization.create({ name: orgName, inviteCode: code, admin: user._id });
      user.organization = organization._id;
      await user.save();
    }

    generateToken(res, user._id);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, organization: organization._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('organization');
    
    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user._id);
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, organization: user.organization });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
