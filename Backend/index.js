const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const EmployeeModel = require('./models/Employee');
const EventModel = require('./models/Event');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('DB Connected!'))
    .catch(err => console.error('DB Connection Error:', err));

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`);

    EmployeeModel.findOne({ email: email })
        .then(user => {
            if (user) {
                console.log(`User found: ${user}`);
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    } else if (isMatch) {
                        console.log("Password matched");
                        res.json({ message: "Success", userId: user._id });
                    } else {
                        console.log("Password incorrect");
                        res.status(401).json("The password is incorrect");
                    }
                });
            } else {
                console.log("Account does not exist");
                res.status(404).json("The account does not exist");
            }
        })
        .catch(err => {
            console.error(`Error finding user: ${err.message}`);
            res.status(500).json({ error: err.message });
        });
});

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

app.get('/events', async (req, res) => {
    const { userId } = req.query;
    try {
        const event = await EventModel.find({ userId });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/events', async (req, res) => {
    try {
        const event = new EventModel(req.body);
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        console.error('Error saving event:', error);  // Log the error details
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


app.put('/events/:id', async (req, res) => {
    try {
        const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).send();
        }
        res.send(event);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.delete('/events/:id', async (req, res) => {
    try {
        const event = await EventModel.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).send();
        }
        res.send(event);
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
