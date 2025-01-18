import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import nodemailer from 'nodemailer';  // Import nodemailer
import userModel from '../models/userModel.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

// Helper function to set cookies
const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Manually set Gmail's SMTP server
    port: 465,  // SSL Port for Gmail (use 587 for TLS)
    secure: true,  // Use SSL for port 465 (set to false for port 587 and use TLS)
    auth: {
        user: process.env.SMTP_USER,  // Your Gmail address from .env
        pass: process.env.SMTP_PASS,  // Your Gmail app password from .env
    },
    tls: {
        rejectUnauthorized: false,  // Allow SSL connection even with certificate issues (for development)
    },
    debug: true,  // Enable debug mode (optional)
    logger: true,  // Log messages (optional)
});

// Function to send the welcome email
const sendEmail = async (toEmail, userName) => {
    const mailOptions = {
        from: process.env.SMTP_USER,  // Sender's email address (from .env)
        to: toEmail,  // Recipient's email address
        subject: 'Welcome to My Website',
        text: `   Hello ${userName},Thank you for signing up! 
                  We are excited to have you with us. 
                  YOUR ACCOUNT HAS BEEN CREATED.,
        
    By
    COMPANYTEAM`
        
    };

    console.log('Preparing to send email with the following details:');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Text:', mailOptions.text);

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:');
        console.log(info.response);
    } catch (error) {
        console.log('Error sending email:');
        console.error(error);
    }
};
// Register function
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
        return res.json({ success: false, message: 'Invalid email format' });
    }

    // Check password strength
    if (password.length < 8) {
        return res.json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        // Hash password before saving user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email: normalizedEmail, password: hashedPassword });
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set token as a cookie
        setTokenCookie(res, token);

        // Send welcome email to the user
        try {
            await sendEmail(savedUser.email, savedUser.name);  // Send email
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        // Return success response
        return res.json({ success: true, token, user: { name: savedUser.name, email: savedUser.email } });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.json({ success: false, message: 'Error during registration. Please try again later.' });
    }
};
// Login function for user authentication
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Incorrect password' });
        }

        // Create a JWT token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Send token as a cookie
        setTokenCookie(res, token);

        // Return success response with user data and token
        return res.json({
            success: true,
            token,
            user: { name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.json({ success: false, message: 'Error during login. Please try again later.' });
    }
};



// Logout function
export const logout = async (req, res) => {
    try {
        // Clear the cookie that holds the JWT token
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        // Return success response
        return res.json({ success: true, message: 'Logged Out' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.json({ success: false, message: 'Error during logout. Please try again later.' });
    }
};
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req;  // Get userId from req (set by userAuth middleware)

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Check if the account is already verified
        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account Already Verified' });
        }

        // Generate a random 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Set OTP and expiration time (24 hours from now)
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 24 hours

        await user.save();

        // Prepare the email to send OTP
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
        
            subject: 'Account Verification OTP',
            //text: Your OTP is ${otp}. Verify your account using this OTP.,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification OTP Sent to Email' });
    } catch (error) {
        console.error('Error during OTP sending:', error);
        res.json({ success: false, message: error.message });
    }
};
export const verifyEmail = async (req, res) => {
    const { otp } = req.body; // Extract OTP from the request body

    // Check if OTP is provided
    if (!otp) {
        return res.status(400).json({ success: false, message: 'OTP is required' });
    }

    try {
        const userId = req.userId; // Get userId from req (set by userAuth middleware)

        // Fetch the user from the database
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the account is already verified
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        // If OTP is not generated or expired, re-generate and send it
        if (!user.verifyOtp || user.verifyOtpExpireAt < Date.now()) {
            await sendVerifyOtp({ body: { userId: user._id } }, res); // Send a new OTP
            return res.status(400).json({ 
                success: false, 
                message: 'OTP has expired or is missing. A new OTP has been sent to your email.' 
            });
        }

        // Validate the OTP
        if (user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Mark the account as verified
        user.isAccountVerified = true;
        user.verifyOtp = ''; // Clear the OTP after successful verification
        user.verifyOtpExpireAt = null; // Clear the OTP expiration time
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error during email verification:', error);
         res.status(500).json({ success: false, message: 'An error occurred during email verification. Please try again later.' });
    }
};

export const isAuthenticated = async (req, res) => {
    try {
      // Assuming that the JWT token is stored in the request headers or cookies
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized. Please login." });
      }
  
      // Verify the token (You can use your userAuth middleware here instead)
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  
      if (!decodedToken) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
      }
  
      // You can optionally fetch user data using the decoded token (e.g., user ID)
      const user = await userModel.findById(decodedToken.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      // If everything is fine, respond with success
      return res.status(200).json({ success: true, message: "User is authenticated." });
    } catch (error) {
      console.error("Error in isAuthenticated:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
//sending password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Update user with OTP and expiration time
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Password Reset OTP",
            //text: Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        console.error("Error sending reset OTP:", error);
        return res.json({ success: false, message: "An error occurred while sending the OTP" });
    }
};

//reset user password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Validate request body
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {
        // Find the user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Validate OTP
        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        // Check if OTP has expired
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP has expired' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear OTP fields
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.json({ success: false, message: 'An error occurred while resetting the password' });
    }
};