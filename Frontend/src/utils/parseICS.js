import ICAL from 'ical.js';

export const parseICSFile = (data, calendarId, userId) => {
    const jcalData = ICAL.parse(data);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    let eventList = [];

    vevents.forEach(vevent => {
        const startDate = new Date(vevent.getFirstPropertyValue('dtstart').toString());
        const endDate = new Date(vevent.getFirstPropertyValue('dtend').toString());

        const event = {
            Subject: vevent.getFirstPropertyValue('summary'),
            Description: vevent.getFirstPropertyValue('description'),
            StartTime: startDate,
            EndTime: endDate,
            IsAllDay: vevent.getFirstPropertyValue('transp') === 'TRANSPARENT',
            Location: vevent.getFirstPropertyValue('location'),
            CategoryColor: '#1aaa55', // Default color
            calendarId,
            userId
        };

        if (vevent.getFirstPropertyValue('rrule')) {
            // Handle recurring events here if needed
        }

        eventList.push(event);
    });

    return eventList;
};
