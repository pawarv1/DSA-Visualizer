import React from "react";
import StaticArrayStackTestCases from "./StaticArrayStackTester";

/*
Page for stacks
*/

function StackView() {
    return (
      <>
        <h1>Stack Testing</h1>
        <h2>Update when finished</h2>
        <h3>Fixed Array Stack Test Cases</h3>
        <StaticArrayStackTestCases></StaticArrayStackTestCases><br></br><br></br>
      </>
    );
  }
  
  export default StackView;