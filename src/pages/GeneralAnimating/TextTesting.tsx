import React, { useState, useRef, useEffect } from 'react';
import { Text } from './GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap from 'gsap';

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

    // 7 test cases to display
    const numSteps = 4;
   
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

                const step1 = () => {
                    setIsAnimating(false);
                }

                const step2 = () => {
                    setIsAnimating(false);
                }

                const step3 = () => {
                    setIsAnimating(false);
                }

                const step4 = () => {
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