const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // You will likely need this for matchPassword
const { validationResult } = require('express-validator');

// --- FIXED generateToken function ---
// It now accepts 'role' and adds it to the JWT payload
const generateToken = (id, role) => {
    const payload = { id, role };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.create({ name, email, password, role });

        // FIX: Pass both the ID and the role to generate the token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error('ERROR IN REGISTER CONTROLLER:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate user & get token
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // I assume you have a user model with a matchPassword method
        // Also, fetch the password which might be excluded by default
        const user = await User.findOne({ email }).select('+password');

        // You likely need bcrypt to compare passwords
        if (user && (await bcrypt.compare(password, user.password))) {
            // FIX: Pass both the ID and the role to generate the token
            const token = generateToken(user._id, user.role);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('ERROR IN LOGIN CONTROLLER:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current user data
exports.getMe = async (req, res) => {
    // req.user is set by the 'protect' middleware
    res.status(200).json(req.user);
};