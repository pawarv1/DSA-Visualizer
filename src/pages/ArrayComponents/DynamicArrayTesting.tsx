import React, { useState, useRef, useEffect } from 'react';
import { Text } from '../GeneralAnimating/GeneralAnimationGraphics';
import { Array, DynamicArray } from './ArrayAnimationGraphics';
import AnimationTool from '../GeneralAnimating/AnimationTool';
import gsap, { timeline } from 'gsap';

//This component handles all the canvas logic needed for the various array animations

function DynamicArrayTestCases() {

  const [step, setStep] = useState(0);                    // Track the steps in the animation
  const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

  // Callback function to update the step modifications in AnimationTool
  // Step can only be changed if the animation is not running
  const handleStepChange = (newStep: number) => {
      if (!isAnimating) {
          setStep(newStep);
      }
  };

  // 7 test cases to display
  const numSteps = 7;

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

        // Dynamic Array initialization test case
        const step1 = () => {
          const testCaseHeader = new Text (70, 40, "General dynamic array");
          testCaseHeader.draw(mainContext);
          const array = new DynamicArray(100, 100, 80, 50, [0, 1, 2, 3]);
          array.draw(mainContext);
          setIsAnimating(false);
        }

        // Check Insert Index test case
        const step2 = () => {
          const testCaseHeader = new Text (70, 40, "Checking check insert index method");
          const array = new DynamicArray(100, 100, 80, 50, ['A']);
          const text1 = new Text (100, 200, "Insert at -1 valid?", 1, "16px Arial");
          const text2 = new Text (100, 300, "Insert at 0 valid? =", 1, "16px Arial");
          const text3 = new Text (100, 400, "Insert at 1 valid? =", 1, "16px Arial");
          const text4 = new Text (100, 500, "Insert at 2 valid? =", 1, "16px Arial");
          const text5 =  new Text (250,200, "", 0);
          const text6 =  new Text (250,300, "", 0);
          const text7 =  new Text (250,400, "", 0);
          const text8 =  new Text (250,500, "", 0);
          
          const staticContext = staticCanvas?.getContext('2d');

          if (staticContext) {
            testCaseHeader.draw(staticContext);
            array.draw(staticContext);
            text1.draw(staticContext);
            text2.draw(staticContext);
            text3.draw(staticContext);
            text4.draw(staticContext);
          }

          // Should give an error
          try {
            text5.setContent(array.checkInsertIndex(-1).toString());
          }
          catch(error) {
            if (error instanceof RangeError) {
              text5.setColor("red");
              text5.setContent(error.message);
            }
          }

          // Should not give an error
          try {
            text6.setContent(array.checkInsertIndex(0).toString());
          }
          catch(error) {
            if (error instanceof RangeError) {
              text6.setColor("red");
              text6.setContent(error.message);
            }
          }

          // Should not give an error
          try {
            text7.setContent(array.checkInsertIndex(1).toString());
          }
          catch(error) {
            if (error instanceof RangeError) {
              text7.setColor("red");
              text7.setContent(error.message);
            }
          }

          // Should give an error
          try {
            text8.setContent(array.checkInsertIndex(2).toString());
          }
          catch(error) {
            if (error instanceof RangeError) {
              text8.setColor("red");
              text8.setContent(error.message);
            }
          }

          gsap.to([text5, text6, text7, text8], {
            opacity: 1,
            duration: 1,
            onUpdate: () => {
              mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
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
        const step4 = () => {
          const header = new Text(70, 40, "DynamicArray: resize()");
          const array = new DynamicArray(100, 100, 60, 50, []);
          header.draw(mainContext);

          gsap.delayedCall(1, () => {
            array.resize(mainContext, 4);
          });

          gsap.delayedCall(2, () => {
            array.resize(mainContext, 8);
          });

          gsap.delayedCall(3, () => {
            array.resize(mainContext, 2);
            setIsAnimating(false);
          });
        }

        // Appending test cases
        // For better visualization resizing delays will be added, but this will ussually be 0
        const step5 = () => {
          const header = new Text(70, 40, "DynamicArray: append()");
          const array = new DynamicArray(100, 100, 60, 50, []);
          header.draw(mainContext);
          array.draw(mainContext);
          
          gsap.delayedCall(1, () => {
            array.append(mainContext, "A"); // Append into empty dynamic array
          });

          gsap.delayedCall(2, () => {
            array.append(mainContext, "B", 0.5); // Should resize then append
          });

          gsap.delayedCall(3, () => {
            array.append(mainContext, "C", 0.5); // Should resize then append
          });

          gsap.delayedCall(4, () => {
            array.append(mainContext, "D"); // Should append without a resize
          });

          // Have to delay setting is animating false to account for the resizing delays being used
          gsap.delayedCall(5, () => {
            setIsAnimating(false);
          });
        }

        // Inserting test cases
        // For better visualization resizing delays will be added, but this will ussually be 0
        const step6 = () => {
          const header = new Text(70, 40, "DynamicArray: insertAt()");
          const array = new DynamicArray(100, 100, 60, 50, []);
          header.draw(mainContext);
          array.draw(mainContext);

          gsap.delayedCall(1, () => {
            array.insertAt(mainContext, 0, "B");  // Insert into empty dynamic array
          });

          gsap.delayedCall(2, () => {
            array.insertAt(mainContext, 0, "A", 0.5); // Insert at front, should resize
          });

          gsap.delayedCall(3, () => {
            array.insertAt(mainContext, array.getArraySize(), "D", 0.5); // Insert at end, should resize
          });

          gsap.delayedCall(4, () => {
            array.insertAt(mainContext, array.getArraySize(), "E");
          });

          gsap.delayedCall(5, () => {
            array.insertAt(mainContext, 2, "C", 0.5);  // Insert in the middle
          });

          // Have to delay setting is animating false to account for the resizing delays being used
          gsap.delayedCall(6, () => {
            setIsAnimating(false);
          });
        }

        // Removing test cases
        const step7 = () => {
          const header = new Text(70, 40, "DynamicArray: removeAt()");
          const array = new DynamicArray(100, 100, 60, 50, ["A", "B", "C", "D", "E"]);
          header.draw(mainContext);
          array.draw(mainContext);

          gsap.delayedCall(1, () => {
            array.removeAt(mainContext, 2); // Remove middle (C)
          });

          gsap.delayedCall(2, () => {
            array.removeAt(mainContext, 0); // Remove front (A)
          });

          gsap.delayedCall(3, () => {
            array.removeAt(mainContext, array.getArraySize() - 1); // Remove last (E)
          });

          gsap.delayedCall(4, () => {
            array.removeAt(mainContext, array.getArraySize() - 1, 0.5); // Remove last (D), should trigger resize
            setIsAnimating(false);
          });
        }


        const step8 = () => {
          
        }

        /*
        const step3 = () => {

          const header = new Text(70, 40, "DynamicArray: removeAt()");
          const array = new DynamicArray(100, 100, 60, 50, ["A", "B", "C", "D", "E"]);
          header.draw(mainContext);
          array.draw(mainContext);

          gsap.delayedCall(1, () => {
            array.removeAt(mainContext, 2); // Remove middle (C)
          });

          gsap.delayedCall(2, () => {
            array.removeAt(mainContext, 0); // Remove front (A)
          });

          gsap.delayedCall(3, () => {
            array.removeAt(mainContext, array.getArraySize() - 1); // Remove last (E)
            setIsAnimating(false);
          });
        };
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
          /*
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
          */
          default:
            break
        }
      }
    }
  }, [step]);

  return (
    <div>
      <AnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange} animationNum={2} isAnimating={isAnimating}></AnimationTool><br></br>
      <canvas ref={staticCanvasRef} width={800} height={600} style={{ position: 'absolute', zIndex: 0,  border: '1px solid black' }}>Canvas</canvas>
      <canvas ref={mainCanvasRef} width={800} height={600} style={{ zIndex: 1, border: '1px solid black' }}>Canvas</canvas>
    </div>
  );
}

export default DynamicArrayTestCases;