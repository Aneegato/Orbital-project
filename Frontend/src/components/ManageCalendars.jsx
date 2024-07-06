import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCalendars = () => {
  const [calendarName, setCalendarName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [ownerId, setOwnerId] = useState('');

  useEffect(() => {
    // Fetch all users on component mount
    axios.get('http://localhost:5001/users')
      .then(response => {
        setAllUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleUserSelection = (userId) => {
    setSelectedUsers(prevSelectedUsers =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter(id => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleCreateCalendar = async () => {
    // Log values to verify they are correct
    console.log('Creating calendar with:', {
      name: calendarName,
      ownerId,
      userIds: selectedUsers
    });

    try {
      const response = await axios.post('http://localhost:5001/calendars', {
        name: calendarName,
        ownerId,
        userIds: selectedUsers
      });
      console.log('Calendar created successfully:', response.data);
    } catch (error) {
      console.error('Error creating calendar:', error);
    }
  };

  return (
    <div>
      <h1>Manage Calendars</h1>
      <input
        type="text"
        placeholder="Calendar Name"
        value={calendarName}
        onChange={e => setCalendarName(e.target.value)}
      />
      <h2>Select Calendar Owner</h2>
      <select value={ownerId} onChange={e => setOwnerId(e.target.value)}>
        <option value="" disabled>Select Owner</option>
        {allUsers.map(user => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
      <h2>Select Users</h2>
      <div>
        {allUsers.map(user => (
          <div key={user._id}>
            <label>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelection(user._id)}
              />
              {user.name} ({user.email})
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleCreateCalendar}>Create Calendar</button>
    </div>
  );
};

export default ManageCalendars;
