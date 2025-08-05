import React from "react";
import LinkedListTestCases from "./SLLTesting";
import DoublyLLTestCases from "./DLLTesting";
import DummyNodeSLLTestCases from "./DummyNodeSLLTesting";
import SentinelDLLTestCases from "./SentinelDLLTesting";
import CircularLLTestCases from "./CircularLLTesting";

/*
Page for linked lists
*/

function LinkedListView() {
    return (
      <>
        <h1>Linked List Testing</h1>
        <h2>Update when finished</h2>
        <h3>Circular SLL Test Cases</h3>
        <CircularLLTestCases></CircularLLTestCases>
        <h3>Sentinel DLL Test Cases</h3>
        <SentinelDLLTestCases></SentinelDLLTestCases><br></br><br></br>
        <h3>DLL Test Cases</h3>
        <DoublyLLTestCases></DoublyLLTestCases><br></br><br></br>
        <h3>Dummy Node SLL Test Cases</h3>
        <DummyNodeSLLTestCases></DummyNodeSLLTestCases><br></br><br></br>
        <h3>SLL Test Cases</h3>
        <LinkedListTestCases></LinkedListTestCases>
      </>
    );
  }
  
  export default LinkedListView;