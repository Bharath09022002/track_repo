const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Technician = require('../models/Technician');

// @route   POST api/auth/login
// @desc    Mock login for both roles
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        let user = await User.findOne({ phone });
        let role = 'USER';
        let id = '';

        if (!user) {
            user = await Technician.findOne({ phone });
            if (user) {
                role = 'TECHNICIAN';
                id = user.technicianId;
            }
        } else {
            id = user.userId;
        }

        if (!user || user.password !== password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: id,
                role: role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id, name: user.name, phone: user.phone, role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
