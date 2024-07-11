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

    axios.get('http://localhost:5001/users')
      .then(response => {
        setAllUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    axios.get(`http://localhost:5001/calendars/user-calendars/${userId}`)
      .then(response => {
        setCalendars(response.data);
      })
      .catch(error => {
        console.error('Error fetching calendars:', error);
      });
  }, [userId]);

  const handleUserSelection = (userId, userName) => {
    setSelectedUsers(prevSelectedUsers =>
      prevSelectedUsers.some(user => user.userId === userId)
        ? prevSelectedUsers.filter(user => user.userId !== userId)
        : [...prevSelectedUsers, { userId, userName }]
    );
  };

  const handleCreateCalendar = async () => {
    if (!calendarName) {
      console.error('Calendar name is required');
      return;
    }

    try {
      const userIds = selectedUsers.map(user => user.userId);
      const response = await axios.post('http://localhost:5001/calendars', {
        name: calendarName,
        ownerId: userId,
        userIds
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
      <select onChange={(e) => handleUserSelection(e.target.value, e.target.selectedOptions[0].text)}>
        <option value="">Select a user</option>
        {allUsers.map(user => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      <div>
        {selectedUsers.map(user => (
          <span key={user.userId}>{user.userName}</span>
        ))}
      </div>
      <button onClick={handleCreateCalendar}>Create Calendar</button>
      <h2>Your Calendars</h2>
      <ul>
        {calendars.map(calendar => (
          <li key={calendar._id}>
            <Link to={`/calendars/${calendar._id}`} className="btn btn-info">{calendar.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCalendars;


