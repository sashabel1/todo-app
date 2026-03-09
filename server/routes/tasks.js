const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// add task + increment totalCreated
router.post('/', async (req, res) => {
    try {
        const { userId, title, description, dueDate, color, customCategory } = req.body;
        
        const newTask = new Task({
            userId,
            title,
            description,
            dueDate,
            color,
            customCategory
        });

        const savedTask = await newTask.save();

        await User.findByIdAndUpdate(userId, { 
            $inc: { 'stats.totalCreated': 1 } 
        });

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
});

// update task + track completion stats
router.patch('/:id', async (req, res) => {
    try {
        const oldTask = await Task.findById(req.params.id);
        if (!oldTask) return res.status(404).json({ message: 'Task not found' });

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true } 
        );

        const wasCompleted = oldTask.isCompleted;
        const isNowCompleted = updatedTask.isCompleted;

        if (!wasCompleted && isNowCompleted) {
            await User.findByIdAndUpdate(updatedTask.userId, { 
                $inc: { 'stats.totalCompleted': 1 } 
            });
        } else if (wasCompleted && !isNowCompleted) {
            await User.findByIdAndUpdate(updatedTask.userId, { 
                $inc: { 'stats.totalCompleted': -1 } 
            });
        }
        
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// get tasks by userId
router.get('/:userId', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// delete task + increment totalDeleted
router.delete('/:id', async (req, res) => {
    try {
        const taskToDelete = await Task.findById(req.params.id);
        
        if (!taskToDelete) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const userId = taskToDelete.userId;
        await Task.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(userId, { 
            $inc: { 'stats.totalDeleted': 1 } 
        });
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

// get unique categories for a user
router.get('/categories/:userId', async (req, res) => {
    try {
        const categories = await Task.distinct('customCategory', { userId: req.params.userId });
        const filteredCategories = categories.filter(cat => cat && cat.trim() !== '');
        res.status(200).json(filteredCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});

module.exports = router;