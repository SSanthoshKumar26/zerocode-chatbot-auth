import express from 'express';
import { 
    isAuthenticated,
    login, 
    logout, 
    register, 
    resetPassword, 
    sendResetOtp, 
    sendVerifyOtp, 
    verifyEmail 
} from '../controllers/authController.js'; // Ensure the file path and extension are correct
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

/**
 * User Registration
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', register);

/**
 * User Login
 * @route POST /api/auth/login
 * @desc Log in a user and return a token
 * @access Public
 */
authRouter.post('/login', login);

/**
 * User Logout
 * @route POST /api/auth/logout
 * @desc Log out the user and clear the session
 * @access Public
 */
authRouter.post('/logout', logout);

/**
 * Send OTP for Email Verification
 * @route POST /api/auth/send-verify-otp
 * @desc Send an OTP to verify user email
 * @access Private
 */
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);

/**
 * Verify User Email
 * @route POST /api/auth/verify-account
 * @desc Verify the user's email using OTP
 * @access Private
 */
authRouter.post('/verify-account', userAuth, verifyEmail);

/**
 * Check if User is Authenticated
 * @route GET /api/auth/is-auth
 * @desc Check if the user is authenticated
 * @access Private
 */
authRouter.get('/is-auth', userAuth, isAuthenticated);

/**
 * Send OTP for Password Reset
 * @route POST /api/auth/send-reset-otp
 * @desc Send an OTP for resetting the password
 * @access Public
 */
authRouter.post('/send-reset-otp', sendResetOtp);

/**
 * Reset Password
 * @route POST /api/auth/reset-password
 * @desc Reset the user's password using OTP
 * @access Public
 */
authRouter.post('/reset-password', resetPassword);

export default authRouter;
