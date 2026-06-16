import React from "react";
import ArrayTestCases from "./ArrayTesting";
import DynamicArrayTestCases from "./DynamicArrayTesting";
import Array2DTestCases from "./Array2DTesting";

/*
Page for arrays
*/

function ArrayView() {

  return (
    <>
      <div>
        <h1>Dynamic Array Testing</h1>
        <h2>Update when finished</h2>
        <DynamicArrayTestCases></DynamicArrayTestCases>
      </div>
      <div>
        <h1>Array Testing</h1>
        <h2>Update when finished</h2>
        <ArrayTestCases></ArrayTestCases>
      </div><br></br>
      <div>
        <h1>2D Array Testing</h1>
        <h2>Update when finished</h2>
        <Array2DTestCases></Array2DTestCases>
      </div>
    </>
  );
}

export default ArrayView;