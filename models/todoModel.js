// D:\to-do-list\models\todoModel.js

const mongoose = require('mongoose');

// --- Mongoose Schema for Todo Tasks ---
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Task text is required'],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', ''], // Empty string for no priority
        default: ''
    },
    dueDate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Mongoose Model from the schema and export it
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo; // Export the Todo model
