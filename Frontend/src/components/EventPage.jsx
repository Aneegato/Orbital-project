import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useParams } from 'react-router-dom';

const EventPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        // Fetch event details
        axios.get(`/events/${eventId}`, { withCredentials: true })
            .then(response => {
                setEvent(response.data);
            })
            .catch(error => {
                console.error('Error fetching event:', error);
            });
    }, [eventId]);

    const handleEventChange = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
    };

    const handleUpdateEvent = async () => {
        try {
            await axios.put(`/events/${eventId}`, event, { withCredentials: true });
            console.log('Event updated successfully');
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Event</h1>
            <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={event.title}
                onChange={handleEventChange}
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={event.description}
                onChange={handleEventChange}
            />
            <input
                type="text"
                name="location"
                placeholder="Location"
                value={event.location}
                onChange={handleEventChange}
            />
            <input
                type="datetime-local"
                name="time"
                value={event.time}
                onChange={handleEventChange}
            />
            <button onClick={handleUpdateEvent}>Update Event</button>
        </div>
    );
};

export default EventPage;

