import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import axios from '../axiosConfig';
import './scheduler.css';
import ErrorBoundary from './ErrorBoundary';

// Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXlfd3VURmFdVk1+XUU=');

import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';

function Home() {
    const location = useLocation();
    const { userId } = location.state || {}; // Ensure userId is properly destructured
    const [events, setEvents] = useState([]);
    const baseURL = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        if (userId) {
            loadEvents();
        }
    }, [userId]);

    const loadEvents = async () => {
        try {
            const response = await axios.get(`${baseURL}/events?userId=${userId}`);
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
                userId, // Ensure userId is passed
                Subject: eventData.Subject,
                Description: eventData.Description,
                StartTime: eventData.StartTime,
                EndTime: eventData.EndTime,
                IsAllDay: eventData.IsAllDay,
                Location: eventData.Location
            };
            try {
                console.log('Sending event data:', formattedData);  // Log the data being sent
                await axios.post('${baseURL}/events', formattedData); // Removed 'auth'
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
                await axios.put(`${baseURL}/events/${eventData.Id}`, formattedData); // Removed 'auth'
                loadEvents();
            } catch (error) {
                console.error('Error updating event:', error);
            }
        } else if (args.requestType === 'eventRemove') {
            const eventData = args.deletedRecords[0];
            try {
                await axios.delete(`${baseURL}/events/${eventData.Id}`); // Removed 'auth'
                loadEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    return (
        <ErrorBoundary>
            <ScheduleComponent
                currentView="WorkWeek"
                eventSettings={{ dataSource: events }}
                actionBegin={handleActionBegin}
            >
                <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]} />
            </ScheduleComponent>
        </ErrorBoundary>
    );
}

export default Home;
