const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MySQL database
const sequelize = new Sequelize('desktop_application', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

// Define User model
// Define User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Ensure email is unique
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


// Sync the database
sequelize.sync()
    .then(() => console.log('Database synchronized.'))
    .catch(err => console.error('Failed to synchronize database:', err));

// Login route
// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });

    if (user) {
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid credentials!' });
    }
});

// Sign-up route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'User created!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user.' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
