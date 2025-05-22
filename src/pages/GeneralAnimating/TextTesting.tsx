import React, { useState, useRef, useEffect } from 'react';
import { Text } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap, { set } from 'gsap';

// This component tests the Text class to make sure text animations are displayed smoothly and accurately

function TextTestCases() {
    
    const [step, setStep] = useState(0);    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    const handleStepChange = (newStep: number) => {
        // Prevent the user from changing steps while an animation is running
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 8 test cases to display
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

                // General text test case
                const step1 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing regular text");
                    testCaseHeader.draw(context1);
                    const text1 = new Text(100, 100, 'Hello World');
                    text1.draw(context1);
                    setIsAnimating(false);
                }

                // Text with different font and color test case
                const step2 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing text with different font and color");
                    testCaseHeader.draw(context1);
                    const text1 = new Text(200, 200, 'Hello World', 1, '30px Times New Roman', 'red');
                    text1.draw(context1);
                    setIsAnimating(false);
                }

                // Text with different opacity test case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing text with different opacity");
                    testCaseHeader.draw(context1);
                    const text1 = new Text(100, 100, 'Hello World', 0.5);
                    text1.draw(context1);
                    setIsAnimating(false);
                }

                // Multiple text objects test case
                const step4 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing multiple text objects");
                    testCaseHeader.draw(context1);
                    const text1 = new Text(100, 100, 'Hello World');
                    const text2 = new Text(200, 200, 'Goodbye World', 1, '30px Times New Roman', 'red');
                    const text3 = new Text(300, 300, 'Hello Again', 0.5);
                    text1.draw(context1);
                    text2.draw(context1);
                    text3.draw(context1);
                    setIsAnimating(false);
                }

                // Fading in text test case
                // Should only be used when text is the only object on the canvas or when
                const step5 = () => {
                    const testCaseHeader = new Text (70, 40, "Fading in text using GSAP");
                    testCaseHeader.draw(context1);
                    const text1 = new Text(100, 100, 'Hello World', 0);
                    text1.draw(context1);

                    gsap.to(text1, {
                        opacity: 1,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            text1.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Fading out text test case
                // Should only be used when text is the only object on the canvas
                const step6 = () => {
                    const testCaseHeader = new Text (70, 40, "Fading out text using GSAP");
                    testCaseHeader.draw(context1);
                    const text1 = new Text(100, 100, 'Hello World', 1);
                    text1.draw(context1);

                    gsap.to(text1, {
                        opacity: 0,
                        duration: 1,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height);
                            testCaseHeader.draw(context1);
                            text1.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    });
                }

                // Moving text test case
                const step7 = () => {
                    const testCaseHeader = new Text (70, 40, "Moving text around using GSAP");
                    testCaseHeader.draw(context1);
                    const text1 = new Text(100, 100, 'Hello World', 1);
                    text1.draw(context1);

                    let timeline = gsap.timeline();
                    
                    timeline.to(text1, {
                        duration: 1,
                        x: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1);
                            text1.draw(context1);
                        }
                    })

                    timeline.to(text1, {
                        delay: 0.5,
                        duration: 1,
                        y: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1);
                            text1.draw(context1);
                        }
                    })

                    timeline.to(text1, {
                        delay: 0.5,
                        duration: 1,
                        x: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1);
                            text1.draw(context1);
                        }
                    })

                    timeline.to(text1, {
                        delay: 0.5,
                        duration: 1,
                        y: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1);
                            text1.draw(context1);
                        }
                    })

                    timeline.to(text1, {
                        delay: 0.5,
                        duration: 1,
                        x: 300,
                        y: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1);
                            text1.draw(context1);
                        }
                    })

                    timeline.to(text1, {
                        delay: 0.5,
                        duration: 1,
                        x: 100,
                        y: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1);
                            text1.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    })   
                }

                 // Run the associated step method for the given step
                 switch (step) {
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
                        break;
                    case 6:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step6();
                        break;
                    case 7:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
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
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={2} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={canvasRef1} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}

export default TextTestCases;