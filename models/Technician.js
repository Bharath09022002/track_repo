const mongoose = require('mongoose');

const TechnicianSchema = new mongoose.Schema({
    technicianId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'TECHNICIAN' },
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Technician', TechnicianSchema);
