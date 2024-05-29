const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const EmployeeModel = require('./models/employee'); // Ensure this path is correct

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
const corsOptions = {
    origin: '*', // In a production environment, specify allowed origins
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// MongoDB connection
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.DB_URI, dbOptions)
    .then(() => console.log('DB Connected!'))
    .catch(err => console.error('DB Connection Error:', err));

// Define the /login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`); // Log email

    EmployeeModel.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log(`User found: ${user}`); // Log user details
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else if (isMatch) {
                        console.log("Password matched"); // Log password match
                        res.json("Success");
                    } else {
                        console.log("Password incorrect"); // Log incorrect password
                        res.status(401).json("The password is incorrect");
                    }
                });
            } else {
                console.log("Account does not exist"); // Log non-existent account
                res.status(404).json("The account does not exist");
            }
        })
        .catch(err => {
            console.error(`Error finding user: ${err.message}`);
            res.status(500).json({ error: err.message });
        });
});

// Register endpoint
app.post('/register', async (req, res) => {
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


// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
