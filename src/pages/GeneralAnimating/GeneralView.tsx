import React from 'react';
import RectangleTestCases from './RectangleTesting';
import TextTestCases from './TextTesting';

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
            <TextTestCases></TextTestCases>
        </div>
    );
}

export default GeneralView;

