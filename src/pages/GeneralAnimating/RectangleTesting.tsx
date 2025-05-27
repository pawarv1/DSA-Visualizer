import React, { useState, useRef, useEffect } from 'react';
import { Rectangle, Text } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap, { set, timeline } from 'gsap';

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

    // 12 test cases to display
    const numSteps = 12;
   
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

                // Drawing a general rectangle test case
                const step1 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing rectangle with no outline color");
                    testCaseHeader.draw(mainContext);
                    const firstRectangle = new Rectangle(100, 100, 200, 100);
                    firstRectangle.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing a rectangle with a red border test case
                const step2 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing rectangle with red border");
                    testCaseHeader.draw(mainContext);
                    const secondRectangle = new Rectangle(100, 100, 100, 200, 1, "red");
                    secondRectangle.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing multiple rectangles test case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing multiple Rectangles");
                    testCaseHeader.draw(mainContext);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100),
                        new Rectangle(300, 300, 100, 200, 1, "red"),
                        new Rectangle(100, 300, 100, 100, 1, "blue"),
                        new Rectangle(500, 300, 100, 100, 1, "green")
                    ];

                    for (let i = 0; i < rectangles.length; i++) {
                        rectangles[i].draw(mainContext);
                    }
                    setIsAnimating(false);
                }

                // Different opacity test case
                const step4 = () => {
                    const testCaseHeader = new Text (70, 40, "Testing different levels of opacity");
                    testCaseHeader.draw(mainContext);
                    const rectangle1 = new Rectangle(100, 75, 200, 100);
                    const rectangle2 = new Rectangle(100, 275, 200, 100, 0.5);
                    const rectangle3 = new Rectangle(100, 475, 200, 100, 0.25);
                    rectangle1.draw(mainContext);
                    rectangle2.draw(mainContext);
                    rectangle3.draw(mainContext);
                    setIsAnimating(false);
                }

                // Overlapped Rectangles test case
                const step5 = () => {
                    const testCaseHeader1 = new Text (70, 40, "Overlapped Rectangles");
                    testCaseHeader1.draw(mainContext);

                    const rectangles = [
                        new Rectangle(100, 100, 100, 100),
                        new Rectangle(120, 100, 100, 100),
                        new Rectangle(140, 100, 100, 100),
                        new Rectangle(160, 100, 100, 100),
                        new Rectangle(180, 100, 100, 100)
                    ];

                    for (let i = 0; i < rectangles.length; i++) {
                        rectangles[i].draw(mainContext);
                    }
                    
                    setIsAnimating(false);
                }

                // Fading in rectangle test case
                const step6 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading in rectangle");
                        testCaseHeader.draw(staticContext);
                    }
                    const rectangle = new Rectangle(100, 100, 100, 100, 0)
                    
                    gsap.to(rectangle, {
                        opacity: 1,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            rectangle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Fading out rectangle test case
                const step7 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading out rectangle");
                        testCaseHeader.draw(staticContext);
                    }
                    const rectangle = new Rectangle(100, 100, 100, 100, 1)
                    
                    gsap.to(rectangle, {
                        opacity: 0,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            rectangle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Moving a rectangle around test case
                const step8 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Moving a rectangle around using GSAP timeline");
                        testCaseHeader.draw(staticContext);
                    }

                    const rectangle = new Rectangle(100, 100, 100, 100);

                    let timeline = gsap.timeline({onComplete: () => { setIsAnimating(false); }});

                    timeline.to(rectangle, {
                        x: 300,
                        y: 300,
                        duration: 1,
                        onUpdate: () => {   
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            rectangle.draw(mainContext);
                        }
                    })
                    .to(rectangle, {
                        x: 100,
                        y: 100,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            rectangle.draw(mainContext);
                        }
                    })
                }
                
                // Filling a rectangle with color test case
                const step9 = () => {
                    const testCaseHeader = new Text (70, 40, "Filling a rectangle with color");
                    testCaseHeader.draw(mainContext);
                    const rectangle = new Rectangle(100, 100, 200, 100);

                    gsap.to(rectangle, {
                        fillColor: "yellow",
                        duration: 2,
                        onUpdate: () => {
                            rectangle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Expanding a rectangle test case
                const step10 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Expanding a rectangle");
                        testCaseHeader.draw(staticContext);
                    }

                    const rectangle = new Rectangle(100, 100, 100, 100);

                    gsap.to(rectangle, {
                        width: 200,
                        height: 200,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            rectangle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Shrinking a rectangle test case
                const step11 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Shrinking a rectangle");
                        testCaseHeader.draw(staticContext);
                    }
                    const rectangle = new Rectangle(100, 100, 200, 200);
                    gsap.to(rectangle, {
                        width: 100,
                        height: 100,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            rectangle.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Changing outline color of a rectangle test case
                const step12 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Changing outline color of a rectangle");
                        testCaseHeader.draw(staticContext);
                    }
                    const rectangle = new Rectangle(100, 100, 200, 100, 1, "black");

                    gsap.to(rectangle, {
                        outlineColor: "blue",
                        duration: 2,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            rectangle.draw(mainContext);
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
                    case 12:
                        setIsAnimating(true);
                        step12();
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
            <canvas ref={staticCanvasRef} width={800} height={600} style={{ position: 'absolute', zIndex: 0,  border: '1px solid black' }}>Canvas</canvas>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ zIndex: 1, border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}

export default RectangleTestCases;