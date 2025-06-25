import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redisClient from '../../../config/redis.js';

const authController = {
  async register(req, res) {
    const { username, email, password } = req.body;
    try {
      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({ username, email, password: hashedPassword });

      // Return the created user (excluding password)
      const { password: _, ...userData } = newUser.toJSON();
      return res.status(201).json(userData);
      
    } catch (err) {
      console.error('Error during registration:', err.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      await redisClient.set(`token:${user.id}`, token, {
        EX: 3600, // 1 hour
      });

      // Set token as a cookie (optional) and/or send as response
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
      });

      const { password: _, ...userData } = user.toJSON();
      return res.status(200).json({ token, user: userData });

    } catch (err) {
      console.error('Error logging in:', err.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export default authController;
