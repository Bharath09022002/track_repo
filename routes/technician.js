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

module.exports = router;
