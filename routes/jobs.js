const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');

// @route   POST api/jobs/create
// @desc    User creates a job
router.post('/create', auth, async (req, res) => {
    const { jobId, userId, technicianId, userLocation } = req.body;
    try {
        const newJob = new Job({
            jobId,
            userId,
            technicianId,
            userLocation,
            status: 'ASSIGNED'
        });
        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/jobs/user/:userId
// @desc    Fetch jobs for a user
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/jobs/technician/:technicianId
// @desc    Fetch jobs for a technician
router.get('/technician/:technicianId', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ technicianId: req.params.technicianId }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/jobs/status
// @desc    Update job status
router.post('/status', auth, async (req, res) => {
    const { jobId, status } = req.body;
    try {
        let job = await Job.findOne({ jobId });
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        job.status = status;
        await job.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/jobs/all
// @desc    Get all jobs (Admin only)
router.get('/all', auth, async (req, res) => {
    try {
        // Verify admin role
        const user = await User.findOne({ userId: req.user.id });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }

        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/jobs/:jobId
// @desc    Delete a job (Admin only)
router.delete('/:jobId', auth, async (req, res) => {
    try {
        // Verify admin role
        const user = await User.findOne({ userId: req.user.id });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }

        const job = await Job.findOne({ jobId: req.params.jobId });
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        await Job.deleteOne({ jobId: req.params.jobId });
        res.json({ msg: 'Job deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
