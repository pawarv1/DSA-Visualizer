import React, { useState, useRef, useEffect } from 'react';
import { Circle, Text } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap, { set } from 'gsap';

// This component tests the Circle class to make sure text animations are displayed smoothly and accurately

function CircleTestCases() {
    
    const [step, setStep] = useState(0);    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    const handleStepChange = (newStep: number) => {
        // Prevent the user from changing steps while an animation is running
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 7 test cases to display
    const numSteps = 7;
   
    const canvasRef1 = useRef<HTMLCanvasElement>(null);    // Reference to the canvas element

    // Update canvas based on step dependency
    useEffect(() => {
        const canvas1 = canvasRef1.current;

        // Ensure that the canvas is not null
        if (canvas1) {
            const context1 = canvas1.getContext('2d');

            // Ensure that the context is not null
            if (context1) {

                context1.clearRect(0, 0, canvas1.width, canvas1.height);

                // Draw a basic circle test case
                const step1 = () => {
                    const testCaseHeader = new Text (70, 40, "General circle");
                    testCaseHeader.draw(context1);
                    const circle = new Circle(100, 150, 30);
                    circle.draw(context1);
                    setIsAnimating(false);
                }

                // Draw a circle with a different color test case
                const step2 = () => {
                    const testCaseHeader = new Text (70, 40, "Circle with different color");
                    testCaseHeader.draw(context1);
                    const circle = new Circle(100, 150, 20, 1, 'red');
                    circle.draw(context1);
                    setIsAnimating(false);
                }

                // Draw multiple circles test case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Multiple circles");
                    testCaseHeader.draw(context1);
                    const circle1 = new Circle(100, 150, 20, 1, 'red');
                    const circle2 = new Circle(200, 150, 30, 1, 'blue');
                    const circle3 = new Circle(300, 150, 40, 1, 'green');
                    const circle4 = new Circle(400, 150, 50, 1, 'purple');
                    circle1.draw(context1);
                    circle2.draw(context1);
                    circle3.draw(context1);
                    circle4.draw(context1);
                    setIsAnimating(false);
                }

                // Drawing circles with a different opacity test case
                const step4 = () => {
                    const testCaseHeader = new Text (70, 40, "Circles with different opacity");
                    testCaseHeader.draw(context1);
                    const circle1 = new Circle(100, 150, 50);
                    const circle2 = new Circle(200, 150, 50, 0.5);
                    const circle3 = new Circle(300, 150, 50, 0.2);
                    circle1.draw(context1);
                    circle2.draw(context1);
                    circle3.draw(context1);
                    setIsAnimating(false);
                }
                
                // Fading in circle test case
                const step5 = () => {
                    const testCaseHeader = new Text (70, 40, "Fading in circle");
                    testCaseHeader.draw(context1);
                    const circle = new Circle(100, 150, 50, 0);
                    gsap.to(circle, {
                        opacity: 1,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            circle.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    })
                }

                // Fading out circle test case
                const step6 = () => {
                    const testCaseHeader = new Text (70, 40, "Fading out circle");
                    testCaseHeader.draw(context1);
                    const circle = new Circle(100, 150, 50, 1);
                    gsap.to(circle, {
                        opacity: 0,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            circle.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    })
                }

                // Moving circle test case
                const step7 = () => {
                    const testCaseHeader = new Text (70, 40, "Moving circle");
                    testCaseHeader.draw(context1);
                    const circle = new Circle(100, 100, 50);
                    circle.draw(context1);

                    let timeline = gsap.timeline();

                    timeline.to(circle, {
                        x: 300,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            circle.draw(context1);
                        },
                    });

                    timeline.to(circle, {
                        y: 300,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            circle.draw(context1);
                        },
                    });

                    timeline.to(circle, {
                        x: 100,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            circle.draw(context1);
                        },
                    });

                    timeline.to(circle, {
                        y: 100,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            circle.draw(context1);
                        },
                    });

                    timeline.to(circle, {
                        x: 300,
                        y: 300,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            circle.draw(context1);
                        },
                    });

                    timeline.to(circle, {
                        x: 100,
                        y: 100,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            circle.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
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
                    default:
                        break; 
                }        
            }
        }
    }, [step]);

    /// This animation will have an animation number two, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={3} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={canvasRef1} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}

export default CircleTestCases;