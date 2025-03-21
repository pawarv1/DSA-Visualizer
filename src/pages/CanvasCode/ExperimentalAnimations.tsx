import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from './AnimationTool';


export function Animation1() {
    
    const [step, setStep] = useState(0);    // useState hook is used to track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    const handleStepChange = (newStep: number) => {
        // Prevent the user from changing steps while an animation is running
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // Number of steps for this animation
    const numSteps = 3;
   
    const canvasRef1 = useRef<HTMLCanvasElement>(null);    // Reference to the canvas element    // Reference to the canvas element

    // This hook updates the canvas based on the step dependency
    useEffect(() => {
        const canvas1 = canvasRef1.current;
        if (canvas1) {
            const context1 = canvas1.getContext('2d');
            if (context1) {
                context1.clearRect(0, 0, canvas1.width, canvas1.height);
            }
        }

        // Step 1
        const step1 = () => {
            // const LINK = new LinkedListNode(50, 50, 80, 50, "Thomas");
            // LINK.drawNode(context1);
            setIsAnimating(false);
        }

        // Step 2
        const step2 = () => {
            // const LINK = new LinkedListNode(50, 50, 80, 50, "Thomas");
            // LINK.drawNode(context1, true);
            setIsAnimating(false);
        }

        // Step 3
        const step3 = () => {
            // const LINK = new LinkedListNode(50, 50, 80, 50, "Thomas");
            // LINK.drawNode(context1, false, true);
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