import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './Routes/AuthRoutes.js';
import userRouter from './Routes/userRoutes.js';
import { getUserData } from './controllers/userController.js'; 
import userAuth from './middleware/userAuth.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

// CORS configuration

app.use(cors({
  origin: "https://zerocode-chatbot-auth.vercel.app/", 
  credentials: true
}));

connectDB();

// Root endpoint to test if the API is working
app.get('/', (req, res) => res.send('API Working Fine'));

// Protected route for fetching user data
app.get('/api/auth/user', userAuth, getUserData);  // Ensure this route exists

// Use the Auth and User routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
