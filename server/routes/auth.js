const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ 
            message: 'Login successful',
            user: { id: user._id, fullName: user.fullName } 
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user data by ID 
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const Task = require('../models/Task');
        const tasks = await Task.find({ userId: req.params.id, isCompleted: false });
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const overdueCount = tasks.filter(task => {
            return task.dueDate && new Date(task.dueDate) < now;
        }).length;

        const userData = user.toObject();
        userData.stats.totalOverdue = overdueCount;

        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user stats' });
    }
});


// Update user profile
router.put('/update/:id', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        let updateData = { fullName, email };

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Reset user statistics
router.post('/reset-stats/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            $set: { 
                'stats.totalCreated': 0, 
                'stats.totalCompleted': 0, 
                'stats.totalDeleted': 0 
            }
        });
        res.json({ message: 'Statistics reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting stats' });
    }
});

module.exports = router;