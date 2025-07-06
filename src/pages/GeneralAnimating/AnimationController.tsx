import React, { useRef, useState } from 'react';

/* 
This animation tool handles logic and html elements for progressing through animations
It will be used or all of the animations, at least the ones with predefined number of steps
*/

// useUniqueId will help avoid the overlapping animation errors better than passing in different animation numbers
let idCounter = 0;

function useUniqueId(prefix = 'animation'): string {
    const idRef = useRef<string>();
    if (!idRef.current) {
        idRef.current = `${prefix}-${++idCounter}`;
    }
    return idRef.current;
}

interface AnimationToolsProps {
    currStep: number;
    numSteps: number;
    updateStep: (newStep: number) => void;
    animationNum?: string | number;
    isAnimating: boolean;
}

const AnimationController: React.FC<AnimationToolsProps> = ( { currStep, numSteps, updateStep, isAnimating }) => {
    
    const uniqueId = useUniqueId();
    const animId = uniqueId;
    const [started, setStarted] = useState(false); // Track if the animation has started

    // Animations will only play after start button is selected
    // When start button is clicked is disappears and is replaced with the navigation buttons and step count
    const startAnimation = () => {
        const button = document.getElementById("start" + animId);
        if (button) {
            button.hidden = true;
        }

        updateStep(1);
        
        let header = document.getElementById("stepCounter" + animId);
        if (header) {
            header.hidden = false;
        }
    
        // Reveal navigation buttons after the start button is clicked
        setStarted(true);
    }
    
    // go to the very first step
    const firstStep = () => {
        updateStep(1);
    }

    // go to the very last step
    const lastStep = () => {
        updateStep(numSteps);
    }

    // go to the next step
    const nextStep = () => {
        if (currStep < numSteps) {
            let nextStep = currStep + 1;
            updateStep(nextStep);
        }
    }

    // go to the previous step
    const prevStep = () => {
        if (currStep > 1) {
            let prevStep = currStep - 1;
            updateStep(prevStep);
        }
    }

    // Navigation arrows will only appear after start is pressed, and when no animations are running, to prevent multiple from running at the same time
    // A number for each animation is given to its html elements id, so they are unique to that animation
    return (
        <>
            <h2 id={"stepCounter" + animId} hidden={true}>Step: {currStep}/{numSteps}</h2>
            <button id = {"start" + animId} onClick={startAnimation}>Start</button>
            
            {started && !isAnimating && (
                <>
                    <button id = {"firstStepButton" + animId} onClick={firstStep} hidden = {isAnimating}>&lt;&lt;</button>
                    <button id = {"previousButton" + animId} onClick={prevStep} hidden={isAnimating}>Previous</button>
                    <button id = {"nextButton" + animId} onClick={nextStep} hidden={isAnimating}>Next</button>
                    <button id = {"lastStepButton" + animId} onClick={lastStep} hidden={isAnimating}>&gt;&gt;</button>
                </>
            )}
        </>
    );
}

export default AnimationController;