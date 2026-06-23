import React, { useState, useRef, useEffect } from 'react';
import { Arrow, Text } from './GeneralAnimationGraphics';
import AnimationController from './AnimationController';
import gsap from 'gsap';

// This component is used to test the Arrow class to make sure arrow animations are displayed smoothly and accurately

function ArrowTestCases() {
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

                // Drawing a general arrow test case
                const step1 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing an Arrow");
                    testCaseHeader.draw(mainContext);
                    const arrow = new Arrow(100, 100, 200, 200, 1, 'black');
                    arrow.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing a arrow with a different color
                const step2 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing an Arrow with a Different Color");
                    testCaseHeader.draw(mainContext);
                    const arrow = new Arrow(100, 100, 200, 200, 1, 'red');
                    arrow.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing multiple arrows test case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing Multiple Arrows");
                    testCaseHeader.draw(mainContext);
                    const arrow1 = new Arrow(100, 100, 200, 200, 1, 'black');
                    const arrow2 = new Arrow(200, 100, 300, 200, 1, 'blue');
                    const arrow3 = new Arrow(300, 100, 400, 200, 1, 'green');
                    arrow1.draw(mainContext);
                    arrow2.draw(mainContext);
                    arrow3.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing an arrow with a different line width and head length
                const step4 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing an Arrow with Different Line Width and Head Length");
                    testCaseHeader.draw(mainContext);
                    const arrow = new Arrow(100, 100, 200, 200, 1, 'black', 3, 20);
                    arrow.draw(mainContext);
                    setIsAnimating(false);
                }

                // Drawing crossing arrows test case
                const step5 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing Crossing Arrows");
                    testCaseHeader.draw(mainContext);
                    const arrow1 = new Arrow(100, 100, 200, 200, 1, 'black');
                    const arrow2 = new Arrow(200, 100, 100, 200, 1, 'black');
                    arrow1.draw(mainContext);
                    arrow2.draw(mainContext);
                    setIsAnimating(false);
                }

                // Different opacity levels for the arrows test case
                const step6 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing Arrows with Different Opacity Levels");
                    testCaseHeader.draw(mainContext);
                    const arrow1 = new Arrow(100, 100, 200, 200, 0.2, 'black');
                    const arrow2 = new Arrow(200, 100, 300, 200, 0.5, 'black');
                    const arrow3 = new Arrow(300, 100, 400, 200, 0.8, 'black');
                    arrow1.draw(mainContext);
                    arrow2.draw(mainContext);
                    arrow3.draw(mainContext);
                    setIsAnimating(false);
                }

                // Fading in a arrow test case
                const step7 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading in an arrow");
                        testCaseHeader.draw(staticContext);
                    }
                    const arrow = new Arrow(100, 100, 200, 200, 0, 'black');

                    gsap.to(arrow, {
                        opacity: 1,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Fading out an arrow test case
                const step8 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Fading out an Arrow");
                        testCaseHeader.draw(staticContext);
                    }
                    const arrow = new Arrow(100, 100, 200, 200, 1, 'black');

                    gsap.to(arrow, {
                        opacity: 0,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Moving an arrow test case
                const step9 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Moving a Arrow using GSAP timeline");
                        testCaseHeader.draw(staticContext);
                    }
                    const arrow = new Arrow(100, 100, 200, 200, 1, 'black');

                    const timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});
                    
                    timeline.to(arrow, {
                        startX: 200,
                        endX: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        startY: 200,
                        endY: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        startX: 100,
                        endX: 200,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        startY: 100,
                        endY: 200,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    });
                }

                // Rotating an arrow test case
                const step10 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Rotating an Arrow");
                        testCaseHeader.draw(staticContext);
                    }

                    const arrow = new Arrow(200, 300, 300, 300, 1, 'black');

                    const timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});

                    timeline.to(arrow, {
                        endX: 200,
                        endY: 200,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        endX: 100,
                        endY: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        endX: 200,
                        endY: 400,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        endX: 300,
                        endY: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    });
                }

                // Expanding and shrinking an arrow line length test case
                const step11 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Scaling arrow line length");
                        testCaseHeader.draw(staticContext);
                    }

                    const arrow = new Arrow(200, 300, 300, 300, 1, 'black');

                    const timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});

                    timeline.to(arrow, {
                        endX: 400,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        endX: 500,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        endX: 600,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    })
                    .to(arrow, {
                        endX: 300,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    });
                }

                // Scaling arrow width and head length test case
                const step12 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Scaling Arrow Width and Head Length");
                        testCaseHeader.draw(staticContext);
                    }
                    const arrow = new Arrow(200, 300, 300, 300, 1, 'black', 1, 10);

                    const timeline = gsap.timeline({onComplete: () => setIsAnimating(false)});
                    
                    timeline.to(arrow, {
                        lineWidth: 5,
                        headLength: 30,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        },
                    })
                    .to(arrow, {
                        lineWidth: 1,
                        headLength: 10,
                        duration: 1,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
                        }
                    });
                }

                // Changing the color of an arrow test case
                const step13 = () => {
                    const staticContext = staticCanvas?.getContext('2d');
                    if (staticContext) {
                        const testCaseHeader = new Text (70, 40, "Changing the Color of a Arrow");
                        testCaseHeader.draw(staticContext);
                    }
                    const arrow = new Arrow(200, 300, 300, 300, 1, 'black');
                    
                    gsap.to(arrow, {
                        color: 'red',
                        duration: 2,
                        onUpdate: () => {
                            mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                            arrow.draw(mainContext);
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

    return (
        <div>
            <AnimationController currStep={step} numSteps={numSteps} updateStep={handleStepChange} isAnimating={isAnimating}></AnimationController>
            <br></br>
            <canvas ref={staticCanvasRef} width={800} height={600} style={{ position: 'absolute', zIndex: 0,  border: '1px solid black' }}>Canvas</canvas>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ zIndex: 1, border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}

export default ArrowTestCases;