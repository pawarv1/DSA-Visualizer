import React, { useState, useRef, useEffect } from 'react';
import { Text } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap, { set } from 'gsap';

// This component tests the Text class to make sure text animations are displayed smoothly and accurately

function TextTestCases() {
    
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
   
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const staticCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update canvas based on step dependency
    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;
        const staticCanvas = staticCanvasRef.current;

        // Ensure that the canvas is not null
        if (mainCanvas) {
            const mainContext = mainCanvas.getContext('2d');

            // Ensure that the context is not null
            if (mainContext) {

                mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                // Clear the static canvas if it exists
                staticCanvas?.getContext('2d')?.clearRect(0, 0, staticCanvas.width, staticCanvas.height);

                // General text test case
                const step1 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing regular text");
                    testCaseHeader.draw(mainContext);
                    const text1 = new Text(100, 100, 'Hello World');
                    text1.draw(mainContext);
                    setIsAnimating(false);
                }

                // Text with different font and color test case
                const step2 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing text with different font and color");
                    testCaseHeader.draw(mainContext);
                    const text1 = new Text(200, 200, 'Hello World', 1, '30px Times New Roman', 'red');
                    text1.draw(mainContext);
                    setIsAnimating(false);
                }

                // Text with different opacity test case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing text with different opacity");
                    testCaseHeader.draw(mainContext);
                    const text1 = new Text(100, 100, 'Hello World', 0.5);
                    text1.draw(mainContext);
                    setIsAnimating(false);
                }

                // Multiple text objects test case
                const step4 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing multiple text objects");
                    testCaseHeader.draw(mainContext);
                    const text1 = new Text(100, 100, 'Hello World');
                    const text2 = new Text(200, 200, 'Goodbye World', 1, '30px Times New Roman', 'red');
                    const text3 = new Text(300, 300, 'Hello Again', 0.5);
                    text1.draw(mainContext);
                    text2.draw(mainContext);
                    text3.draw(mainContext);
                    setIsAnimating(false);
                }

                // Fading in text test case
                const step5 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading in text");
                        testCaseHeader.draw(staticContext);
                    }
                    const text1 = new Text(100, 100, 'Hello World', 0);

                    gsap.to(text1, {
                        opacity: 1,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            text1.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Fading out text test case
                const step6 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading out text");
                        testCaseHeader.draw(staticContext);
                    }
                    const text1 = new Text(100, 100, 'Hello World', 1);

                    gsap.to(text1, {
                        opacity: 0,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            text1.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Moving text test case
                const step7 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Moving text around using GSAP timeline");
                        testCaseHeader.draw(staticContext);
                    }
                    const text1 = new Text(100, 100, 'Hello World', 1);

                    let timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});

                    timeline.to(text1, {
                        x: 300,
                        y: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            text1.draw(mainContext);
                        }
                    })
                    .to(text1, {
                        x: 100,
                        y: 100,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            text1.draw(mainContext);
                        }
                    })
                }

                // Scaling text test case
                const step8 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Scaling text using GSAP timeline");
                        testCaseHeader.draw(staticContext);
                    }
                    const text1 = new Text(100, 100, 'Hello World', 1, '30px Arial', 'black');

                    let timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});

                    timeline.to(text1, {
                        font: '60px Arial',
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            text1.draw(mainContext);
                        }
                    })
                    .to(text1, {
                        font: '30px Arial',
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            text1.draw(mainContext);
                        }
                    });
                }

                // Changing text color test case
                const step9 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Changing text color using GSAP timeline");
                        testCaseHeader.draw(staticContext);
                    }
                    const text1 = new Text(100, 100, 'Hello World', 1, '30px Arial', 'black');

                    gsap.to(text1, {
                        color: 'red',
                        duration: 2,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            text1.draw(mainContext);
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
                    default:
                        break; 
                }        
            }
        }
    }, [step]);

    /// This animation will have an animation number two, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={2} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={staticCanvasRef} width={800} height={600} style={{ position: 'absolute', zIndex: 0,  border: '1px solid black' }}>Canvas</canvas>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ zIndex: 1, border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}

export default TextTestCases;