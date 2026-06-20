import React from "react";
import StaticArrayQueueTestCases from "./StaticArrayQueueTester";
import DynamicArrayQueueTestCases from "./DynamicArrayQueueTester";
import LinkedQueueTestCases from "./LinkedQueueTester";

/*
Page for queues
*/

function QueueView() {
    return (
      <>
        <h1>Queue Testing</h1>
        <h2>Update when finished</h2>
        <h3>Linked Queue Test Cases</h3>
        <LinkedQueueTestCases></LinkedQueueTestCases><br></br><br></br>
        <h3>Dynamic Array Queue Test Cases</h3>
        <DynamicArrayQueueTestCases></DynamicArrayQueueTestCases><br></br><br></br>
        <h3>Fixed Array Queue Test Cases</h3>
        <StaticArrayQueueTestCases></StaticArrayQueueTestCases><br></br><br></br>
      </>
    );
  }
  
  export default QueueView;