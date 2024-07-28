import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getModuleDetails } from '../nusmodsService';

const ModuleDetails = () => {
  const { moduleCode } = useParams();
  const [moduleDetails, setModuleDetails] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const data = await getModuleDetails('2024-2025', moduleCode);
        setModuleDetails(data);
      } catch (error) {
        console.error(`Error fetching details for module ${moduleCode}:`, error);
      }
    };

    fetchModuleDetails();
  }, [moduleCode]);

  return (
    <div>
      <h2>Module Details</h2>
      {moduleDetails ? (
        <div>
          <h3>{moduleDetails.title}</h3>
          <p>{moduleDetails.description}</p>
          {/* Display other module details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ModuleDetails;
