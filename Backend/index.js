const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { setupSocket } = require('./services/notificationService');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
// Replace with your frontend URL in production
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your React frontend URL
        methods: ["GET", "POST"]
    }
});

// Pass the 'io' instance to the notification service
setupSocket(io);

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allow server to accept JSON in request body

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// Define a simple root route for testing
app.get('/', (req, res) => {
    res.send('Job Tracker API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;