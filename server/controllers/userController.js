import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    console.log('User ID from middleware:', req.userId);  // Debug log to check if userId is set

    try {
        const userId = req.userId;  // Access the userId set by the middleware

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is missing' });
        }

        const user = await userModel.findById(userId);  // Use userId to find the user in the database

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            },
        });
    } catch (error) {
        console.error('Error in getUserData:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
