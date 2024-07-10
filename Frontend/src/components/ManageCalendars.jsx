import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const ManageCalendars = ({ userId: propUserId }) => {
    const location = useLocation();
    const userId = propUserId || location.state?.userId;

    const [calendarName, setCalendarName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [calendars, setCalendars] = useState([]);

    useEffect(() => {
        if (!userId) {
            console.error('User ID is undefined. Please log in again.');
            return;
        }

        console.log('Fetching users and calendars for userId:', userId);

        // Fetch all users on component mount
        axios.get('http://localhost:5001/users')
            .then(response => {
                setAllUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

        // Fetch calendars for the logged-in user
        axios.get(`http://localhost:5001/calendars/user-calendars/${userId}`)
            .then(response => {
                setCalendars(response.data);
            })
            .catch(error => {
                console.error('Error fetching calendars:', error);
            });
    }, [userId]);

    const handleUserSelection = (userId) => {
        setSelectedUsers(prevSelectedUsers =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter(id => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    const handleCreateCalendar = async () => {
        if (!calendarName) {
            console.error('Calendar name is required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/calendars', {
                name: calendarName,
                ownerId: userId,
                userIds: selectedUsers
            });
            console.log('Calendar created successfully:', response.data);
            setCalendars([...calendars, response.data]);
        } catch (error) {
            console.error('Error creating calendar:', error);
        }
    };

    if (!userId) {
        return <div>Invalid user ID. Please log in again.</div>;
    }

    return (
        <div>
            <h1>Manage Calendars</h1>
            <input
                type="text"
                placeholder="Calendar Name"
                value={calendarName}
                onChange={e => setCalendarName(e.target.value)}
            />
            <h2>Select Users</h2>
            <ul>
                {allUsers.map(user => (
                    <li key={user._id}>
                        <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleUserSelection(user._id)}
                        />
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
            <button onClick={handleCreateCalendar}>Create Calendar</button>
            <h2>Your Calendars</h2>
            <ul>
                {calendars.map(calendar => (
                    <li key={calendar._id}>
                        <Link to={`/calendars/${calendar._id}`}>{calendar.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageCalendars;

