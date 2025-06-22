import React from "react";
import ArrayTestCases from "./ArrayTesting";
import DynamicArrayTestCases from "./DynamicArrayTesting";

/*
The array view component seres aws the page for the arrays section
It will display the animations from the ArrayAnimations file, and other components deemed necessary
*/

function ArrayView() {

  return (
    <>
      <div>
        <h1>Array Testing</h1>
        
        <ArrayTestCases></ArrayTestCases>
      </div><br></br>
      <div>
        <h1>Dynamic Array Testing</h1>
        <h2>Update when finished</h2>
        <DynamicArrayTestCases></DynamicArrayTestCases>
      </div>
    </>
  );
}

export default ArrayView;