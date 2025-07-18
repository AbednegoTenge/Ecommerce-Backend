import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redisClient from '../../../config/redis.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authController = {
  async home(req, res) {
    res.sendFile(path.join(__dirname, '../../../../Frontend/templates/index.html'));
  },

  async registerForm(req, res) {
    try {
      res.sendFile(path.join(__dirname, '../../../../Frontend/templates/registerForm.html'));
    } catch (err) {
      console.error('Error rendering form:', err.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async loginForm(req, res) {
    try {
      res.sendFile(path.join(__dirname, '../../../../Frontend/templates/loginForm.html'));
    } catch (err) {
      console.error('Error rendering form:', err.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async register(req, res) {
    const { name, email, password } = req.body;
    try {
      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({ name, email, password: hashedPassword });

      // Return the created user (excluding password)
      const { password: _, ...userData } = newUser.toJSON();
      return res.status(201).json({ message: 'User created successfully', user: userData });
      
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
  },

  async isLoggedIn(req, res) {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ loggedIn: false, message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const cachedToken = await redisClient.get(`token:${user.id}`);
      if (cachedToken !== token) {
        return res.status(401).json({ loggedIn: false });
      }

      return res.status(200).json({ loggedIn: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
      console.error('Error checking login status:', err.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async logout(req, res) {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await redisClient.del(`token:${decoded.id}`);
      }
      res.clearCookie('token');
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Logout error:', err.message);
      if (err.name == 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: 'Internal server error'})
    }
  }
}

export default authController;
