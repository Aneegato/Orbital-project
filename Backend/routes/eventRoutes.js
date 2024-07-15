const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const EventModel = require('../models/Event');

// Validate ObjectId middleware
const validateObjectId = (req, res, next) => {
    const { calendarId, userId } = req.query;
    if (calendarId && !mongoose.Types.ObjectId.isValid(calendarId)) {
        return res.status(400).send({ error: 'Invalid calendar ID' });
    }
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({ error: 'Invalid user ID' });
    }
    next();
};

// Get Events by Calendar ID or User ID Route
router.get('/', validateObjectId, async (req, res) => {
    const { calendarId, userId } = req.query;
    try {
        let events;
        if (calendarId) {
            events = await EventModel.find({ calendarId: new mongoose.Types.ObjectId(calendarId) });
        } else if (userId) {
            events = await EventModel.find({ userId: new mongoose.Types.ObjectId(userId) });
        } else {
            return res.status(400).send({ error: 'Calendar ID or User ID must be provided' });
        }
        if (!events.length) {
            return res.status(404).send({ error: 'No events found' });
        }
        res.json(events);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create Event Route
router.post('/', async (req, res) => {
    const { Subject, StartTime, EndTime, IsAllDay, Location, Description, userId, calendarId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(calendarId)) {
        return res.status(400).send({ error: 'Invalid calendar ID' });
    }
    try {
        const event = new EventModel({ Subject, StartTime, EndTime, IsAllDay, Location, Description, userId, calendarId });
        await event.save();
        res.status(201).send(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Update Event Route
router.put('/:id', async (req, res) => {
    const { calendarId } = req.body;
    if (calendarId && !mongoose.Types.ObjectId.isValid(calendarId)) {
        return res.status(400).send({ error: 'Invalid calendar ID' });
    }
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

// Delete Event Route
router.delete('/:id', async (req, res) => {
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

module.exports = router;
