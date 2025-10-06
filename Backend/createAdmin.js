const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdmin = async (email, password, name) => {
    if (!email || !password || !name) {
        console.log('Please provide email, password, and name.');
        process.exit(1);
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User with this email already exists.');
            process.exit(1);
        }

        const adminUser = new User({
            name,
            email,
            password, // The pre-save hook will hash this
            role: 'admin' // Explicitly set the role
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
};

// Get arguments from command line
const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin';

createAdmin(email, password, name);