import React, { useState, useEffect, useRef } from 'react';
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
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { registerLicense } from '@syncfusion/ej2-base';
import ErrorBoundary from './ErrorBoundary';
import './scheduler.css';
import { parseICSFile } from '../utils/parseICS'; // Adjust the path as needed

// Syncfusion license key
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
        axios.get(`http://localhost:5001/calendars/${calendarId}`)
            .then(response => {
                console.log('Fetched calendar:', response.data);
                setCalendar(response.data);
            })
            .catch(error => {
                console.error('Error fetching calendar:', error);
            });

        // Fetch events for this calendar
        loadEvents();

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
                Description: event.Description,
                CategoryColor: event.CategoryColor || '#1aaa55' // Add a default color if none provided
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
                Location: eventData.Location,
                CategoryColor: eventData.CategoryColor || '#1aaa55' // Add a default color if none provided
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
                Location: eventData.Location,
                CategoryColor: eventData.CategoryColor || '#1aaa55' // Add a default color if none provided
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
                await axios.post('http://localhost:5001/events', event);
            }
            loadEvents();
        } catch (error) {
            console.error('Error adding parsed events:', error);
        }
    };

    const editorHeaderTemplate = (props) => {
        return (
            <div id="event-header">
                {(props !== undefined) ? ((props.Subject) ? <div>{props.Subject}</div> : <div>Create New Event</div>) : <div></div>}
            </div>
        );
    }

    const editorTemplate = (props) => {
        return ((props !== undefined) ?
            <table className="custom-event-editor" style={{ width: '100%' }} cellPadding={5}>
                <tbody>
                    <tr>
                        <td className="e-textlabel">Summary</td>
                        <td colSpan={4}>
                            <input id="Summary" className="e-field e-input" type="text" name="Subject" style={{ width: '100%' }} />
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Color</td>
                        <td colSpan={4}>
                            <DropDownListComponent id="CategoryColor" placeholder='Choose color' data-name='CategoryColor' className="e-field" style={{ width: '100%' }}
                                dataSource={['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF']} />
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">From</td>
                        <td colSpan={4}>
                            <DateTimePickerComponent id="StartTime" format='dd/MM/yy hh:mm a' data-name="StartTime" value={new Date(props.startTime || props.StartTime)} className="e-field" />
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">To</td><td colSpan={4}>
                            <DateTimePickerComponent id="EndTime" format='dd/MM/yy hh:mm a' data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field" />
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Description</td><td colSpan={4}>
                            <textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50} style={{ width: '100%', height: '60px !important', resize: 'vertical' }}></textarea>
                        </td>
                    </tr>
                    <tr>
                        <td className="e-textlabel">Location</td><td colSpan={4}>
                            <input id="Location" className="e-field e-input" type="text" name="Location" style={{ width: '100%' }} />
                        </td>
                    </tr>
                </tbody>
            </table> : <div></div>);
    }

    return (
        <ErrorBoundary>
            <div className="calendar-page">
                {calendar ? (
                    <div>
                        <h1>{calendar.name}</h1>
                        <input type="file" accept=".ics" onChange={handleFileUpload} />
                        <ScheduleComponent
                            height="550px"
                            ref={scheduleRef}
                            selectedDate={new Date()}
                            eventSettings={{ dataSource: events }}
                            actionBegin={handleActionBegin}
                            editorTemplate={editorTemplate}
                        >
                            <ViewsDirective>
                                <ViewDirective option="Day" />
                                <ViewDirective option="Week" />
                                <ViewDirective option="WorkWeek" />
                                <ViewDirective option="Month" />
                                <ViewDirective option="Agenda" />
                            </ViewsDirective>
                            <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]} />
                        </ScheduleComponent>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default CalendarPage;








