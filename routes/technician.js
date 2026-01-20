const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// @route   POST api/technician/location
// @desc    Update technician location for all active jobs
router.post('/location', auth, async (req, res) => {
    const { technicianId, location } = req.body;
    try {
        // Update all jobs assigned to this technician that are not completed
        await Job.updateMany(
            { technicianId, status: { $ne: 'COMPLETED' } },
            { $set: { technicianLocation: location } }
        );
        res.json({ msg: 'Location updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/technician/:technicianId/location
// @desc    Get technician's current location
router.get('/:technicianId/location', auth, async (req, res) => {
    try {
        // Find the most recent job for this technician that has location data
        const job = await Job.findOne({
            technicianId: req.params.technicianId,
            technicianLocation: { $exists: true },
            status: { $in: ['ASSIGNED', 'IN_PROGRESS'] }
        }).sort({ updatedAt: -1 });

        if (!job || !job.technicianLocation) {
            return res.status(404).json({ msg: 'Location not available' });
        }

        res.json({ location: job.technicianLocation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
