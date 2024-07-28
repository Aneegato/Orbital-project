// Scheduler.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Scheduler = () => {
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [moduleTimetable, setModuleTimetable] = useState([]);
    const [selectedTimetableDetail, setSelectedTimetableDetail] = useState(null); // New state for selected timetable detail
    const userId = "yourUserId"; // Replace with actual user ID
    const calendarId = "yourCalendarId"; // Replace with actual calendar ID
    const baseURL = "https://f38e-58-140-20-247.ngrok-free.app"; // Replace with actual base URL

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await axios.get(`${baseURL}/modules`);
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const fetchModuleTimetable = async (moduleCode) => {
        try {
            const response = await axios.get(`${baseURL}/modules/${moduleCode}/timetable`);
            setModuleTimetable(response.data);
        } catch (error) {
            console.error('Error fetching module timetable:', error);
        }
    };

    const handleModuleChange = (e) => {
        const selectedCode = e.target.value;
        setSelectedModule(selectedCode);
        fetchModuleTimetable(selectedCode);
    };

    const handleTimetableDetailClick = (detail) => {
        setSelectedTimetableDetail(detail);
    };

    const addSelectedDetailToCalendar = async () => {
        if (!selectedTimetableDetail) return;
        const event = {
            userId,
            calendarId,
            Subject: `${selectedModule} ${selectedTimetableDetail.lessonType}`,
            Description: `Class No: ${selectedTimetableDetail.classNo}`,
            StartTime: new Date(`2024-08-12T${selectedTimetableDetail.startTime}:00`),
            EndTime: new Date(`2024-08-12T${selectedTimetableDetail.endTime}:00`),
            IsAllDay: false,
            Location: selectedTimetableDetail.venue,
            CategoryColor: '#1aaa55'
        };
        try {
            await axios.post(`${baseURL}/events`, event);
            // Reload events if necessary
        } catch (error) {
            console.error('Error adding event to calendar:', error);
        }
    };

    return (
        <div className="scheduler-container">
            <h1>Scheduler</h1>
            <div>
                <select value={selectedModule} onChange={handleModuleChange}>
                    <option value="">Select a module</option>
                    {modules.map((module) => (
                        <option key={module.moduleCode} value={module.moduleCode}>
                            {module.moduleCode}
                        </option>
                    ))}
                </select>
                <button onClick={addSelectedDetailToCalendar} disabled={!selectedTimetableDetail}>
                    Add Selected Detail to Calendar
                </button>
                <div>
                    {moduleTimetable.map((lesson) => (
                        <button key={lesson.classNo} onClick={() => handleTimetableDetailClick(lesson)}>
                            {`${lesson.lessonType} - ${lesson.classNo} (${lesson.startTime} - ${lesson.endTime})`}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Scheduler;
