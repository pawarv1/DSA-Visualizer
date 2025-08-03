import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import { Array } from './Array';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import gsap from 'gsap';

function ArrayTestCases() {
  let canvasWidth = 800;
  let canvasHeight = 600;

  // Array step callback
  const runArraySteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
      
    // General array initialization test case
    const step1 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "General array");
      testCaseHeader.draw(mainContext);
      const array = new Array(100, 100, 80, 50, [0, 1, 2, 3]);
      array.draw(mainContext);
      setIsAnimating(false);
    }

    // Check validity test case
    const step2 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Checking index validity method");
      const array = new Array (100, 100, 80, 50, ['A']);
      const text1 = new Text (100, 200, "Index -1 valid? =", 1, "16px Arial");
      const text2 = new Text (100, 300, "Index 0 valid? =", 1, "16px Arial");
      const text3 = new Text (100, 400, "Index 1 valid? =", 1, "16px Arial");
      const text4 =  new Text (230,200, "", 0);
      const text5 =  new Text (230,300, "", 0);
      const text6 =  new Text (230,400, "", 0);
      
      testCaseHeader.draw(staticContext);
      array.draw(staticContext);
      text1.draw(staticContext);
      text2.draw(staticContext);
      text3.draw(staticContext);

      // Should give a console error
      text4.setContent(array.checkIndexValidity(-1).toString());

      // Should not give a console error
      text5.setContent(array.checkIndexValidity(0).toString());
      
      // Should give a console error
      text6.setContent(array.checkIndexValidity(1).toString());
      
      gsap.to([text4, text5, text6], {
        opacity: 1,
        duration: 1,
        onUpdate: () => {
          mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
          text4.draw(mainContext);
          text5.draw(mainContext);
          text6.draw(mainContext);
        },
        onComplete: () => setIsAnimating(false)
      });
    }

    // Accessing an index test case
    const step3 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Array index access");
      const array = new Array (100, 100, 80, 50, ['A']);
      const text1 = new Text (100, 200, "Array[0] =");
      const text2 =  new Text (200,200, array.getElementAt(0), 0);

      testCaseHeader.draw(staticContext);
      array.draw(staticContext);
      text1.draw(staticContext);

      gsap.to(text2, {
        opacity: 1,
        duration: 1,
        onUpdate: () => {
          mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
          text2.draw(mainContext);
        },
        onComplete: () => setIsAnimating(false)
      });
    }

    // Changing element test case
    const step4 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Changing elements test case");
      const array = new Array (100, 100, 80, 50, ["CSC 325", "CSC 435", "CSC 415", "CSC 435", "CSC 399"]);
      testCaseHeader.draw(mainContext);
      array.draw(mainContext);
      const text1 = new Text (100, 200, "Array[4] = \"CSC 498\"");
      text1.draw(mainContext);
      setTimeout(() => {
        array.setElementAt(mainContext, 4, "CSC 498");
        setIsAnimating(false);
      }, 2000);
    }

    // Set opacity for a single cell test case
    const step5 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Changing opacity for a single cell");
      const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50]);
      testCaseHeader.draw(mainContext);
      array1.draw(mainContext);
      array1.setOpacity(mainContext, 0, 0.5);
      setIsAnimating(false);
    }

    // Set opacity for whole array test case
    const step6 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Changing opacity for whole array");
      const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50], 1);
      testCaseHeader.draw(mainContext);
      array1.draw(mainContext);
      array1.setOpacity(mainContext, "all", 0.5);
      setIsAnimating(false);
    }
    
    // Set outline color for a single cell test case
    const step7 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Changing outline color for a single cell");
      const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50]);
      testCaseHeader.draw(mainContext);
      array1.draw(mainContext);
      array1.setOutlineColor(mainContext, 0, "red");
      setIsAnimating(false);
    }

    // Set fill color for a single cell test case
    const step8 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Changing fill color for a single cell");
      const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50]);
      testCaseHeader.draw(mainContext);
      array1.draw(mainContext);
      array1.setFillColor(mainContext, 0, "yellow");
      setIsAnimating(false);
    }

    // Getting array length test case
    const step9 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Checking array length");
      const array = new Array (100, 100, 80, 50, ['A', 'B', 'C', 'D', 'E', 'F']);
      const text1 = new Text (100, 200, "Array Length =");
      const text2 =  new Text (215,200, array.getArraySize().toString());

      testCaseHeader.draw(mainContext);
      array.draw(mainContext);
      text1.draw(mainContext);
      text2.draw(mainContext);
      setIsAnimating(false);
    }

    // Swapping two values in the array test case
    const step10 = async () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Swapping two elements of the array");
      const array = new Array (50, 100, 80, 50, ['a', 'b', 'c', 'd', 'e']);
      testCaseHeader.draw(mainContext);
      array.draw(mainContext);
      await array.swapElements(mainContext, 0, 4);
      setIsAnimating(false);
    }

    // Clearing an array test case
    const step11 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Clearing an array");
      const array = new Array (100, 100, 80, 50, [2,4,6,8]);
      testCaseHeader.draw(mainContext);
      array.draw(mainContext);
      setTimeout(() => {
        array.clear(mainContext);
        setIsAnimating(false);
      }, 2000);
    }

    // Printing array
    const step12 = async () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Traversing through an array and printing");
      const array = new Array (50, 100, 30, 30, ["A", "B", "C", "D", "E", "F", "G", "H"]);
      testCaseHeader.draw(mainContext);
      array.draw(mainContext);
      await array.print(mainContext);
      setIsAnimating(false);
    }

    // Creating an empty array test case
    const step13 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Creating an empty array");
      const array = new Array (100, 100, 80, 50, []);
      testCaseHeader.draw(mainContext);
      array.draw(mainContext);
      setIsAnimating(false);
    }
    

    // Switch statement which runs the associated step method for the given step
    switch(step) {
      case 1:
        step1();
        break;
      case 2:
        step2();
        break;
      case 3:
        step3();
        break;
      case 4:
        step4();
        break;
      case 5:
        step5();
        break;
      case 6:
        step6();
        break;
      case 7:
        step7();
        break;
      case 8:
        step8();
        break;
      case 9:
        step9();
        break;
      case 10:
        step10();
        break;
      case 11:
        step11();
        break;
      case 12:
        step12();
        break;
      case 13:
        step13();
        break;
      default:
        break
    }
  }

  return <StepPlayer totalSteps={13} runStep={runArraySteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default ArrayTestCases;