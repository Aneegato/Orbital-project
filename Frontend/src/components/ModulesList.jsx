import React, { useEffect, useState } from 'react';
import { getModules } from '../nusmodsService';

const ModulesList = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModules();
        setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    fetchModules();
  }, []);

  return (
    <div>
      <h2>Modules List</h2>
      <ul>
        {modules.map((module) => (
          <li key={module.moduleCode}>{module.moduleCode} - {module.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ModulesList;
