const mongoose = require('mongoose');
const User = require('./models/User');
const Technician = require('./models/Technician');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Technician.deleteMany({});

        // Create Mock User
        const user = new User({
            userId: 'USER001',
            name: 'Standard User',
            phone: 'user@gmail.com',
            password: '1234',
            role: 'USER'
        });

        // Create Mock Technician
        const technician = new Technician({
            technicianId: 'TECH001',
            name: 'Service Technician',
            phone: 'tech@gmail.com',
            password: '1234',
            role: 'TECHNICIAN',
            isAvailable: true
        });

        await user.save();
        await technician.save();

        console.log('Seed data created successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
