import React, { useState, useRef, useEffect } from 'react';
import { Rectangle, Text } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap, { set } from 'gsap';

// This component tests the Rectangle class to make sure rectangle animations are displayed smoothly and accurately

function RectangleTestCases() {
    
    const [step, setStep] = useState(0);                    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    // Step can only be changed if the animation is not running
    const handleStepChange = (newStep: number) => {
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 9 test cases to display
    const numSteps = 9;
   
    const canvasRef1 = useRef<HTMLCanvasElement>(null);

    // Update canvas based on step dependency
    useEffect(() => {
        const canvas1 = canvasRef1.current;

        // Ensure that the canvas is not null
        if (canvas1) {
            const context1 = canvas1.getContext('2d');

            // Ensure that the context is not null
            if (context1) {

                context1.clearRect(0, 0, canvas1.width, canvas1.height);
            
                // Drawing a general rectangle test case
                const step1 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing rectangle with no outline color");
                    testCaseHeader.draw(context1);
                    const firstRectangle = new Rectangle(100, 100, 200, 100);
                    firstRectangle.draw(context1);
                    setIsAnimating(false);
                }

                // Drawing a rectangle with a red border test case
                const step2 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing rectangle with red border");
                    testCaseHeader.draw(context1);
                    const secondRectangle = new Rectangle(100, 100, 100, 200, 1, "red");
                    secondRectangle.draw(context1);
                    setIsAnimating(false);
                }

                // Drawing multiple rectangles test case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing multiple Rectangles");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100),
                        new Rectangle(300, 300, 100, 200, 1, "red"),
                        new Rectangle(100, 300, 100, 100, 1, "blue"),
                        new Rectangle(500, 300, 100, 100, 1, "green")
                    ];

                    for (let i = 0; i < rectangles.length; i++) {
                        rectangles[i].draw(context1);
                    }
                    setIsAnimating(false);
                }

                // Test Case Overlapped Rectangles
                const step4 = () => {
                    const testCaseHeader1 = new Text (70, 40, "Overlapped Rectangles");
                    testCaseHeader1.draw(context1);

                    const rectangles = [
                        new Rectangle(100, 100, 100, 100),
                        new Rectangle(120, 100, 100, 100),
                        new Rectangle(140, 100, 100, 100),
                        new Rectangle(160, 100, 100, 100),
                        new Rectangle(180, 100, 100, 100)
                    ];

                    for (let i = 0; i < rectangles.length; i++) {
                        rectangles[i].draw(context1);
                    }
                    
                    setIsAnimating(false);
                }

                // Fading in rectangle test case
                const step5 = () => {
                    const testCaseHeader = new Text (70, 40, "Fading in rectangles using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100, 0),
                        new Rectangle(300, 300, 100, 200, 0, "red"),
                        new Rectangle(100, 300, 100, 100, 0, "blue"),
                        new Rectangle(500, 300, 100, 100, 0, "green")
                    ];

                    rectangles.forEach((rectangle) => {
                        rectangle.fadeIn(context1, 1, setIsAnimating);
                    });
                }

                // Fading out rectangle test case
                const step6 = () => {
                    const testCaseHeader = new Text (70, 40, "Fading out rectangles using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100),
                        new Rectangle(300, 300, 100, 200),
                        new Rectangle(100, 300, 100, 100),
                        new Rectangle(500, 300, 100, 100)
                    ];

                    rectangles.forEach((rectangle) => {
                        rectangle.fadeOut(context1, 1, setIsAnimating);
                    });
                }

                // Test Case Moving Rectangle Around
                const step7 = () => {
                    const testCaseHeader = new Text (70, 40, "Moving a rectangle around using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangle = new Rectangle(100, 100, 100, 100);

                    rectangle.move(300, 300, context1, 1, setIsAnimating);
                }
                
                // Test Case highlighting a rectangle
                const step8 = () => {
                    const testCaseHeader = new Text (70, 40, "Highlighting a rectangle");
                    testCaseHeader.draw(context1);
                    const rectangle = new Rectangle(100, 100, 200, 100);
                    rectangle.highlight(context1, "yellow");
                    setIsAnimating(false);
                }

                // Test Case checking opacity
                const step9 = () => {
                    const testCaseHeader = new Text (70, 40, "Testing different levels of opacity");
                    testCaseHeader.draw(context1);
                    const rectangle1 = new Rectangle(100, 75, 200, 100);
                    const rectangle2 = new Rectangle(100, 275, 200, 100, 0.5);
                    const rectangle3 = new Rectangle(100, 475, 200, 100, 0.25);
                    rectangle1.draw(context1);
                    rectangle2.draw(context1);
                    rectangle3.draw(context1);
                    setIsAnimating(false);
                }

                // Run the associated step method for the given step
                switch (step) {
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
                    default:
                        break; 
                }        
            }
        }
    }, [step]);

    // This animation will have an animation number one, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={1} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={canvasRef1} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}

export default RectangleTestCases;