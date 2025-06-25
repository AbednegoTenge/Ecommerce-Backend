import jwt from 'jsonwebtoken';
import redisClient from '../../config/redis.js';


export const authMiddleware = async (req, res, next) => {
    // Extract token from cookies or Authorization header (Bearer token)
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    // If no token is found, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if the token exists and is valid in Redis (for logout/invalidation)
        const storedToken = await redisClient.get(`token:${decoded.id}`);
        if (!storedToken || storedToken !== token) {
            return res.status(401).json({ message: 'Token expired or invalidated' });
        }
        // Attach the decoded user payload to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error verifying token:', err.message);
        // Handle JWT verification errors (e.g., malformed, expired, invalid signature)
        return res.status(401).json({ message: 'Invalid Token' });
    }
}
