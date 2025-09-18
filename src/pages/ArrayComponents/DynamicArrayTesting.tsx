import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import { DynamicArray } from './DynamicArray';
import StepPlayer from '../GeneralAnimating/StepPlayer';
import gsap, { context, timeline } from 'gsap';

function DynamicArrayTestCases() {

  let canvasWidth = 800;
  let canvasHeight = 600;

  // Dynamic Array step callback
  const runDynamicArraySteps = (mainContext: CanvasRenderingContext2D, staticContext: CanvasRenderingContext2D, step: number, setIsAnimating: (value: boolean) => void) => {
      
    // Dynamic Array initialization test case
    const step1 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "General dynamic array");
      testCaseHeader.draw(mainContext);
      const array = new DynamicArray(100, 100, 80, 50, [0, 1, 2, 3]);
      array.draw(mainContext);
      setIsAnimating(false);
    }

    // Check Insert Index test case
    const step2 = () => {
      setIsAnimating(true);
      const testCaseHeader = new Text (70, 40, "Checking check insert index method");
      const array = new DynamicArray(100, 100, 80, 50, ['A']);
      const text1 = new Text (100, 200, "Insert at -1 valid?", 1, "16px Arial");
      const text2 = new Text (100, 300, "Insert at 0 valid? =", 1, "16px Arial");
      const text3 = new Text (100, 400, "Insert at 1 valid? =", 1, "16px Arial");
      const text4 = new Text (100, 500, "Insert at 2 valid? =", 1, "16px Arial");
      const text5 = new Text (250,200, "", 0);
      const text6 = new Text (250,300, "", 0);
      const text7 = new Text (250,400, "", 0);
      const text8 = new Text (250,500, "", 0);

      testCaseHeader.draw(staticContext);
      array.draw(staticContext);
      text1.draw(staticContext);
      text2.draw(staticContext);
      text3.draw(staticContext);
      text4.draw(staticContext);

      // Should give a console error
      text5.setContent(array.checkInsertIndex(-1).toString());

      // Should not give a console error
      text6.setContent(array.checkInsertIndex(0).toString());
      
      // Should not give a console error
      text7.setContent(array.checkInsertIndex(1).toString());

      // Should give a console error
      text8.setContent(array.checkInsertIndex(2).toString());

      gsap.to([text5, text6, text7, text8], {
        opacity: 1,
        duration: 1,
        onUpdate: () => {
          mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
          text5.draw(mainContext);
          text6.draw(mainContext);
          text7.draw(mainContext);
          text8.draw(mainContext);
        },
        onComplete: () => setIsAnimating(false)
      });
    }

    // Clearing test case
    const step3 = () => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: clear()");
      const array = new DynamicArray(100, 100, 60, 50, ["A", "B", "C", "D", "E", "F"]);
      header.draw(mainContext);
      array.draw(mainContext);
      gsap.delayedCall(1, () => {
        array.clear(mainContext);
        setIsAnimating(false);
      });
    }

    // Resize test cases
    const step4 = async() => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: resize()");
      const array = new DynamicArray(100, 100, 60, 50, []);
      header.draw(mainContext);
      await array.resize(mainContext, 4);
      await array.resize(mainContext, 8);
      await array.resize(mainContext, 2);
      setIsAnimating(false);
    }

    // Appending test cases
    // For better visualization resizing delays will be added, but this will usually be 0
    const step5 = async() => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: append()");
      const array = new DynamicArray(100, 100, 60, 50, []);
      header.draw(mainContext);
      array.draw(mainContext);
      
      await array.append(mainContext, "A"); // Append into empty dynamic array
      await array.append(mainContext, "B"); // Should resize then append
      await array.append(mainContext, "C"); // Should resize then append
      await array.append(mainContext, "D"); // Should append without a resize
      setIsAnimating(false);
    }

    // Inserting test cases
    // For better visualization resizing delays will be added, but this will ussually be 0
    const step6 = async() => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: insertAt()");
      const array = new DynamicArray(100, 100, 60, 50, []);
      header.draw(mainContext);
      array.draw(mainContext);

      await array.insertAt(mainContext, 0, "B");  // Insert into empty dynamic array
      await array.insertAt(mainContext, 0, "A"); // Insert at front, should resize
      await array.insertAt(mainContext, array.getArraySize(), "D"); // Insert at end, should resize
      await array.insertAt(mainContext, array.getArraySize(), "E");
      await array.insertAt(mainContext, 2, "C");  // Insert in the middle, should resize
      setIsAnimating(false);
    }

    // Removing test cases
    const step7 = async() => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: removeAt()");
      const array = new DynamicArray(100, 100, 60, 50, ["A", "B", "C", "D", "E"]);
      header.draw(mainContext);
      array.draw(mainContext);

      await array.removeAt(mainContext, 2); // Remove middle (C)
      await array.removeAt(mainContext, 0); // Remove front (A)
      await array.removeAt(mainContext, array.getArraySize() - 1); // Remove last (E)
      await array.removeAt(mainContext, array.getArraySize() - 1); // Remove last (D), should trigger resize
      setIsAnimating(false);
    }

    // Pop test cases
    const step8 = async() => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: pop()");
      const array = new DynamicArray(100, 100, 60, 50, ["A", "B", "C", "D", "E"]);
      const text1 = new Text (100, 200, "array.pop() =", 1, "16px Arial");
      const text2 = new Text (100, 300, "array.pop() =", 1, "16px Arial");
      const text3 = new Text (100, 400, "array.pop() =", 1, "16px Arial");
      const text4 = new Text (100, 500, "array.pop() =", 1, "16px Arial");
      const text5 = new Text (210,200, "", 1);
      const text6 = new Text (210,300, "", 1);
      const text7 = new Text (210,400, "", 1);
      const text8 = new Text (210,500, "", 1);
      header.draw(mainContext);
      array.draw(mainContext);

      text5.setContent(await array.pop(mainContext))
      text1.draw(mainContext);
      text5.draw(mainContext);
      text6.setContent(await array.pop(mainContext))
      text2.draw(mainContext);
      text6.draw(mainContext);
      text7.setContent(await array.pop(mainContext))
      text3.draw(mainContext);
      text7.draw(mainContext);
      text8.setContent(await array.pop(mainContext))  // Should trigger a resize
      text4.draw(mainContext);
      text8.draw(mainContext);
      setIsAnimating(false);
    }

    // Popping from empty array test case
    const step9 = async() => {
      setIsAnimating(true);
      const header = new Text(70, 40, "Popping from empty array");
      const array = new DynamicArray(100, 100, 60, 50, []);
      const text1 = new Text (100, 100, "array.pop() =", 1, "16px Arial");
      const text2 = new Text (210, 100, "", 1);
      header.draw(mainContext);
      array.draw(mainContext);

      //Should give a console error
      text2.setContent(await array.pop(mainContext));
      text1.draw(mainContext);
      text2.draw(mainContext)
      setIsAnimating(false);
    }

    // shrinkToFit test cases
    const step10 = async () => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: shrinkToFit()");
      const array = new DynamicArray(100, 100, 60, 50, ["A", "B", "C", "D", "E"]);
      header.draw(mainContext);
      array.draw(mainContext);
      await array.pop(mainContext)
      await array.pop(mainContext)
      await array.pop(mainContext)
      await array.shrinkToFit(mainContext);
      setIsAnimating(false);
    }

    // clearAll elements test case
    const step11 = () => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: clearAll()");
      const array = new DynamicArray(100, 100, 60, 50, ["A", "B", "C", "D", "E"]);
      header.draw(mainContext);
      array.draw(mainContext);
      gsap.delayedCall(1, () => {
        array.clearAll(mainContext);
        setIsAnimating(false);
      });
    }

    // isEmpty test cases
    const step12 = async () => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: isEmpty()");
      const array = new DynamicArray(100, 100, 60, 50, []);
      header.draw(mainContext);
      array.draw(mainContext);
      const text1 = new Text (100, 300, "array.isEmpty() =", 1, "16px Arial");
      const text2 = new Text (230, 300, "", 1);
      text2.setContent(String(array.isEmpty()));
      text1.draw(mainContext);
      text2.draw(mainContext);
      await array.append(mainContext, "1");
      const text3 = new Text (100, 400, "array.isEmpty() =", 1, "16px Arial");
      const text4 = new Text (230, 400, "", 1);
      text4.setContent(String(array.isEmpty()));
      text3.draw(mainContext);
      text4.draw(mainContext);
      setIsAnimating(false);
    }
    
    // Search test cases
    const step13 = async () => {
      setIsAnimating(true);
      const header = new Text(70, 40, "DynamicArray: search()");
      const array = new DynamicArray(100, 100, 60, 50, ["A", "B", "C", "D", "E"]);
      header.draw(mainContext);
      array.draw(mainContext);
      const text1 = new Text (100, 300, "array.search(\"C\") =", 1, "16px Arial");
      const text2 = new Text (250, 300, "", 1);
      text2.setContent(String(await array.search(mainContext, "C", 0.5)));
      text1.draw(mainContext);
      text2.draw(mainContext);
      const text3 = new Text (100, 400, "array.search(\"E\") =", 1, "16px Arial");
      const text4 = new Text (250, 400, "", 1);
      text4.setContent(String(await array.search(mainContext, "E", 0.5)));
      text3.draw(mainContext);
      text4.draw(mainContext);
      const text5 = new Text (100, 500, "array.search(\"X\") =", 1, "16px Arial");
      const text6 = new Text (250, 500, "", 1);
      text6.setContent(String(await array.search(mainContext, "X", 0.5)));
      text5.draw(mainContext);
      text6.draw(mainContext);
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

  return <StepPlayer totalSteps={13} runStep={runDynamicArraySteps} canvasWidth={canvasWidth} canvasHeight={canvasHeight}></StepPlayer>
}

export default DynamicArrayTestCases;