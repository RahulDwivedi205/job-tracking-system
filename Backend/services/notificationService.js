const nodemailer = require('nodemailer');

let io;
const userSockets = new Map(); // Maps userId -> socket.id

/**
 * Initializes the Socket.IO instance and sets up connection listeners.
 * @param {object} socketIoInstance - The Socket.IO server instance.
 */
exports.setupSocket = (socketIoInstance) => {
    io = socketIoInstance;
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Get userId from the handshake query and map it to the socket id
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSockets.set(userId, socket.id);
            console.log(`User ${userId} connected.`);
        }

        socket.on('disconnect', () => {
            // Clean up the map on disconnect
            userSockets.forEach((value, key) => {
                if (value === socket.id) {
                    userSockets.delete(key);
                    console.log(`User ${key} disconnected.`);
                }
            });
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

/**
 * Sends a notification. Can be a panel notification or an email.
 * @param {string} target - The target user's ID (for panel) or email address.
 * @param {string} titleOrMessage - The subject (for email) or message (for panel).
 * @param {string} [optionalMessage] - The body text (for email).
 */
exports.sendNotification = (target, titleOrMessage, optionalMessage) => {
    // If target contains '@', assume it's an email
    if (target.includes('@')) {
        sendEmail(target, titleOrMessage, optionalMessage);
    } else { // Otherwise, it's a userId for a panel notification
        const socketId = userSockets.get(target);
        if (socketId) {
            io.to(socketId).emit('notification', { message: titleOrMessage });
            console.log(`Sent panel notification to user ${target}`);
        }
    }
};

/**
 * Sends an email using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The email subject.
 * @param {string} text - The plain text body of the email.
 */
const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not set in .env. Skipping email notification.');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `Job Tracker <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};