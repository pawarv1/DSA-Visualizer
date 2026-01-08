import React from "react";
import HashSetTestCases from "./HashSetTester";
import HashMapTestCases from "./HashMapTester";

/*
This pages shows the hasing animations
*/

function HashingView() {

  return (
    <>
      <div>
        <h1>Hashing Testing</h1>
        <h2>Update when finished</h2>
        <h3>Hash Set Test Cases</h3>
        <HashSetTestCases></HashSetTestCases><br></br><br></br>
        <h3>Hash Map Test Cases</h3>
        <HashMapTestCases></HashMapTestCases>
      </div>
    </>
  );
}

export default HashingView;