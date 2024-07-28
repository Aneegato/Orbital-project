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
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { registerLicense } from '@syncfusion/ej2-base';
import ErrorBoundary from './ErrorBoundary';
import './scheduler.css';
import { parseICSFile } from '../utils/parseICS'; // Adjust the path as needed
import { getModules, getModuleDetails } from '../nusmodsService'; // Adjust the path as needed

registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXlfd3VURmFdVk1+XUU=');

const CalendarPage = ({ userId }) => {
    const { calendarId } = useParams();
    const [calendar, setCalendar] = useState(null);
    const [events, setEvents] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [moduleTimetable, setModuleTimetable] = useState([]);
    const scheduleRef = useRef(null);
    const baseURL = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        console.log('Fetching calendar details for calendarId:', calendarId);

        // Fetch calendar details
        axios.get(`${baseURL}/calendars/${calendarId}`)
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
            const response = await axios.get(`${baseURL}/calendars/${calendarId}/events`);
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
            const modulesData = await getModules(); // Fetch module list for 2024-2025
            setModules(modulesData);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const fetchModuleTimetable = async (moduleCode) => {
        try {
            const moduleDetails = await getModuleDetails('2024-2025', moduleCode); // Fetch module details
            setModuleTimetable(moduleDetails.semesterData[0].timetable); // Assuming semester 1
        } catch (error) {
            console.error('Error fetching module timetable:', error);
        }
    };

    const handleModuleChange = (e) => {
        const moduleCode = e.value;
        setSelectedModule(moduleCode);
        fetchModuleTimetable(moduleCode);
    };

    const addModuleToCalendar = async () => {
        try {
            const newEvents = moduleTimetable.map(lesson => ({
                userId, // Ensure userId is included
                calendarId, // Ensure calendarId is included
                Subject: `${selectedModule} ${lesson.lessonType}`,
                Description: `Class No: ${lesson.classNo}`,
                StartTime: new Date(`2024-08-12T${lesson.startTime}:00`), // Assuming classes start from 12th Aug 2024
                EndTime: new Date(`2024-08-12T${lesson.endTime}:00`),
                IsAllDay: false,
                Location: lesson.venue,
                CategoryColor: '#1aaa55'
            }));
            console.log('Adding new events:', newEvents); // Log new events
            await Promise.all(newEvents.map(event => axios.post(`${baseURL}/events`, event)));
            loadEvents();
        } catch (error) {
            console.error('Error adding module to calendar:', error);
            console.log('Error response:', error.response); // Log the full error response
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
                await axios.post(`${baseURL}/events`, formattedData);
                loadEvents();
            } catch (error) {
                console.error('Error creating event:', error);
                console.log('Error response:', error.response); // Log the full error response
            }
        } else if (args.requestType === 'eventChange') {
            const eventData = args.changedRecords[0];
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
                console.log(`Updating event with ID: ${eventData.Id}`);
                await axios.put(`${baseURL}/events/${eventData.Id}`, formattedData);
                loadEvents();
            } catch (error) {
                console.error('Error updating event:', error);
                console.log('Error response:', error.response); // Log the full error response
            }
        } else if (args.requestType === 'eventRemove') {
            const eventId = args.deletedRecords[0].Id;
            try {
                console.log(`Deleting event with ID: ${eventId}`);
                await axios.delete(`${baseURL}/events/${eventId}`);
                loadEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                console.log('Error response:', error.response); // Log the full error response
            }
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const parsedEvents = parseICSFile(e.target.result, calendarId, userId);
                addParsedEvents(parsedEvents);
            };
            reader.readAsText(file);
        }
    };

    const addParsedEvents = async (parsedEvents) => {
        try {
            for (const event of parsedEvents) {
                event.userId = userId;
                event.calendarId = calendarId;
                await axios.post(`${baseURL}/events`, event);
            }
            loadEvents();
        } catch (error) {
            console.error('Error adding parsed events:', error);
            console.log('Error response:', error.response); // Log the full error response
        }
    };

    return (
        <div className='scheduler-container'>
            <ErrorBoundary>
                <h1>{calendar.name}</h1>
                {calendar && (
                    <div>
                        <DropDownListComponent
                            dataSource={modules}
                            fields={{ text: 'moduleCode', value: 'moduleCode' }}
                            placeholder="Select a module"
                            value={selectedModule}
                            change={handleModuleChange}
                        />
                        <button onClick={addModuleToCalendar} disabled={!selectedModule}>Add Module to Calendar</button>
                        <input type="file" accept=".ics" onChange={handleFileUpload} />
                        <ScheduleComponent
                            ref={scheduleRef}
                            height="550px"
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
                        {moduleTimetable.length > 0 && (
                            <div>
                                <h3>Module Timetable</h3>
                                <ul>
                                    {moduleTimetable.map((lesson, index) => (
                                        <li key={index}>{`${lesson.lessonType} ${lesson.classNo}: ${lesson.day} ${lesson.startTime} - ${lesson.endTime} at ${lesson.venue}`}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default CalendarPage;
