// models/Calendar.js
const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
});

const CalendarModel = mongoose.model('Calendar', CalendarSchema);
module.exports = CalendarModel;
