// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user'); // Adjust the path to your user model

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login user and generate JWT token
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user,
            });
        }

        req.login(user, { session: false }, async (error) => {
            if (error) {
                return res.status(500).json({ error: 'Login error' });
            }

            // Generate JWT token
            const payload = { id: user.id, email: user.email };
            const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

            return res.json({ token: `Bearer ${token}` });
        });
    })(req, res, next);
});

// Protected route to get the current user's information
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
