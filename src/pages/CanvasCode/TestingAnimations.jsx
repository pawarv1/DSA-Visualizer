import React, { useState, useRef, useEffect } from 'react';
import { Text, Arrow, Line } from './AnimationGraphics/GeneralAnimationGraphics';
import AnimationTool from './AnimationTool';
import gsap from 'gsap';

export function Animation1() {
    
    const [step, setStep] = useState(0);    // useState hook is used to track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    const handleStepChange = (newStep) => {
        // Prevent the user from changing steps while an animation is running
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // Number of steps for this animation
    const numSteps = 3;
   
    const canvasRef1 = useRef(null);    // Reference to the canvas element

    // This hook updates the canvas based on the step dependency
    useEffect(() => {
        const canvas1 = canvasRef1.current;
        const context1 = canvas1.getContext('2d');
        context1.clearRect(0, 0, canvas1.width, canvas1.height);

        // Step 1
        const step1 = () => {
          
            setIsAnimating(false);
        }

        // Step 2
        const step2 = () => {
          
            setIsAnimating(false);
        }

        // Step 3
        const step3 = () => {
         
            setIsAnimating(false)
        }

        // Switch statement which runs the associated step method for the given step
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
            default:
                break;
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