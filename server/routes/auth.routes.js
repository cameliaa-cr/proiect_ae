const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
const { isValidToken } = require('../utils/token');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({
            where: {
                email: email,
            }
        })

        if (!existingUser) {
            res.status(400).json({success: false, message: 'User not found', data: {}});
        }

        const isValidPassword = bcrypt.compareSync(password, existingUser.dataValues.password);

        if (!isValidPassword) {
            return res.status(400).json({success: false, message: 'Not the same password', data: {}})
        }

        const token = jwt.sign({id: existingUser.dataValues.id, role: existingUser.dataValues.role}, process.env.TOKEN_SECRET, {
            expiresIn: '1h'
        })

        res.status(200).json({success: true, message: 'Valid email and password', data: token});
    } catch (error) {
         res.status(500).json({success: false, message: 'Error creating user', data: error.message});
    }
})

router.post('/check', async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(401).json({success: false, message: 'No token provided', data: {}})
    }

    const validToken = isValidToken(token);

    if (!validToken) {
        return res.status(401).json({success: false, message: 'Invalid token', data: {}})
    }

    res.status(200).json({success: true, message: 'Token is valid', data: {}})
})

module.exports = router;