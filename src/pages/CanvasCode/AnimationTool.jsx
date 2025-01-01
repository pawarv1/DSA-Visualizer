
function AnimationTool( { currStep, numSteps, updateStep}) {
    
    const firstStep = () => {
        updateStep(1);
    }

    const lastStep = () => {
        updateStep(numSteps);
    }

    const nextStep = () => {
        if (currStep < numSteps) {
            let nextStep = currStep + 1;
            updateStep(nextStep);
        }
    }

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

export default AnimationTool;