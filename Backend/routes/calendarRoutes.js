const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CalendarModel = require('../models/Calendar');
const EventModel = require('../models/Event'); // Assuming you have an Event model

// Create Calendar Route
router.post('/', async (req, res) => {
    const { name, ownerId, userIds } = req.body;
    console.log('Creating calendar with:', { name, ownerId, userIds });

    if (!ownerId) {
        return res.status(400).send({ error: 'ownerId is required' });
    }

    try {
        const calendar = new CalendarModel({
            name,
            owner: new mongoose.Types.ObjectId(ownerId),
            users: userIds ? userIds.map(id => new mongoose.Types.ObjectId(id)) : []
        });
        await calendar.save();
        res.status(201).send(calendar);
    } catch (error) {
        console.error('Error creating calendar:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Get Calendars for a specific user
router.get('/user-calendars/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const calendars = await CalendarModel.find({
            $or: [{ owner: userId }, { users: userId }]
        }).populate('owner users');
        res.json(calendars);
    } catch (error) {
        console.error('Error getting calendars:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get All Calendars Route
router.get('/', async (req, res) => {
    try {
        const calendars = await CalendarModel.find().populate('owner users');
        res.json(calendars);
    } catch (error) {
        console.error('Error getting calendars:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Single Calendar by ID Route
router.get('/:id', async (req, res) => {
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

// Get Events by Calendar ID Route
router.get('/:calendarId/events', async (req, res) => {
    const { calendarId } = req.params;
    try {
        const events = await EventModel.find({ calendarId: new mongoose.Types.ObjectId(calendarId) });
        if (!events.length) {
            return res.status(404).send({ error: 'No events found for this calendar' });
        }
        res.json(events);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update Calendar Route
router.put('/:id', async (req, res) => {
    try {
        const calendar = await CalendarModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('owner users');
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
