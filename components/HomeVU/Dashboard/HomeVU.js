import React from 'react';
import {CurrentlyOnline} from './CurrentlyOnline/CurrentlyOnline.component';
import UpcomingCalls from './UpcomingCalls/UpcomingCalls.component';
import PastCalls from './PastCalls/PastCalls.component';
import FilesAndRecordings from './FilesAndRecordings/FilesAndRecordings.components';
import NavBar from '../../NavBar/NavBar.component';

export default function HomeVU() {
    return (
        <section>
            <h1>
                Welcome!
            
            </h1>
            <CurrentlyOnline/>
            <UpcomingCalls />
            <PastCalls />
            <FilesAndRecordings />
            <NavBar/>
        </section>
    )

}
