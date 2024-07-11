import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    ScheduleComponent,
    Day,
    Week,
    WorkWeek,
    Month,
    Agenda,
    Inject,
    DragAndDrop,
    Resize,
    ViewsDirective,
    ViewDirective
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import ErrorBoundary from './ErrorBoundary';
import './scheduler.css';

// Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXlfd3VURmFdVk1+XUU=');

const CalendarPage = ({ userId }) => {
    const { calendarId } = useParams();
    const [calendar, setCalendar] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        console.log('Fetching calendar details for calendarId:', calendarId);

        // Fetch calendar details
        axios.get(`http://localhost:5001/calendars/${calendarId}`)
            .then(response => {
                console.log('Fetched calendar:', response.data);
                setCalendar(response.data);
            })
            .catch(error => {
                console.error('Error fetching calendar:', error);
            });

        // Fetch events for this calendar
        axios.get(`http://localhost:5001/calendars/${calendarId}/events`)
            .then(response => {
                console.log('Fetched events:', response.data);
                setEvents(response.data.map(event => ({
                    Id: event._id,
                    Subject: event.Subject,
                    StartTime: new Date(event.StartTime),
                    EndTime: new Date(event.EndTime),
                    IsAllDay: event.IsAllDay,
                    Location: event.Location,
                    Description: event.Description
                })));
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    }, [calendarId]);

    const loadEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/calendars/${calendarId}/events`);
            console.log('Fetched events:', response.data); // Log fetched events
            setEvents(response.data.map(event => ({
                Id: event._id,
                Subject: event.Subject,
                StartTime: new Date(event.StartTime),
                EndTime: new Date(event.EndTime),
                IsAllDay: event.IsAllDay,
                Location: event.Location,
                Description: event.Description
            })));
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    const handleActionBegin = async (args) => {
        if (args.requestType === 'eventCreate') {
            const eventData = args.addedRecords[0];
            const formattedData = {
                userId,
                calendarId, // Ensure calendarId is included
                Subject: eventData.Subject,
                Description: eventData.Description,
                StartTime: eventData.StartTime,
                EndTime: eventData.EndTime,
                IsAllDay: eventData.IsAllDay,
                Location: eventData.Location
            };
            try {
                console.log('Sending event data:', formattedData);
                await axios.post('http://localhost:5001/events', formattedData);
                loadEvents();
            } catch (error) {
                console.error('Error creating event:', error);
            }
        } else if (args.requestType === 'eventChange') {
            const eventData = args.changedRecords[0];
            const formattedData = {
                Subject: eventData.Subject,
                Description: eventData.Description,
                StartTime: eventData.StartTime,
                EndTime: eventData.EndTime,
                IsAllDay: eventData.IsAllDay,
                Location: eventData.Location
            };
            try {
                console.log(`Updating event with ID: ${eventData.Id}`);
                await axios.put(`http://localhost:5001/events/${eventData.Id}`, formattedData);
                loadEvents();
            } catch (error) {
                console.error('Error updating event:', error);
            }
        } else if (args.requestType === 'eventRemove') {
            const eventData = args.deletedRecords[0];
            try {
                console.log(`Deleting event with ID: ${eventData.Id}`);
                await axios.delete(`http://localhost:5001/events/${eventData.Id}`);
                loadEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    if (!calendar) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{calendar.name}</h1>
            <ErrorBoundary>
                <ScheduleComponent
                    currentView="WorkWeek"
                    eventSettings={{ dataSource: events }}
                    actionBegin={handleActionBegin}
                    allowVirtualScrolling={true} // Corrected property name
                >
                    <ViewsDirective>
                        <ViewDirective option='Day' />
                        <ViewDirective option='Week' />
                        <ViewDirective option='WorkWeek' />
                        <ViewDirective option='Month' />
                        <ViewDirective option='Agenda' />
                    </ViewsDirective>
                    <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]} />
                </ScheduleComponent>
            </ErrorBoundary>
        </div>
    );
};

export default CalendarPage;






