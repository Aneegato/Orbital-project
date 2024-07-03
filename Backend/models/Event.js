const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    Subject: { type: String, required: true },
    StartTime: { type: Date, required: true },
    EndTime: { type: Date, required: true },
    IsAllDay: { type: Boolean, required: true },
    Location: { type: String },
    Description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }
});

const EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;

