
import nodemailer from 'nodemailer';  // Import nodemailer
import dotenv from 'dotenv';  // Import dotenv for environment variables

// Load environment variables from .env file
dotenv.config();

// Create transporter using Gmail SMTP with TLS
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Gmail service
    auth: {
        user: process.env.SMTP_USER,  // Your Gmail address from .env
        pass: process.env.SMTP_PASS,  // Your Gmail app password from .env
    },
    secure: true,  // Use secure connection (SSL/TLS) for sending emails
    port: 465,  // SMTP port for SSL (secure connection)
    tls: {
        rejectUnauthorized: false,  // Only for development; set to true in production to ensure certificates are valid
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug only in development
    logger: process.env.NODE_ENV === 'development', // Log messages in development for troubleshooting
});

// Function to send the email
export const sendEmail = async (toEmail, userName) => {
    // Define the mail options, including the subject, recipient, and body
    const mailOptions = {
        from: process.env.SMTP_USER,  // Sender's email address
        to: toEmail,  // Recipient's email address
        subject: 'Welcome to My Website',
        text: `Hello ${userName},\n\nThank you for signing up! We are excited to have you with us.Your account has been created with email id:${email}`,
    };

    // Log the details of the email being prepared (useful for debugging)
    console.log('Preparing to send email with the following details:');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Text:', mailOptions.text);

    try {
        // Attempt to send the email and wait for the response
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:');
        console.log(info.response);  // Log the response from the email server
    } catch (error) {
        // If an error occurs, log the error with more context
        console.error('Error sending email:', error);
    }
};

// Example usage: Call the sendEmail function
sendEmail();  // Replace with actual recipient email and user name
