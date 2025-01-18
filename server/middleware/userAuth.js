import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    // Retrieve token from cookies or headers
    const token = req.cookies?.token || 
                  (req.headers.authorization?.startsWith('Bearer ') 
                    ? req.headers.authorization.split(' ')[1] 
                    : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing. Please login again.',
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token structure. Please login again.',
      });
    }

    // Attach user information to request object
    req.userId = decodedToken.id;
    req.user = decodedToken; // Attach full token payload if needed
    next();
  } catch (error) {
    console.error('JWT verification error:', {
      message: error.message,
      stack: error.stack,
      ip: req.ip,
      token: process.env.NODE_ENV === 'production' ? 'HIDDEN' : req.cookies?.token || req.headers.authorization,
    });

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};

export default userAuth;
