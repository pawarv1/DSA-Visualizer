import React, { useState, useRef, useEffect } from 'react';
import { Text, Arrow, Line, } from './AnimationGraphics/GeneralAnimationGraphics';
import { Array, prefixSum, suffixSum, TwoPointers, linearSearch, binarySearch } from './AnimationGraphics/ArrayAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap from 'gsap';

/*
This component handles all the canvas logic needed for the various array animations
*/

// FixMe: ADD INDEXES


// The first animation, which serves as an introduction to arrays
export function Animation1() {

  const [step, setStep] = useState(0); // useState hook is used to track the steps in the animation
  const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

  // Callback function to update the step modifications in AnimationTool
  const handleStepChange = (newStep) => {
      // Prevent the user from changing steps while an animation is running
      if (!isAnimating) {
          setStep(newStep);
      }
  };

  // Number of steps for this animation
  const numSteps = 7;

  const canvasRef1 = useRef(null); // Reference to the canvas element

  // This hook updates the canvas based on the step dependencu
  // Dependency array may need to be updated
  useEffect(() => {
    const canvas1 = canvasRef1.current;
    const context1 = canvas1.getContext('2d'); // Get the 2D context
    context1.clearRect(0, 0, canvas1.width, canvas1.height);

    const step1 = () => {

      const step1Objects = [
        new Text(0, 20, "Arrays are fixed sized collections of elements, and are stored sequentially in memory.", 0),
        new Text(240, 70, "length = 4", 0, '12px Arial'),
        new Line(100, 95, 420, 95),
        new Line(100, 80, 100, 115),
        new Line(420, 80, 420, 115),
        new Array(100, 130, 80, 50, [0, 1, 2, 3], 0)
      ];

      step1Objects.forEach((object) => {
        gsap.to(object, {
          duration: 1,
          opacity: 1,
          onUpdate: () => {
            object.clear(context1);
            object.draw(context1);
          },
          onComplete: () => setIsAnimating(false)
        })
      });

      //setIsAnimating(false);  // Set animation state to false after the animation is done
    }
  
    const step2 = () => {
      
      const primaryExplanationObjects = [
        new Text(0, 20, "Each element can be accessed using an index. Indexing starts at 0, and ends at the array length - 1."),
        new Text(240, 70, "length = 4", 1, '12px Arial'),
        new Line(100, 95, 420, 95),
        new Line(100, 80, 100, 115),
        new Line(420, 80, 420, 115),
        new Array(100, 130, 80, 50, [0, 1, 0, 0])
      ];

      primaryExplanationObjects.forEach((object) => {
        object.draw(context1);
      });
     
      // GSAP timeline is used to order which graphics are drawn first
      let timeline = gsap.timeline();

      const Arrows = [
        new Arrow(120, 240, 120, 215, 0),
        new Arrow(200, 240, 200, 215, 0),
        new Arrow(280, 240, 280, 215, 0),
        new Arrow(360, 240, 360, 215, 0),
      ];

      Arrows.forEach((arrow) => {
        timeline.to(arrow, {
          duration: 0.005,
          opacity: 1,
          onUpdate: () => {
            arrow.clear(context1);
            arrow.draw(context1);
          },
        });
      });

      const indexAccess = [
        new Text(150, 280, "Array[0] = ", 0),
        new Arrow(120, 240, 120, 215, 0, 'red'),
        new Text(230, 280, "0", 0)
      ];

      timeline.to(indexAccess[0], {
        duration: 1,
        opacity: 1,
        onUpdate: () => {
          indexAccess[0].clear(context1);
          indexAccess[0].draw(context1);
        },
      });

      timeline.to(indexAccess[1], {
        duration: 1,
        opacity: 1,
        onUpdate: () => {
          indexAccess[1].draw(context1);
        },
        onComplete: () => primaryExplanationObjects[5].hightlightIndex(context1, 0)
      });

      timeline.to(indexAccess[2], {
        delay: 0.5,
        duration: 1,
        opacity: 1,
        onUpdate: () => {
          indexAccess[2].clear(context1);
          indexAccess[2].draw(context1);
        },
        onComplete: () => setIsAnimating(false)
      });


      //setIsAnimating(false);  // Set animation state to false after the animation is done
    }
  
    const step3 = () => {
      //Arrays can store any type of data, including numbers, strings, and objects.
    
      const step3Objects = [
        new Text(0, 20, "Arrays can store any type of data, including numbers, strings, and objects."),
        new Array(100, 80, 80, 50, [0, 1, 2, 3], 0),
        new Array(100, 200, 80, 50, ['\"Hello\"', '\"World\"'], 0),
        new Array(100, 320, 80, 50, ['Stem', 'Forcina', 'Stud', 'Science'], 0)
      ];

      step3Objects[0].draw(context1);

      let timeline = gsap.timeline();

      timeline.to(step3Objects[1], {
        duration: 1,
        opacity: 1,
        onUpdate: () => {
          step3Objects[1].clear(context1);
          step3Objects[1].draw(context1);
        },
      });
      
      timeline.to(step3Objects[2], {
        duration: 1,
        opacity: 1,
        onUpdate: () => {
          step3Objects[2].clear(context1);
          step3Objects[2].draw(context1);
        },
      });

      timeline.to(step3Objects[3], {
        duration: 1,
        opacity: 1,
        onUpdate: () => {
          step3Objects[3].clear(context1);
          step3Objects[3].draw(context1);
        },
        onComplete: () => setIsAnimating(false)
      });

      //setIsAnimating(false);  // Set animation state to false after the animation is done
    }
  
    const step4 = () => {
      const array1 = new Array(100, 100, 80, 50, [0, 1, 2, 3]);
      //setTimeout(() => { array.changeElement(context1, 1, 4); }, 1000);
      array1.draw(context1);
      prefixSum(100, 200, 80, 50, array1, context1);
      const array2 = new Array(100, 300, 80, 50, [5, 6, 7, 8]);
      array2.draw(context1);
      suffixSum(100, 400, 80, 50, array2, context1);
      setTimeout(() => { setIsAnimating(false); }, 4000);
    }
    
    const step5 = () => {
      const array1 = new Array(100, 100, 80, 50, [-8, 1, 4, 6, 10, 45, 49, 58]);
      TwoPointers(array1, 46, context1);
      setTimeout(() => { setIsAnimating(false); }, 5000);
    }


    const step6 = () => {
      const array1 = new Array(100, 100, 80, 50, [0, 1, 2, 3, 4, 5, 6]);
      linearSearch(array1, 3, context1);
      setTimeout(() => { setIsAnimating(false); }, 6000);
    }

    const step7 = () => {
      const array1 = new Array(0, 100, 80, 50, [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
      binarySearch(array1, 23, context1);
      setTimeout(() => { setIsAnimating(false); }, 7000);
    }

    // Switch statement which runs the associated step method for the given step
    switch(step) {
      case 1:
        setIsAnimating(true);   // Set animation state to true before starting the animation
        step1();
        break;
      case 2:
        setIsAnimating(true);   // Set animation state to true before starting the animation
        step2();
        break;
      case 3:
        setIsAnimating(true);   // Set animation state to true before starting the animation
        step3();
        break;
      case 4:
        setIsAnimating(true);   // Set animation state to true before starting the animation
        step4();
        break;
      case 5:
        setIsAnimating(true);   // Set animation state to true before starting the animation
        step5();
        break
      case 6:
        setIsAnimating(true);   // Set animation state to true before starting the animation
        step6();
        break
      case 7:
        setIsAnimating(true);   // Set animation state to true before starting the animation
        step7();
        break
      default:
        break;
    }
  }, [step]);

  return (
    <>
      <AnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange} animationNum={1} isAnimating={isAnimating}></AnimationTool><br></br>
      <canvas ref={canvasRef1} width={800} height={600} style={{ border: '1px solid black' }}>
        Canvas not supported.
      </canvas>
    </>
  );
}