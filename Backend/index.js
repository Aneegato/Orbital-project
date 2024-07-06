const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const EmployeeModel = require('./models/Employee');
const EventModel = require('./models/Event');
const CalendarModel = require('./models/Calendar');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('DB Connected!'))
    .catch(err => console.error('DB Connection Error:', err));

// Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`);

    EmployeeModel.findOne({ email })
        .then(user => {
            if (user) {
                console.log(`User found: ${user}`);
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    if (isMatch) {
                        console.log("Password matched");
                        return res.json({ message: "Success", name: user.name, userId: user._id });
                    } else {
                        console.log("Password incorrect");
                        return res.status(401).json("The password is incorrect");
                    }
                });
            } else {
                console.log("Account does not exist");
                return res.status(404).json("The account does not exist");
            }
        })
        .catch(err => {
            console.error(`Error finding user: ${err.message}`);
            return res.status(500).json({ error: err.message });
        });
});

// Register Route
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

// Create Calendar Route
app.post('/calendars', async (req, res) => {
    const { name, ownerId, userIds } = req.body;
    console.log('Creating calendar with:', { name, ownerId, userIds });

    if (!ownerId) {
        return res.status(400).send({ error: 'ownerId is required' });
    }

    try {
        const calendar = new CalendarModel({
            name,
            owner: new mongoose.Types.ObjectId(ownerId),
            users: userIds.map(id => new mongoose.Types.ObjectId(id))
        });
        await calendar.save();
        res.status(201).send(calendar);
    } catch (error) {
        console.error('Error creating calendar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Get All Calendars Route
app.get('/calendars', async (req, res) => {
    try {
        const calendars = await CalendarModel.find().populate('owner users');
        res.json(calendars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Calendar by ID Route
app.get('/calendars/:id', async (req, res) => {
    try {
        const calendar = await CalendarModel.findById(req.params.id).populate('owner users');
        if (!calendar) {
            return res.status(404).send();
        }
        res.send(calendar);
    } catch (error) {
        console.error('Error getting calendar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Update Calendar Route
app.put('/calendars/:id', async (req, res) => {
    try {
        const calendar = await CalendarModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('owner users');
        if (!calendar) {
            return res.status(404).send();
        }
        res.send(calendar);
    } catch (error) {
        console.error('Error updating calendar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Delete Calendar Route
app.delete('/calendars/:id', async (req, res) => {
    try {
        const calendar = await CalendarModel.findByIdAndDelete(req.params.id);
        if (!calendar) {
            return res.status(404).send();
        }
        res.send(calendar);
    } catch (error) {
        console.error('Error deleting calendar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Adjust existing event routes to handle calendarId
app.get('/events', async (req, res) => {
    const { calendarId } = req.query;
    try {
        const events = await EventModel.find({ calendarId });
        res.json(events);
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
        console.error('Error saving event:', error);
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

// Add this route to your backend code
app.get('/users', async (req, res) => {
    try {
        const users = await EmployeeModel.find({}, 'name email'); // Only select necessary fields
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
