const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// In-memory storage for inquiries (in a real app, use a database)
let inquiries = [];
let nextId = 1;

// API endpoint to handle form submissions
app.post('/api/inquiries', (req, res) => {
    try {
        const { name, email, company, message } = req.body;
        
        // Simple validation
        if (!name || !email || !company || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email address' 
            });
        }
        
        // Create inquiry object
        const inquiry = {
            id: nextId++,
            name,
            email,
            company,
            message,
            createdAt: new Date()
        };
        
        // Store the inquiry (in memory)
        inquiries.push(inquiry);
        
        // In a real application, you would save to a database here
        console.log('New inquiry received:', inquiry);
        
        // Send success response
        res.json({ 
            success: true, 
            message: 'Inquiry submitted successfully',
            inquiry 
        });
        
    } catch (error) {
        console.error('Error processing inquiry:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Serve the HTML file for all other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the website`);
});