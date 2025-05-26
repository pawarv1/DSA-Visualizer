import React, { useState, useRef, useEffect } from 'react';
import { Circle, Text } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap, { set, timeline } from 'gsap';

// This component tests the Circle class to make sure text animations are displayed smoothly and accurately

function CircleTestCases() {
    
    const [step, setStep] = useState(0);                    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    // Step can only be changed if the animation is not running
    const handleStepChange = (newStep: number) => {
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 11 test cases to display
    const numSteps = 11;
   
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const staticCanvasRef = useRef<HTMLCanvasElement>(null);
    
    // Update canvas based on step dependency
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

                // Draw a basic circle test case
                const step1 = () => {
                    const testCaseHeader = new Text (70, 40, "General circle");
                    testCaseHeader.draw(mainContext);
                    const circle = new Circle(100, 150, 30);
                    circle.draw(mainContext);
                    setIsAnimating(false);
                }

                // Draw a circle with a different color test case
                const step2 = () => {
                    const testCaseHeader = new Text (70, 40, "Circle with different color");
                    testCaseHeader.draw(mainContext);
                    const circle = new Circle(100, 150, 20, 1, 'red');
                    circle.draw(mainContext);
                    setIsAnimating(false);
                }

                // Draw multiple circles test case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Multiple circles");
                    testCaseHeader.draw(mainContext);
                    const circle1 = new Circle(100, 150, 20, 1, 'red');
                    const circle2 = new Circle(200, 150, 30, 1, 'blue');
                    const circle3 = new Circle(300, 150, 40, 1, 'green');
                    const circle4 = new Circle(400, 150, 50, 1, 'purple');
                    circle1.draw(mainContext);
                    circle2.draw(mainContext);
                    circle3.draw(mainContext);
                    circle4.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing circles with a different opacity test case
                const step4 = () => {
                    const testCaseHeader = new Text (70, 40, "Circles with different opacity");
                    testCaseHeader.draw(mainContext);
                    const circle1 = new Circle(100, 150, 50);
                    const circle2 = new Circle(200, 150, 50, 0.5);
                    const circle3 = new Circle(300, 150, 50, 0.2);
                    circle1.draw(mainContext);
                    circle2.draw(mainContext);
                    circle3.draw(mainContext);
                    setIsAnimating(false);
                }
                
                // Fading in circle test case
                const step5 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading in circle");
                        testCaseHeader.draw(staticContext);
                    }
                    const circle = new Circle(100, 150, 50, 0);

                    gsap.to(circle, {
                        opacity: 1,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            circle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    }); 
                }

                // Fading out circle test case
                const step6 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading out circle");
                        testCaseHeader.draw(staticContext);
                    }
                    const circle = new Circle(100, 150, 50, 1);

                    gsap.to(circle, {
                        opacity: 0,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            circle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Moving a circle around test case
                const step7 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Moving a circle around using GSAP timeline");
                        testCaseHeader.draw(staticContext);
                    }

                    const circle = new Circle(100, 100, 50);

                    let timeline = gsap.timeline({onComplete: () => { setIsAnimating(false); }});

                    timeline.to(circle, {
                        x: 300,
                        y: 300,
                        duration: 1,
                        onUpdate: () => {   
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            circle.draw(mainContext);
                        }
                    })
                    .to(circle, {
                        x: 100,
                        y: 100,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            circle.draw(mainContext);
                        }
                    })
                }

                // Filling a circle with color test case
                const step8 = () => {  
                    const testCaseHeader = new Text (70, 40, "Filling a circle with color");
                    testCaseHeader.draw(mainContext);
                    const circle = new Circle(200, 200, 100, 1);

                    gsap.to(circle, {
                        fillColor: 'yellow',
                        duration: 2,
                        onUpdate: () => {
                            circle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }
                
                // Expanding a circle test case
                const step9 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Expanding a circle");
                        testCaseHeader.draw(staticContext);
                    }
                    const circle = new Circle(200, 200, 50, 1);
                    gsap.to(circle, {
                        radius: 100,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            circle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Shrinking a circle test case
                const step10 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Shrinking a circle");
                        testCaseHeader.draw(staticContext);
                    }
                    const circle = new Circle(200, 200, 100, 1);

                    gsap.to(circle, {
                        radius: 50,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            circle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Changing the outline color of a circle test case
                const step11 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Changing the outline color of a circle");
                        testCaseHeader.draw(staticContext);
                    }
                    const circle = new Circle(200, 200, 50, 1, 'black');

                    gsap.to(circle, {
                        outlineColor: 'red',
                        duration: 2,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            circle.draw(mainContext);
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
                    default:
                        break; 
                }        
            }
        }
    }, [step]);

    /// This animation will have an animation number three, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={3} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={staticCanvasRef} width={800} height={600} style={{ position: 'absolute', zIndex: 0,  border: '1px solid black' }}>Canvas</canvas>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ zIndex: 1, border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}

export default CircleTestCases;