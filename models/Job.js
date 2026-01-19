const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    technicianId: { type: String, required: true },
    userLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    technicianLocation: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED'],
        default: 'ASSIGNED'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
