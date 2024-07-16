const express = require('express');
const bcrypt = require('bcrypt');
const EmployeeModel = require('../models/Employee');

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`);

    try {
        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            console.log("Account does not exist");
            return res.status(404).json("The account does not exist");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password incorrect");
            return res.status(401).json("The password is incorrect");
        }

        console.log("Password matched");
        return res.json({ message: "Success", name: user.name, userId: user._id });
    } catch (error) {
        console.error(`Error logging in: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const employee = new EmployeeModel({
            name,
            email,
            password: hashedPassword,
        });
        await employee.save();
        res.status(201).json('User registered successfully');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
