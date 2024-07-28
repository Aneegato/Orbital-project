import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
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
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { registerLicense } from '@syncfusion/ej2-base';
import ErrorBoundary from './ErrorBoundary';
import './scheduler.css';
import { parseICSFile } from '../utils/parseICS'; // Adjust the path as needed

registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXlfd3VURmFdVk1+XUU=');

const CalendarPage = ({ userId }) => {
    const { calendarId } = useParams();
    const [calendar, setCalendar] = useState(null);
    const [events, setEvents] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const scheduleRef = useRef(null);

    useEffect(() => {
        console.log('Fetching calendar details for calendarId:', calendarId);

        // Fetch calendar details
        axios.get(`/calendars/${calendarId}`)
            .then(response => {
                console.log('Fetched calendar:', response.data);
                setCalendar(response.data);
            })
            .catch(error => {
                console.error('Error fetching calendar:', error);
            });

        // Fetch events for this calendar
        loadEvents();
        // Fetch module list
        fetchModules();
    }, [calendarId]);

    const loadEvents = async () => {
        try {
            const response = await axios.get(`/calendars/${calendarId}/events`);
            console.log('Fetched events:', response.data); // Log fetched events
            setEvents(response.data.map(event => ({
                Id: event._id,
                Subject: event.Subject,
                StartTime: new Date(event.StartTime),
                EndTime: new Date(event.EndTime),
                IsAllDay: event.IsAllDay,
                Location: event.Location,
                Description: event.Description,
                CategoryColor: event.CategoryColor || '#1aaa55' // Add a default color if none provided
            })));
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    const fetchModules = async () => {
        try {
            const response = await axios.get('/modules/list');
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
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
                Location: eventData.Location,
                CategoryColor: eventData.CategoryColor || '#1aaa55' // Add a default color if none provided
            };
            try {
                console.log('Sending event data:', formattedData);
                await axios.post(`/events`, formattedData);
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
                Location: eventData.Location,
                CategoryColor: eventData.CategoryColor || '#1aaa55' // Add a default color if none provided
            };
            try {
                console.log(`Updating event with ID: ${eventData.Id}`);
                await axios.put(`/events/${eventData.Id}`, formattedData);
                loadEvents();
            } catch (error) {
                console.error('Error updating event:', error);
            }
        } else if (args.requestType === 'eventRemove') {
            const eventId = args.deletedRecords[0].Id;
            try {
                console.log(`Deleting event with ID: ${eventId}`);
                await axios.delete(`/events/${eventId}`);
                loadEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    return (
        <div className='scheduler-container'>
            <ErrorBoundary>
                <h1>Calendar Page</h1>
                {calendar && (
                    <div>
                        <h2>{calendar.name}</h2>
                        <DropDownListComponent
                            dataSource={modules}
                            fields={{ text: 'ModuleCode', value: 'ModuleCode' }}
                            placeholder="Select a module"
                            value={selectedModule}
                            change={(e) => setSelectedModule(e.value)}
                        />
                        <ScheduleComponent
                            ref={scheduleRef}
                            height='650px'
                            selectedDate={new Date()}
                            eventSettings={{ dataSource: events }}
                            actionBegin={handleActionBegin}
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
                    </div>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default CalendarPage;
