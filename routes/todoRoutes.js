

const express = require('express');
const router = express.Router(); // Create a new router instance
const Todo = require('../models/todoModel'); // Import the Todo model

// --- API Endpoints (CRUD Operations) ---

// GET all To-Do items
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({}).sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Server error fetching todos', error: error.message });
    }
});

// POST a new To-Do item
router.post('/', async (req, res) => {
    const { text, priority, dueDate } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Task text cannot be empty.' });
    }

    try {
        const newTodo = new Todo({
            text: text.trim(),
            priority: priority || '',
            dueDate: dueDate ? new Date(dueDate) : null
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Error adding todo:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        res.status(500).json({ message: 'Server error adding todo', error: error.message });
    }
});

// PATCH (Update) a To-Do item by ID
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (updates.dueDate) {
        updates.dueDate = new Date(updates.dueDate);
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'To-Do item not found.' });
        }
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid To-Do ID format.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        res.status(500).json({ message: 'Server error updating todo', error: error.message });
    }
});

// DELETE a To-Do item by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'To-Do item not found.' });
        }
        res.status(200).json({ message: 'To-Do item deleted successfully.' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid To-Do ID format.' });
        }
        res.status(500).json({ message: 'Server error deleting todo', error: error.message });
    }
});

module.exports = router; // Export the router
