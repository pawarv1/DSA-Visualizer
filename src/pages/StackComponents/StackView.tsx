import React from "react";
import StaticArrayStackTestCases from "./StaticArrayStackTester";
import DynamicArrayStackTestCases from "./DynamicArrayStackTester";
import LinkedStackTestCases from "./LinkedStackTester";

/*
Page for stacks
*/

function StackView() {
    return (
      <>
        <h1>Stack Testing</h1>
        <h2>Update when finished</h2>
        <h3>Linked Stack Test Cases</h3>
        <LinkedStackTestCases></LinkedStackTestCases><br></br><br></br>
        <h3>Dynamic Array Stack Test Cases</h3>
        <DynamicArrayStackTestCases></DynamicArrayStackTestCases><br></br><br></br>
        <h3>Fixed Array Stack Test Cases</h3>
        <StaticArrayStackTestCases></StaticArrayStackTestCases><br></br><br></br>
      </>
    );
  }
  
  export default StackView;