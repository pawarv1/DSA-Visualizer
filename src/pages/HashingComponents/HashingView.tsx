import React from "react";
import HashSetTestCases from "./HashSetTester";
import HashMapTestCases from "./HashMapTester";
import LinearProbingTestCases from "./LinearProbingTester";
import QuadraticProbingTestCases from "./QuadraticProbingTester";

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
        <HashMapTestCases></HashMapTestCases><br></br><br></br>
        <h3>Linear Probing Test Cases</h3>
        <LinearProbingTestCases></LinearProbingTestCases><br></br><br></br>
        <h3>Quadratic Probing Test Cases</h3>
        <QuadraticProbingTestCases></QuadraticProbingTestCases><br></br><br></br>
      </div>
    </>
  );
}

export default HashingView;