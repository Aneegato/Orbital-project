import React from 'react';
import './scheduler.css';


import { Inject,ScheduleComponent,Day,Week,WorkWeek,Month,Agenda } from '@syncfusion/ej2-react-schedule';

function Home() {
    return <ScheduleComponent>
        <Inject services={[Day,Week,WorkWeek,Month,Agenda]} />
    </ScheduleComponent>
}

export default Home;