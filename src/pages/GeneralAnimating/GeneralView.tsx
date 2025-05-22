import React from 'react';
import RectangleTestCases from './RectangleTesting';
import TextTestCases from './TextTesting';
import CircleTestCases from './CircleTesting';

/* 
This page is just to show and test the most basic animations being used in this project
It will be removed from the final deployment
*/



function GeneralView() {
    return (
        <div>
            <h1>General View</h1>
            <h2>Remove this page after testing</h2>
            <h3>Testing Rectangle Class</h3>
            <RectangleTestCases></RectangleTestCases><br></br><br></br>
            <h3>Testing Text Class</h3>
            <TextTestCases></TextTestCases><br></br><br></br>
            <h3>Testing Circle Class</h3>
            <CircleTestCases></CircleTestCases>
        </div>
    );
}

export default GeneralView;

