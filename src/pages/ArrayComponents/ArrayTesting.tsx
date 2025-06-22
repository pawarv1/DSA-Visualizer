import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import { Array, prefixSum, postfixSum } from './ArrayAnimationGraphics';
import AnimationTool from '../GeneralAnimating/AnimationTool';
import gsap from 'gsap';

//This component handles all the canvas logic needed for the various array animations

function ArrayTestCases() {

  const [step, setStep] = useState(0);                    // Track the steps in the animation
  const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

  // Callback function to update the step modifications in AnimationTool
  // Step can only be changed if the animation is not running
  const handleStepChange = (newStep: number) => {
      if (!isAnimating) {
          setStep(newStep);
      }
  };

  // 15 test cases to display
  const numSteps = 15;

  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);

  // Update the canvas based on the step dependency
  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    const staticCanvas = staticCanvasRef.current;

    // Ensure that the main canvas is not null
    if (mainCanvas) {
      const mainContext = mainCanvas.getContext('2d');

      // Ensure that the main context is not null
      if (mainContext) {
        mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        // Clear the static canvas if it exists
        staticCanvas?.getContext('2d')?.clearRect(0, 0, staticCanvas.width, staticCanvas.height);

        // General array initialization test case
        const step1 = () => {
          const testCaseHeader = new Text (70, 40, "General array");
          testCaseHeader.draw(mainContext);
          const array = new Array(100, 100, 80, 50, [0, 1, 2, 3]);
          array.draw(mainContext);
          setIsAnimating(false);
        }

        // Check validity test case
        const step2 = () => {
          const testCaseHeader = new Text (70, 40, "Checking index validity method");
          const array = new Array (100, 100, 80, 50, ['A']);
          const text1 = new Text (100, 200, "Index -1 valid?", 1, "16px Arial");
          const text2 = new Text (100, 300, "Index 0 valid? =", 1, "16px Arial");
          const text3 = new Text (100, 400, "Index 1 valid? =", 1, "16px Arial");
          const text4 =  new Text (250,200, "", 0);
          const text5 =  new Text (250,300, "", 0);
          const text6 =  new Text (250,400, "", 0);
          
          const staticContext = staticCanvas?.getContext('2d');

          if (staticContext) {
            testCaseHeader.draw(staticContext);
            array.draw(staticContext);
            text1.draw(staticContext);
            text2.draw(staticContext);
            text3.draw(staticContext);
          }

          try {
            text4.setContent(array.checkIndexValidity(-1).toString());
          }
          catch(error) {
            if (error instanceof RangeError) {
              text4.setColor("red");
              text4.setContent(error.message);
            }
          }

          try {
            text5.setContent(array.checkIndexValidity(0).toString());
          }
          catch(error) {
            if (error instanceof RangeError) {
              text5.setColor("red");
              text5.setContent(error.message);
            }
          }

          try {
            text6.setContent(array.checkIndexValidity(1).toString());
          }
          catch(error) {
            if (error instanceof RangeError) {
              text6.setColor("red");
              text6.setContent(error.message);
            }
          }

          gsap.to([text4, text5, text6], {
            opacity: 1,
            duration: 1,
            onUpdate: () => {
              mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
              text4.draw(mainContext);
              text5.draw(mainContext);
              text6.draw(mainContext);
            },
            onComplete: () => setIsAnimating(false)
          });
        }

        // Accessing an index test case
        const step3 = () => {
          const testCaseHeader = new Text (70, 40, "Array index access");
          const array = new Array (100, 100, 80, 50, ['A']);
          const text1 = new Text (100, 200, "Array[0] =");
          const text2 =  new Text (200,200, array.getElementAt(0), 0);
          const staticContext = staticCanvas?.getContext('2d');

          if (staticContext) {
            testCaseHeader.draw(staticContext);
            array.draw(staticContext);
            text1.draw(staticContext);
          }

          gsap.to(text2, {
            opacity: 1,
            duration: 1,
            onUpdate: () => {
              mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
              text2.draw(mainContext);
            },
            onComplete: () => setIsAnimating(false)
          });
        }

        // Changing element test case
        const step4 = () => {
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
          const testCaseHeader = new Text (70, 40, "Changing opacity for a single cell");
          const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50]);
          testCaseHeader.draw(mainContext);
          array1.draw(mainContext);
          array1.setOpacity(mainContext, 0, 0.5);
          setIsAnimating(false);
        }

        // Set opacity for whole array test case
        const step6 = () => {
          const testCaseHeader = new Text (70, 40, "Changing opacity for whole array");
          const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50], 1);
          testCaseHeader.draw(mainContext);
          array1.draw(mainContext);
          array1.setOpacity(mainContext, "all", 0.5);
          setIsAnimating(false);
        }
        

        // Set outline color for a single cell test case
        const step7 = () => {
          const testCaseHeader = new Text (70, 40, "Changing outline color for a single cell");
          const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50]);
          testCaseHeader.draw(mainContext);
          array1.draw(mainContext);
          array1.setOutlineColor(mainContext, 0, "red");
          setIsAnimating(false);
        }

        // Set outline color for whole array test case
        const step8 = () => {
          const testCaseHeader = new Text (70, 40, "Changing outline color for whole array");
          const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50], 1);
          testCaseHeader.draw(mainContext);
          array1.draw(mainContext);
          array1.setOutlineColor(mainContext, "all", "red");
          setIsAnimating(false);
        }

        // Set fill color for a single cell test case
        const step9 = () => {
          const testCaseHeader = new Text (70, 40, "Changing fill color for a single cell");
          const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50]);
          testCaseHeader.draw(mainContext);
          array1.draw(mainContext);
          array1.setFillColor(mainContext, 0, "yellow");
          setIsAnimating(false);
        }

        // Set fill color for whole array test case
        const step10 = () => {
          const testCaseHeader = new Text (70, 40, "Changing fill color for whole array");
          const array1 = new Array(100, 100, 80, 50, [10, 20, 30, 40, 50], 1);
          testCaseHeader.draw(mainContext);
          array1.draw(mainContext);
          array1.setFillColor(mainContext, "all", "yellow");
          setIsAnimating(false);
        }

        // Getting array length test case
        const step11 = () => {
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
        const step12 = () => {
          const testCaseHeader = new Text (70, 40, "Swapping two elements of the array");
          const array = new Array (50, 100, 80, 50, ['a', 'b', 'c', 'd', 'e']);
          testCaseHeader.draw(mainContext);
          array.draw(mainContext);
          array.swapElements(mainContext, 0, 4);
          setTimeout(() => {setIsAnimating(false)}, 5000);
        }

        // Clearing an array test case
        const step13 = () => {
          const testCaseHeader = new Text (70, 40, "Clearing an array");
          const array = new Array (100, 100, 80, 50, [2,4,6,8]);
          testCaseHeader.draw(mainContext);
          array.draw(mainContext);
          setTimeout(() => {
            array.clear(mainContext);
            setIsAnimating(false);
          }, 2000);
        }
        // Looping through array
        const step14 = () => {
          const testCaseHeader = new Text (70, 40, "Looping through an array");
          const array = new Array (50, 100, 30, 30, ["A", "B", "C", "D", "E", "F", "G", "H"]);
          testCaseHeader.draw(mainContext);
          array.draw(mainContext);

          let timeline = gsap.timeline({onComplete: () => { setIsAnimating(false); }});

          for (let i = 0; i < array.getArraySize(); i++) {
            timeline.to(array, {
              duration: 1,
              onUpdate: () => {
                if (i > 0) {
                  array.setOutlineColor(mainContext, i - 1, "black");
                  array.setFillColor(mainContext, i - 1, "white");
                }
                array.setOutlineColor(mainContext, i, "red");
                array.setFillColor(mainContext, i, "yellow");
              }
            });
          }
        }

        // Creating an empty array test case
        const step15 = () => {
          const testCaseHeader = new Text (70, 40, "Creating an empty array");
          const array = new Array (100, 100, 80, 50, []);
          testCaseHeader.draw(mainContext);
          array.draw(mainContext);
          setIsAnimating(false);
        }
        
        /*
        // Prefix and Postfix sum array test cases
        // Should probably add more test cases just for these algorithm animations
        const step16 = () => {
          const testCaseHeader = new Text (70, 40, "Prefix and Postfix Sum arrays");
          testCaseHeader.draw(mainContext);
          const text1 = new Text (50, 225, "Prefix Sum Array:");
          text1.draw(mainContext);
          const text2 = new Text (50, 425, "Postfix Sum Array:");
          text2.draw(mainContext);
          const array1 = new Array(200, 100, 80, 50, [0, 1, 2, 3, 4, 5, 6]);
          array1.draw(mainContext);
          prefixSum(200, 200, 80, 50, array1, mainContext);
          const array2 = new Array(200, 300, 80, 50, [0, 1, 2, 3, 4, 5, 6]);
          array2.draw(mainContext);
          postfixSum(200, 400, 80, 50, array2, mainContext);
          setTimeout(() => { setIsAnimating(false); }, 7000);
        }
        */
        

        // Switch statement which runs the associated step method for the given step
        switch(step) {
          case 1:
            setIsAnimating(true);
            step1();
            break;
          case 2:
            setIsAnimating(true);
            step2();
            break;
          case 3:
            setIsAnimating(true);
            step3();
            break;
          case 4:
            setIsAnimating(true);
            step4();
            break;
          case 5:
            setIsAnimating(true);
            step5();
            break;
          case 6:
            setIsAnimating(true);
            step6();
            break;
          case 7:
            setIsAnimating(true);
            step7();
            break;
          case 8:
            setIsAnimating(true);
            step8();
            break;
          case 9:
            setIsAnimating(true);
            step9();
            break;
          case 10:
            setIsAnimating(true);
            step10();
            break;
          case 11:
            setIsAnimating(true);
            step11();
            break;
          case 12:
            setIsAnimating(true);
            step12();
            break;
          case 13:
            setIsAnimating(true);
            step13();
            break;
          case 14:
            setIsAnimating(true);
            step14();
            break;
          case 15:
            setIsAnimating(true);
            step15();
            break;
          default:
            break
        }
      }
    }
  }, [step]);

  return (
    <div>
      <AnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange} animationNum={1} isAnimating={isAnimating}></AnimationTool><br></br>
      <canvas ref={staticCanvasRef} width={800} height={600} style={{ position: 'absolute', zIndex: 0,  border: '1px solid black' }}>Canvas</canvas>
      <canvas ref={mainCanvasRef} width={800} height={600} style={{ zIndex: 1, border: '1px solid black' }}>Canvas</canvas>
    </div>
  );
}

export default ArrayTestCases;