import React, { useState, useRef, useEffect } from 'react';
import { Line, Text } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap, { set, timeline } from 'gsap';

// This component is used to test the Line class to make sure line animations are displayed smoothly and accurately

function LineTestCases() {
    const [step, setStep] = useState(0);                    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    // Step can only be changed if the animation is not running
    const handleStepChange = (newStep: number) => {
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 13 test cases to display
    const numSteps = 13;
   
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

                // Drawing a general line test case
                const step1 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing a Line");
                    testCaseHeader.draw(mainContext);
                    const line = new Line(100, 100, 200, 200);
                    line.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing a line with a different color
                const step2 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing a Line with a Different Color");
                    testCaseHeader.draw(mainContext);
                    const line = new Line(100, 100, 200, 200, 1, 'red');
                    line.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing multiple lines test case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing Multiple Lines");
                    testCaseHeader.draw(mainContext);
                    const line1 = new Line(100, 100, 200, 200, 1, 'blue');
                    const line2 = new Line(200, 100, 300, 200, 1, 'green');
                    const line3 = new Line(300, 100, 400, 200, 1, 'purple');
                    line1.draw(mainContext);
                    line2.draw(mainContext);
                    line3.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing a line with a different line width
                const step4 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing a Line with a Different Line Width");
                    testCaseHeader.draw(mainContext);
                    const line = new Line(100, 100, 200, 200, 1, 'black', 5);
                    line.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing crossing lines test case
                const step5 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing Crossing Lines");
                    testCaseHeader.draw(mainContext);
                    const line1 = new Line(100, 100, 200, 200, 1, 'orange');
                    const line2 = new Line(200, 100, 100, 200, 1, 'pink');
                    line1.draw(mainContext);
                    line2.draw(mainContext);
                    setIsAnimating(false);
                }

                // Different opacity levels for the lines test case
                const step6 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing Lines with Different Opacity Levels");
                    testCaseHeader.draw(mainContext);
                    const line1 = new Line(100, 100, 200, 200, 1, 'black');
                    const line2 = new Line(200, 100, 300, 200, 0.5, 'black');
                    const line3 = new Line(300, 100, 400, 200, 0.25, 'black');
                    line1.draw(mainContext);
                    line2.draw(mainContext);
                    line3.draw(mainContext);
                    setIsAnimating(false);
                }

                // Fading in a line test case
                const step7 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading in a Line");
                        testCaseHeader.draw(staticContext);
                    }
                    const line = new Line(100, 100, 200, 200, 0, 'black');

                    gsap.to(line, {
                        opacity: 1,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Fading out a line test case
                const step8 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading out a Line");
                        testCaseHeader.draw(staticContext);
                    }
                    const line = new Line(100, 100, 200, 200, 1, 'black');

                    gsap.to(line, {
                        opacity: 0,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Moving a line test case
                const step9 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Moving a Line using GSAP timeline");
                        testCaseHeader.draw(staticContext);
                    }
                    const line = new Line(100, 100, 200, 200, 1, 'black');

                    const timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});
                    
                    timeline.to(line, {
                        startX: 200,
                        endX: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        startY: 200,
                        endY: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        startX: 100,
                        endX: 200,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        startY: 100,
                        endY: 200,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    });
                }

                // Rotating a line test case
                // Line shrinks and rotates around its center, this is simpler than having the line stay the same length the whole rotation
                const step10 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Rotating a Line");
                        testCaseHeader.draw(staticContext);
                    }

                    const line = new Line(200, 300, 300, 300, 1, 'black');

                    const timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});

                    timeline.to(line, {
                        endX: 200,
                        endY: 200,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        endX: 100,
                        endY: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        endX: 200,
                        endY: 400,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        endX: 300,
                        endY: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    });
                }

                // Expanding and shrinking a line test case
                const step11 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Scaling Line length");
                        testCaseHeader.draw(staticContext);
                    }

                    const line = new Line(200, 300, 300, 300, 1, 'black');

                    const timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});

                    timeline.to(line, {
                        endX: 400,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        endX: 500,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        endX: 600,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    })
                    .to(line, {
                        endX: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    });
                }

                // Scaling line width test case
                const step12 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Scaling Line Width");
                        testCaseHeader.draw(staticContext);
                    }
                    const line = new Line(200, 300, 300, 300, 1, 'black', 1);
                    
                    const timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});

                    timeline.to(line, {
                        lineWidth: 5,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        },
                    })
                    .to(line, {
                        lineWidth: 1,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
                        }
                    });
                } 

                // Changing the color of a line test case
                const step13 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Changing the Color of a Line");
                        testCaseHeader.draw(staticContext);
                    }
                    const line = new Line(200, 300, 300, 300, 1, 'black');
                    
                    gsap.to(line, {
                        color: 'red',
                        duration: 2,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            line.draw(mainContext);
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
                    case 13:
                        setIsAnimating(true);
                        step13();
                        break;
                    default:
                        break; 
                }        
            }
        }
    }, [step]);

    /// This animation will have an animation number four, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={4} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={staticCanvasRef} width={800} height={600} style={{ position: 'absolute', zIndex: 0,  border: '1px solid black' }}>Canvas</canvas>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ zIndex: 1, border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}

export default LineTestCases;