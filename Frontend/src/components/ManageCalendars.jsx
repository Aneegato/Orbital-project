import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';




const ManageCalendars = ({ userId: propUserId }) => {
  const location = useLocation();
  const userId = propUserId || location.state?.userId;

  const [calendarName, setCalendarName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [userEmailToAdd, setUserEmailToAdd] = useState('');

  useEffect(() => {
    if (!userId) {
      console.error('User ID is undefined. Please log in again.');
      return;
    }
  
    console.log('Fetching users and calendars for userId:', userId);
  
    axios.get(`/users`, { withCredentials: true })
      .then(response => {
        setAllUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  
    axios.get(`/calendars/user-calendars/${userId}`, { withCredentials: true })
      .then(response => {
        setCalendars(response.data);
      })
      .catch(error => {
        console.error('Error fetching calendars:', error);
      });
  }, [userId]);
  
  const handleCreateCalendar = async () => {
    if (!calendarName) {
      console.error('Calendar name is required');
      return;
    }
  
    try {
      const userIds = selectedUsers.map(user => user.userId);
      const response = await axios.post(`/calendars`, {
        name: calendarName,
        ownerId: userId,
        userIds
      }, { withCredentials: true });
      console.log('Calendar created successfully:', response.data);
      setCalendars([...calendars, response.data]);
    } catch (error) {
      console.error('Error creating calendar:', error);
    }
  };
  

  const handleAddUserByEmail = () => {
    const user = allUsers.find(user => user.email === userEmailToAdd);
    if (user) {
      handleUserSelection(user._id, user.name);
      setUserEmailToAdd('');
    } else {
      console.error('User email not found');
    }
  };

  if (!userId) {
    return <div>Invalid user ID. Please log in again.</div>;
  }

  return (
    <div>
      <h1>New Calendar</h1>
      <input
        type="text"
        placeholder="Calendar Name"
        value={calendarName}
        onChange={e => setCalendarName(e.target.value)}
      />
      <h2>Add Collaborator</h2>
      <input
        type="text"
        placeholder="User Email"
        value={userEmailToAdd}
        onChange={e => setUserEmailToAdd(e.target.value)}
      />
      <button onClick={handleAddUserByEmail}><FontAwesomeIcon icon={faPlus} />
      </button>
      <div>
        {selectedUsers.map(user => (
          <span key={user.userId}>{user.userName}</span>
        ))}
      </div>
      <button onClick={handleCreateCalendar}>Create Calendar</button>
      </div>
  );
};

export default ManageCalendars;

