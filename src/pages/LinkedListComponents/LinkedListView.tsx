import React from "react";
import LinkedListTestCases from "./LinkedListTesting";
import DoublyLLTestCases from "./DoublyLLTesting";

/*
Page for linked lists
*/

//FixMe Animation 1 is broken

function LinkedListView() {
    return (
      <>
        <h1>Linked List Testing</h1>
        <h2>Update when finished</h2>
        <LinkedListTestCases></LinkedListTestCases><br></br><br></br>
        <DoublyLLTestCases></DoublyLLTestCases>
      </>
    );
  }
  
  export default LinkedListView;