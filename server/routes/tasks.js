const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

//add task
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
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
});

//get tasks by userId
router.get('/:userId', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.params.userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

//update task
router.patch('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true } 
        );
        
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

//delete task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

//get unique categories for a user
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