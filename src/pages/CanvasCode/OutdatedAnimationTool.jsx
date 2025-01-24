/* 
This animation tool is outdated, and will be replaced with the new animation tool componenet
*/


function OutdatedAnimationTool( { currStep, numSteps, updateStep}) {
    
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

    return (
        <>
        <button id = "firstStepButton" onClick={firstStep}>&lt;&lt;</button>
        <button id = "previousButton" onClick={prevStep}>Previous</button>
        <button id = "nextButton" onClick={nextStep}>Next</button>
        <button id = "lastStepButton" onClick={lastStep}>&gt;&gt;</button>
        </>
    );
}

export default OutdatedAnimationTool;