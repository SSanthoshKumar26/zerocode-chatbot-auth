import express from 'express';

import { getUserData } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

// Route to get user data, using userAuth middleware for authentication
userRouter.get('/data', userAuth, getUserData);

export default userRouter; // Corrected to export userRouter
