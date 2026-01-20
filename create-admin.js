// Script to create admin user
// Run with: node create-admin.js

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ userId: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            userId: 'admin@gmail.com',
            name: 'Administrator',
            phone: 'admin@gmail.com',
            password: '1234', // In production, this should be hashed
            role: 'ADMIN'
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('Username: admin@gmail.com');
        console.log('Password: 1234');

        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
