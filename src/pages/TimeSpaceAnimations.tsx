import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from './GeneralAnimating/AnimationTool';
import { Text } from './GeneralAnimating/GeneralAnimationGraphics';

// This component provides all the animations for time and space complexity
// It implements classes from AnimationGraphics and uses GSAP for smooth animations


// This animation serves as an introduction to time and space complexity
export function IntroductionAnimation() {

    const [step, setStep] = useState(0);                    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    // Step can only be changed if the animation is not running
    const handleStepChange = (newStep: number) => {
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 3 steps in this animation
    const numSteps = 3;
   
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update the canvas based on the step dependency
    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;

        // Ensure the main canvas is not null
        if (mainCanvas) { 
            const mainContext = mainCanvas.getContext('2d');

            // Ensure the main context is not null
            if (mainContext) {

                // Clear the canvas every before every step
                mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                // Step 1
                const step1 = () => {

                    // Text objects for step 1
                    const objects1 = [
                        new Text(0, 40, "How do we measure efficiency of an algorithm?", 1, "30px arial"),
                        new Text(0, 100, "The efficiency of an algorithm is measured based on:", 1, "24px Arial" ),
                        new Text(0, 160, "Time complexity: Measures the amount of time an algorithm takes to complete as a function of the input size, 𝑛"),
                        new Text(0, 220, "Space complexity: Measures the amount of memory required by the algorithm as a function of the input size, 𝑛")
                    ];
                    
                    objects1.forEach((obj) => {
                        obj.draw(mainContext);
                    });   

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 2
                const step2 = () => {

                    // Text objects for step 2
                    const objects2 = [
                        new Text(0, 40, "Introduction to time complexity", 1, "30px arial"),
                        new Text(0, 100, "To estimate the runtime of an algorithm we need to look at the number of basic operations it will perform based"),
                        new Text(0, 125, "on the size of our input. A basic operation is a simple action the algorithm performs such as adding or comparing"),
                        new Text(0, 150, "two variables. Other actions take more steps, such as looping through an array. The runtime can be modeled as"),
                        new Text(0, 175, "a function of the input size.", 1),
                        new Text (0, 230, "i == j takes one step"),
                        new Text (0, 250, "Looping through an array of size n will take n steps")
                    ];

                    objects2.forEach((obj) => {
                        obj.draw(mainContext);
                    });

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false)
                }

                // Step 3
                const step3 = () => {

                    // Text objects for step 3
                    const objects3 = [
                        new Text(0, 40, "Introduction to space complexity", 1, "30px arial"),
                        new Text(0, 100, "Space is also important to consider when writing a program as a computer's memory is finite, and should be"),
                        new Text(0, 125, "used efficiently. When we create a data structure, we need enough memory for the size of the data structure."),
                        new Text(0, 150, "Some data structures, such as linked lists and graphs may have additional overhead for their pointers.")
                    ];

                    objects3.forEach((obj) => {
                        obj.draw(mainContext);
                    });

                    // Set isAnimating to false when animation is complete
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
                    default:
                        break;
                }
            }
        }
    }, [step]);

    // This animation will have an animation number one, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={1} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}


// This animation explains Big O, Big 𝝮, and Big 𝚯
export function BigOAnimation() {

    const [step, setStep] = useState(0);                    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    // Step can only be changed if the animation is not running
    const handleStepChange = (newStep: number) => {
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 3 steps in this animation
    const numSteps = 3;
   
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update the canvas based on the step dependency
    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;
        
        // Ensure the main canvas is not null
        if (mainCanvas) { 
            const mainContext = mainCanvas.getContext('2d');

            // Ensure the main context is not null
            if (mainContext) {

                // Clear the canvas every before every step
                mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                // Step 1
                const step1 = () => {

                    // Text objects for step 1
                    const objects1 = [
                        new Text(0, 40, "Big O", 1, "40px arial"),
                        new Text(0, 120, "The runtime of an algorithm grows based on the size of the input. It can described using bounding functions."),
                        new Text(0, 145, "The upper bound of a runtime is a function, which will always be greater or equal to the runtime. We use big O"),
                        new Text(0, 170, "to model the upper bound of a runtime")
                    ];

                    objects1.forEach((obj) => {
                        obj.draw(mainContext);
                    });

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 2
                const step2 = () => {

                    // Text objects for step 2
                    const objects2 = [
                        new Text(0, 40, "Big 𝝮", 1, "40px arial"),
                        new Text(0, 120, "The runtime can also be described through its lower bound, which is a function which will always be less than or"),
                        new Text(0, 145, "equal to the runtime. We use big omega to model the lower bound of a runtime. This model is used less than big"),
                        new Text(0, 170, "O, but is still important for analysing algorithms")
                    ];

                    objects2.forEach((obj) => {
                        obj.draw(mainContext);
                    });

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 3
                const step3 = () => {

                    // Text objects for step 3
                    const objects3 = [
                        new Text(0, 40, "Big 𝚯", 1, "40px arial"),
                        new Text(0, 120, "When the upper bound and lower bound of a runtime are the same within a constant factor, than the runtime can"),
                        new Text(0, 145, "be modeled using big theta.")
                    ];

                    objects3.forEach((obj) => {
                        obj.draw(mainContext);
                    });

                    // Set isAnimating to false when animation is complete
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
                    default:
                        break;
                }
            }
        }
    }, [step]);

    // This animation will have an animation number two, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={2} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}


// This animation explains the best, worst and average cases of an algorithm
export function BestWorstAverageAnimation() {

    const [step, setStep] = useState(0);                    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    // Step can only be changed if the animation is not running
    const handleStepChange = (newStep: number) => {
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 5 steps in this animation
    const numSteps = 5;
   
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update the canvas based on the step dependency
    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;

        // Ensure the main canvas is not null
        if (mainCanvas) { 
            const mainContext = mainCanvas.getContext('2d');

            // Ensure the main context is not null
            if (mainContext) {

                // Clear the canvas every before every step
                mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                // Step 1
                const step1 = () => {

                    // Text objects for step 1
                    const objects1 = [
                        new Text(0, 40, "Worst Case, Best Case, and Average Case", 1, "30px arial"),
                        new Text(0, 120, "The worst case, best case and average case give an estimate for the behavior of a function for a specific input"),
                        new Text(0, 145, "size or scenario.")
                    ];

                    objects1.forEach((obj) => {
                        obj.draw(mainContext);
                    });   

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 2
                const step2 = () => {

                    // Text objects for step 2 
                    const text1 = new Text(0, 40, "Worst Case", 1, "40px arial");
                    const text2 = new Text(0, 120, "The worst case of an algorithm is the maximum number of steps the algorithm can take for a specific input size. ")
                    
                    text1.draw(mainContext);
                    text2.draw(mainContext);

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 3
                const step3 = () => {

                    // Text objects for step 3
                    const objects3 = [
                        new Text(0, 40, "Best Case", 1, "40px arial"),
                        new Text(0, 120, "The best case, on the other hand, is the minimum number of steps the algorithm can take for that same input"),
                        new Text(0, 145, "size.")
                    ];

                    objects3.forEach((obj) => {
                        obj.draw(mainContext);
                    });

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 4
                const step4 = () => {

                    // Text objects for step 4
                    const text1 = new Text(0, 40, "Average Case", 1, "40px arial");
                    const text2 = new Text(0, 120, "The average case is the number of steps the algorithm will usually take for that input size.");

                    text1.draw(mainContext);
                    text2.draw(mainContext);

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 5
                const step5 = () => {

                    // Text objects for step 5
                    const objects5 = [
                        new Text(0, 40, "Example", 1, "40px arial"),
                        new Text(0, 120, "Take linear searching on an array of size n. The best case is O(1), if the element we are searching for is in the" , 1),
                        new Text(0, 145, "first index of the array. The worst case is O(n), when we have to search the entire array. On average, it will take" , 1),
                        new Text(0, 170, "O(n/2), which we will later see is actually O(n)" , 1)
                    ];

                    objects5.forEach((obj) => {
                        obj.draw(mainContext);
                    });

                    // Set isAnimating to false when animation is complete
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
                    default:
                        break;
                }
            }
        }
    }, [step]);

    // This animation will have an animation number three, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={3} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}


// This animation explains the common mistakes regarding time and space complexity
export function CommonMistakesAnimation() {

    const [step, setStep] = useState(0);                    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    // Step can only be changed if the animation is not running
    const handleStepChange = (newStep: number) => {
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 2 steps in this animation
    const numSteps = 2;
   
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);

    // Update the canvas based on the step dependency
    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;

        // Ensure the main canvas is not null
        if (mainCanvas) { 
            const mainContext = mainCanvas.getContext('2d');

            // Ensure the main context is not null
            if (mainContext) {

                // Clear the canvas every before every step
                mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                // Step 1
                const step1 = () => {

                    // Text objects for step 1
                    const objects1 = [
                        new Text(0, 50, "It is easy to confuse big O, big omega and big theta with the worst, best and average cases of an algorithm."),
                        new Text(0, 75, "However, big O, big omega and big theta are the bounds on the runtime as it grows proportionally to the input"),
                        new Text(0, 100, "size. The worst, best and average case of an algorithm apply only  to a specific input or scenario.")
                    ];

                    objects1.forEach((obj) => {
                        obj.draw(mainContext)
                    });

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 2
                const step2 = () => {

                    // Text objects for step 2
                    const text1 = new Text(0, 50, "Another common misconception is believing that the best case of an algorithm is when its input size");
                    const text2 = new Text(0, 75, "is small. However, any sized is just an instance of the problem, and has its own best, worst and average cases.");

                    text1.draw(mainContext);
                    text2.draw(mainContext);

                    // Set isAnimating to false when animation is complete
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
                    default:
                        break;
                }
            }
        }
    }, [step]);

    // This animation will have an animation number four, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={4} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}


// This animation explains the rules to help simplify Big O
export function BigORules() {

    const [step, setStep] = useState(0);                    // Track the steps in the animation
    const [isAnimating, setIsAnimating] = useState(false);  // Track if an animation is running

    // Callback function to update the step modifications in AnimationTool
    // Step can only be changed if the animation is not running
    const handleStepChange = (newStep: number) => {
        if (!isAnimating) {
            setStep(newStep);
        }
    };

    // 5 steps in this animation
    const numSteps = 5;

    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
   
    // Update the canvas based on the step dependency
    useEffect(() => {
        const mainCanvas = mainCanvasRef.current;

        // Ensure the main canvas is not null
        if (mainCanvas) { 
            const mainContext = mainCanvas.getContext('2d');

            // Ensure the main context is not null
            if (mainContext) {

                // Clear the canvas every before every step
                mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                // Step 1
                const step1 = () => {

                    // Text objects for step 1
                    const objects1 = [
                        new Text(0, 50, "There are some rules to simplify big O which are as follows:", 1, "25px Arial"),
                        new Text(0, 110, "1. If f(n) is in O(g(n)) and g(n) is in O(h(n)), then f(n) is in O(h(n))."),
                        new Text(0, 150, "2. If f(n) is in O(kg(n)) for any constant k>0, then f(n) is in O(g(n))."),
                        new Text(0, 190, "3. If f1(n) is in O(g1(n)) and f2(n) is in O(g2(n)), then f1(n) + f2(n) is inO(max(g1(n),g2(n)))."),
                        new Text(0, 230, "4. If f1(n) is in O(g1(n)) and f2(n) is in O(g2(n)), then f1(n)f2(n) is inO(g1(n)g2(n)).")
                    ];

                    objects1.forEach((obj) => {
                        obj.draw(mainContext);
                    });   

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 2
                const step2 = () => {

                    // Text objects for step 2
                    const objects2 = [
                        new Text(0, 40, "Rule 1 Explanation", 1, "40px arial"),
                        new Text(0, 100, "If g is the upper bound of f, and h is the upper bound of g, then h would also be an upper bound of f, as it would"),
                        new Text(0, 140, "always be greater or equal to f."),
                        new Text(0, 180, "Ex: If f(n) = 2n + 1 is O(n), and g(n) = 3n is O(n), then f(n) is also O(g(n)) because both are linearly bounded.")
                    ];

                    objects2.forEach((obj) => {
                        obj.draw(mainContext);
                    });

                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 3
                const step3 = () => {

                    // Text objects for step 3
                    const objects3 = [
                        new Text(0, 40, "Rule 2 Explanation", 1, "40px arial"),
                        new Text(0, 100, "Leading coefficients become negligible as input size becomes large"),
                        new Text(0, 140, "Ex: f(n) = 5n"),
                        new Text(0, 180, "While the line for f(n) is steeper than O(n), both functions grow linearly and only differ by a constant factor of 5."),
                        new Text(0, 200, "As n increases, it will have a much larger effect compared to the constant. For this reason, f is still bounded by"),
                        new Text(0, 220, "O(n)")
                    ];

                    objects3.forEach((obj) => {
                        obj.draw(mainContext);
                    });
                
                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 4
                const step4 = () => {

                    // Text objects for step 4
                    const objects4 = [
                        new Text(0, 40, "Rule 3 Explanation", 1, "40px arial"),
                        new Text(0, 100, "When adding or subtracting O functions, the O with the highest dominance will dominate the others,"),
                        new Text(0, 120, "making them negligible in runtime analysis."),
                        new Text(0, 160, "Ex: f(n) = n² and g(n) = n. f(n) + g(n) = n² + n is still O(n²) because n² dominates n.")
                    ];

                    objects4.forEach((obj) => {
                        obj.draw(mainContext);
                    });
                
                    // Set isAnimating to false when animation is complete
                    setIsAnimating(false);
                }

                // Step 5
                const step5 = () => {

                    // Graphic objects for step 5
                    const text1 = new Text(0, 40, "Rule 4 Explanation", 1, "40px arial");
                    const text2 = new Text(0, 100, "When an algorithm completes some steps multiple times, i.e. looping, the runtimes are multiplied together.");

                    text1.draw(mainContext);
                    text2.draw(mainContext);

                    // Set isAnimating to false when animation is complete
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
                    default:
                        break;
                }
            }
        }
    }, [step]);

    // This animation will have an animation number five, and it will be unique to prevent conflicts with other animations
    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={5} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={mainCanvasRef} width={800} height={600} style={{ border: '1px solid black' }}>Canvas</canvas>
        </div>
    );
}