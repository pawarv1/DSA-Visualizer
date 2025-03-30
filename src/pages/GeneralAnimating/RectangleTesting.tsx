import React, { useState, useRef, useEffect } from 'react';
import { Rectangle, Text, Circle, Line, Arrow } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap from 'gsap';

// This component tests the rectangle class to make sure rectangle animations are displayed smoothly and accurately

export function RectangleTestCases() {
    
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
    const numSteps = 18;
   
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

                // Clearing Test Case
                const step3 = () => {
                    const testCaseHeader = new Text (70, 40, "Clearing ");
                    testCaseHeader.draw(context1);
                    const thirdRectangle = new Rectangle(100, 100, 100, 100);
                    thirdRectangle.draw(context1);
                    setTimeout(() => { 
                        thirdRectangle.clear(context1);
                        setIsAnimating(false);
                    }, 1000);
                }

                // Drawing multiple rectangles test case
                const step4 = () => {
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

                // Clearing multiple rectangles test case
                const step5 = () => {
                    const testCaseHeader = new Text (70, 40, "Clearing multiple Rectangles");
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

                    setTimeout(() => {
                        for (let i = 0; i < rectangles.length; i++) {
                            rectangles[i].clear(context1);
                            setIsAnimating(false);
                        }
                    }, 1000)
                }

                // Test Case Overlapped Rectangles
                const step6 = () => {
                    const testCaseHeader1 = new Text (70, 40, "Overlapped Rectangles");
                    testCaseHeader1.draw(context1);
                    
                    const rectangles1 = [
                        new Rectangle(100, 100, 100, 100, 1, "green"),
                        new Rectangle(120, 100, 100, 100, 1, "red"),
                        new Rectangle(140, 100, 100, 100, 1, "yellow"),
                        new Rectangle(160, 100, 100, 100, 1, "orange"),
                        new Rectangle(180, 100, 100, 100, 1, "blue")
                    ];

                    for (let i = 0; i < rectangles1.length; i++) {
                        rectangles1[i].draw(context1);
                    }

                    const testCaseHeader2 = new Text (70, 300, "If overlapping, try not to mix colors");
                    testCaseHeader2.draw(context1);

                    const rectangles2 = [
                        new Rectangle(100, 400, 100, 100),
                        new Rectangle(120, 400, 100, 100),
                        new Rectangle(140, 400, 100, 100),
                        new Rectangle(160, 400, 100, 100),
                        new Rectangle(180, 400, 100, 100)
                    ];

                    for (let i = 0; i < rectangles2.length; i++) {
                        rectangles2[i].draw(context1);
                    }
                    
                    setIsAnimating(false);
                }

                // Test Case Drawing Nested Rectangles
                const step7 = () => {
                    const testCaseHeader = new Text (70, 40, "Drawing nested rectangles");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100),
                        new Rectangle(125, 125, 150, 50)
                    ];

                    for (let i = 0; i < rectangles.length; i++) {
                        rectangles[i].draw(context1);
                    }
                    setIsAnimating(false);
                }

                // Test Case Clearing Nested Rectangles
                const step8 = () => {
                    const testCaseHeader = new Text (70, 40, "Clearing nested rectangles");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100),
                        new Rectangle(125, 125, 150, 50)
                    ];

                    for (let i = 0; i < rectangles.length; i++) {
                        rectangles[i].draw(context1);
                    }

                    setTimeout(() => {
                        rectangles[0].clear(context1);
                        rectangles[1].clear(context1);
                        setIsAnimating(false);
                    }, 1000)
                }

                // Fading in rectangle test case
                const step9 = () => {
                    const testCaseHeader = new Text (70, 40, "Fading in rectangles using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100, 0),
                        new Rectangle(300, 300, 100, 200, 0, "red"),
                        new Rectangle(100, 300, 100, 100, 0, "blue"),
                        new Rectangle(500, 300, 100, 100, 0, "green")
                    ];

                    rectangles.forEach((rectangle) => {
                        gsap.to(rectangle, {
                            duration: 1,
                            opacity: 1,
                            onUpdate: () => {
                                rectangle.clear(context1);
                                rectangle.draw(context1);
                            },
                            onComplete: () => setIsAnimating(false)
                        })
                    });
                }

                // Fading out rectangle test case
                const step10 = () => {
                    const testCaseHeader = new Text (70, 40, "Fading out rectangles using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100),
                        new Rectangle(300, 300, 100, 200),
                        new Rectangle(100, 300, 100, 100),
                        new Rectangle(500, 300, 100, 100)
                    ];

                    rectangles.forEach((rectangle) => {
                        gsap.to(rectangle, {
                            duration: 1,
                            opacity: 0,
                            onUpdate: () => {
                                rectangle.clear(context1);
                                rectangle.draw(context1);
                            },
                            onComplete: () => setIsAnimating(false)
                        })
                    });
                }

                // Expansion Test Case
                // This was originally supposed to test movement, but the test case
                //  gave a different result than expected, and can be used for other purposes
                const step11 = () => {
                    const testCaseHeader = new Text (70, 40, "Expansion using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangle = new Rectangle(100, 100, 200, 100);
                    
                    let timeline = gsap.timeline();
                    
                    gsap.to(rectangle, {
                        duration: 1,
                        x: 200,
                        onUpdate: () => {
                            rectangle.clear(context1);
                            rectangle.draw(context1);
                        },
                    })

                    gsap.to(rectangle, {
                        duration: 1,
                        y: 200,
                        onUpdate: () => {
                            rectangle.clear(context1);
                            rectangle.draw(context1);
                        },
                    })

                    gsap.to(rectangle, {
                        duration: 1,
                        x: 100,
                        onUpdate: () => {
                            rectangle.clear(context1);
                            rectangle.draw(context1);
                        },
                    })

                    gsap.to(rectangle, {
                        duration: 1,
                        y: 100,
                        onUpdate: () => {
                            rectangle.clear(context1);
                            rectangle.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    })
                }

                //  Shading With Clearing Test Case
                //  This was originally supposed to test movement, but the test case
                //  gave a different result than expected, and can be used for other purposes
                const step12 = () => {
                    const testCaseHeader = new Text (70, 40, "Rectangle shading with clearing using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangle = new Rectangle(100, 100, 100, 100);
                    
                    let timeline = gsap.timeline();
                    
                    timeline.to(rectangle, {
                        duration: 1,
                        x: 300,
                        onUpdate: () => {
                            rectangle.clear(context1);
                            rectangle.draw(context1);
                        },
                    })

                    timeline.to(rectangle, {
                        duration: 1,
                        y: 300,
                        onUpdate: () => {
                            rectangle.clear(context1);
                            rectangle.draw(context1);
                        },
                    })

                    timeline.to(rectangle, {
                        duration: 1,
                        x: 100,
                        onUpdate: () => {
                            rectangle.clear(context1);
                            rectangle.draw(context1);
                        },
                    })

                    timeline.to(rectangle, {
                        duration: 1,
                        y: 100,
                        onUpdate: () => {
                            rectangle.clear(context1);
                            rectangle.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    })
                }

                //  Shading Without Clearing Test Case
                const step13 = () => {
                    const testCaseHeader = new Text (70, 40, "Rectangle shading without clearing using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangle = new Rectangle(100, 100, 100, 100);
                    
                    let timeline = gsap.timeline();

                    timeline.to(rectangle, {
                        duration: 1,
                        x: 300,
                        onUpdate: () => {
                            rectangle.draw(context1);
                        },
                    })

                    timeline.to(rectangle, {
                        duration: 1,
                        y: 300,
                        onUpdate: () => {
                            rectangle.draw(context1);
                        },
                    })

                    timeline.to(rectangle, {
                        duration: 1,
                        x: 100,
                        onUpdate: () => {
                            rectangle.draw(context1);
                        },
                    })

                    timeline.to(rectangle, {
                        duration: 1,
                        y: 100,
                        onUpdate: () => {
                            rectangle.draw(context1);
                        },
                        onComplete: () => setIsAnimating(false)
                    })
                }

                // Test Case Moving Rectangle Around
                // In order to get the best movement animation, the entire canvas, not just the old rectangles has to be cleared in each frame
                const step14 = () => {
                    const testCaseHeader = new Text (70, 40, "Moving a rectangle around using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangle = new Rectangle(100, 100, 100, 100);

                    let timeline = gsap.timeline();

                    timeline.to(rectangle, {
                        duration: 1,
                        x: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangle.draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangle, {
                        delay: 0.5,
                        duration: 1,
                        y: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangle.draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangle, {
                        delay: 0.5,
                        duration: 1,
                        x: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangle.draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangle, {
                        delay: 0.5,
                        duration: 1,
                        y: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangle.draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangle, {
                        delay: 0.5,
                        duration: 1,
                        x: 300,
                        y: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangle.draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangle, {
                        delay: 0.5,
                        duration: 1,
                        x: 100,
                        y: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangle.draw(context1);      // Draw the updated rectangle
                        },
                        onComplete: () => {
                            setTimeout(() => {
                                setIsAnimating(false);
                            },2);
                        }
                    })
                }

                // Test Case moving overlappeds rectangle around
                // Will be useful for linked lists
                const step15 = () => {
                    const testCaseHeader = new Text (70, 40, "Moving overlapped rectangles around using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 200, 100),
                        new Rectangle(100, 100, 100, 100)
                    ];

                    let timeline = gsap.timeline();

                    timeline.to(rectangles, {
                        duration: 1,
                        x: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[0].draw(context1);  // Draw the updated rectangle
                            rectangles[1].draw(context1);  // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        y: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[0].draw(context1);  // Draw the updated rectangle
                            rectangles[1].draw(context1);  // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        x: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[0].draw(context1);  // Draw the updated rectangle
                            rectangles[1].draw(context1);  // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        y: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[0].draw(context1);      // Draw the updated rectangle
                            rectangles[1].draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        x: 300,
                        y: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[0].draw(context1);      // Draw the updated rectangle
                            rectangles[1].draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        x: 100,
                        y: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[0].draw(context1);      // Draw the updated rectangle
                            rectangles[1].draw(context1);      // Draw the updated rectangle
                        },
                        onComplete: () => {
                            setTimeout(() => {
                                setIsAnimating(false);
                            },2);
                        }
                    })
                }

                // Test Case moving nested rectangles around
                const step16 = () => {
                    const testCaseHeader = new Text (70, 40, "Moving nested rectangles around using GSAP");
                    testCaseHeader.draw(context1);
                    const rectangles = [
                        new Rectangle(100, 100, 100, 100),
                        new Rectangle(125, 125, 50, 50)
                    ];

                    let timeline = gsap.timeline();

                    timeline.to(rectangles, {
                        duration: 1,
                        x: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[1].x = rectangles[0].x + 25;
                            rectangles[1].y = rectangles[0].y + 25;
                            rectangles[0].draw(context1);  // Draw the updated rectangle
                            rectangles[1].draw(context1);  // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        y: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[1].x = rectangles[0].x + 25;
                            rectangles[1].y = rectangles[0].y + 25;
                            rectangles[0].draw(context1);  // Draw the updated rectangle
                            rectangles[1].draw(context1);  // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        x: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[1].x = rectangles[0].x + 25;
                            rectangles[1].y = rectangles[0].y + 25;
                            rectangles[0].draw(context1);  // Draw the updated rectangle
                            rectangles[1].draw(context1);  // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        y: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[1].x = rectangles[0].x + 25;
                            rectangles[1].y = rectangles[0].y + 25;
                            rectangles[0].draw(context1);      // Draw the updated rectangle
                            rectangles[1].draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        x: 300,
                        y: 300,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[1].x = rectangles[0].x + 25;
                            rectangles[1].y = rectangles[0].y + 25;
                            rectangles[0].draw(context1);      // Draw the updated rectangle
                            rectangles[1].draw(context1);      // Draw the updated rectangle
                        }
                    })

                    timeline.to(rectangles, {
                        delay: 0.5,
                        duration: 1,
                        x: 100,
                        y: 100,
                        onUpdate: () => {
                            context1.clearRect(0, 0, canvas1.width, canvas1.height); // Clear entire canvas
                            testCaseHeader.draw(context1); // Redraw static header
                            rectangles[1].x = rectangles[0].x + 25;
                            rectangles[1].y = rectangles[0].y + 25;
                            rectangles[0].draw(context1);      // Draw the updated rectangle
                            rectangles[1].draw(context1);      // Draw the updated rectangle
                        },
                        onComplete: () => {
                            setTimeout(() => {
                                setIsAnimating(false);
                            },2);
                        }
                    })
                }

                const step17 = () => {
                    const testCaseHeader = new Text (70, 40, "Highlighting a rectangle");
                    testCaseHeader.draw(context1);
                    const rectangle = new Rectangle(100, 100, 200, 100);
                    rectangle.draw(context1);
                    context1.fillStyle = "yellow";
                    context1.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
                    setIsAnimating(false);
                }

                // Test Case checking opacity
                const step18 = () => {
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
                    case 8:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step8();
                        break;
                    case 9:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step9();
                        break;
                    case 10:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step10();
                        break;
                    case 11:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step11();
                        break;
                    case 12:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step12();
                        break;
                    case 13:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step13();
                        break;
                    case 14:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step14();
                        break;
                    case 15:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step15();
                        break;
                    case 16:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step16();
                        break;
                    case 17:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step17();
                        break;
                    case 18:
                        setIsAnimating(true);   // Set animation state to true before starting the animation
                        step18();
                        break;
                    default:
                        break; 
                }        
            }
        }
    }, [step]);

    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={1} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={canvasRef1} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}