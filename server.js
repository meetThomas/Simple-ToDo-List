// D:\to-do-list\server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS to handle cross-origin requests from frontend
const todoRoutes = require('./routes/todoRoutes'); // Import your To-Do routes

const app = express();
const PORT = process.env.PORT || 5000; // Backend will run on port 5000
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middleware ---
// Enable CORS for all origins during development. In production, you might restrict this.
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        // Exit process if DB connection fails
        process.exit(1);
    });

// --- API Routes ---
// Mount the To-Do routes under the /api/todos path
app.use('/api/todos', todoRoutes);

// --- Error Handling Middleware (Optional but recommended) ---
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send('Something broke!'); // Send a generic error response
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
