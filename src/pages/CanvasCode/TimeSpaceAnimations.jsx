import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from './AnimationTool';
import { Text } from './AnimationGraphics/GeneralAnimationGraphics';
import gsap from 'gsap';

/*
    This component provides all the animations for time and space complexity
    It implements classes from AnimationGraphics and uses GSAP for smooth animations
*/

// Need to update the code to factor in the clearing

// This animation, which serves as an introduction to time and space complexity
export function IntroductionAnimation() {
    
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

            // Graphic objects for step 1
            const objects1 = [
                new Text(0, 20, "How do we measure efficiency of an algorithm?", 0, "30px arial"),
                new Text(0, 90, "The efficiency of an algorithm is measured based on:", 0, "24px Arial" ),
                new Text(0, 160, "Time complexity: Measures the amount of time an algorithm takes to complete as a function of the input size, 𝑛", 0),
                new Text(0, 220, "Space complexity: Measures the amount of memory required by the algorithm as a function of the input size, 𝑛", 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects1.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context1),
                    onComplete: () => setIsAnimating(false)
                })
            });   
        }

        // Step 2
        const step2 = () => {

            // Graphic objects for step 2
            const objects2 = [
                new Text(0, 20, "Introduction to time complexity", 0, "30px arial"),
                new Text(0, 90, "To estimate the runtime of an algorithm we need to look at the number of basic operations it will perform based", 0),
                new Text(0, 115, "on the size of our input. A basic operation is a simple action the algorithm performs such as adding or comparing", 0),
                new Text(0, 140, "two variables. Other actions take more steps, such as looping through an array. The runtime can be modeled as", 0),
                new Text(0, 165, "a function of the input size.", 0),
                new Text (0, 220, "i == j takes one step", 0),
                new Text (0, 280, "Looping through an array of size n will take n steps", 0)
            ];


            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects2.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context1),
                    onComplete: () => setIsAnimating(false)
                })
            });
        }

        // Step 3
        const step3 = () => {

            // Graphic objects for step 3
            const objects3 = [
                new Text(0, 20, "Introduction to space complexity", 0, "30px arial"),
                new Text(0, 90, "Space is also important to consider when writing a program as a computer's memory is finite, and should be", 0),
                new Text(0, 115, "used efficiently. When we create a data structure, we need enough memory for the size of the data structure.", 0),
                new Text(0, 140, "Some data structures, such as linked lists and graphs may have additional overhead for their pointers.", 0)
            ];


            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects3.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context1),
                    onComplete: () => setIsAnimating(false)
                })
            });
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
            <canvas ref={canvasRef1} width={800} height={600} style={{ border: '1px solid black' }}>
                Canvas not supported.
            </canvas>
        </div>
    );
}


// This animation explains Big O, Big 𝝮, and Big 𝚯
export function BigOAnimation() {

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
   
    const canvasRef2 = useRef(null);    // Reference to the canvas element

    // This hook updates the canvas based on the step dependency
    useEffect(() => {
        const canvas2 = canvasRef2.current;
        const context2 = canvas2.getContext('2d');
        context2.clearRect(0, 0, canvas2.width, canvas2.height);

        // Step 1
        const step1 = () => {

            // Graphic objects for step 1
            const objects1 = [
                new Text(0, 20, "Big O", 0, "40px arial"),
                new Text(0, 120, "The runtime of an algorithm grows based on the size of the input. It can described using bounding functions." , 0),
                new Text(0, 145, "The upper bound of a runtime is a function, which will always be greater or equal to the runtime. We use big O", 0),
                new Text(0, 170, "to model the upper bound of a runtime", 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects1.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context2),
                    onComplete: () => setIsAnimating(false)
                })
            });   
        }

        // Step 2
        const step2 = () => {

            // Graphic objects for step 2
            const objects2 = [
                new Text(0, 20, "Big 𝝮", 0, "40px arial"),
                new Text(0, 120, "The runtime can also be described through its lower bound, which is a function which will always be less than or" , 0),
                new Text(0, 145, "equal to the runtime. We use big omega to model the lower bound of a runtime. This model is used less than big", 0),
                new Text(0, 170, "O, but is still important for analysing algorithms", 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects2.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context2),
                    onComplete: () => setIsAnimating(false)
                })
            });
        }

        // Step 3
        const step3 = () => {

            // Graphic objects for step 3
            const objects3 = [
                new Text(0, 20, "Big 𝚯", 0, "40px arial"),
                new Text(0, 120, "When the upper bound and lower bound of a runtime are the same within a constant factor, than the runtime can" , 0),
                new Text(0, 145, "be modeled using big theta.", 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects3.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context2),
                    onComplete: () => setIsAnimating(false)
                })
            });
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
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={2} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={canvasRef2} width={800} height={600} style={{ border: '1px solid black' }}>
                Canvas not supported.
            </canvas>
        </div>
    );
}


// This animation explains the best, worst and average cases of an algorithm
export function BestWorstAverageAnimation() {

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
    const numSteps = 5;
   
    const canvasRef3 = useRef(null);    // Reference to the canvas element

    // This hook updates the canvas based on the step dependency
    useEffect(() => {
        const canvas3 = canvasRef3.current;
        const context3 = canvas3.getContext('2d');
        context3.clearRect(0, 0, canvas3.width, canvas3.height);

       // Step 1
        const step1 = () => {

             // Graphic objects for step 1
            const objects1 = [
                new Text(0, 20, "Worst Case, Best Case, and Average Case", 0, "30px arial"),
                new Text(0, 120, "The worst case, best case and average case give an estimate for the behavior of a function for a specific input" , 0),
                new Text(0, 145, "size or scenario.", 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects1.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context3),
                    onComplete: () => setIsAnimating(false)
                })
            });   
        }

        // Step 2
        const step2 = () => {

            // Graphic objects for step 2 
            const objects2 = [
                new Text(0, 20, "Worst Case", 0, "40px arial"),
                new Text(0, 120, "The worst case of an algorithm is the maximum number of steps the algorithm can take for a specific input size. " , 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects2.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context3),
                    onComplete: () => setIsAnimating(false)
                })
            });
        }

        // Step 3
        const step3 = () => {

            // Graphic objects for step 3
            const objects3 = [
                new Text(0, 20, "Best Case", 0, "40px arial"),
                new Text(0, 120, "The best case, on the other hand, is the minimum number of steps the algorithm can take for that same input" , 0),
                new Text(0, 145, "size.", 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects3.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context3),
                    onComplete: () => setIsAnimating(false)
                })
            });
        }

        // Step 4
        const step4 = () => {

            // Graphic objects for step 4
            const objects4 = [
                new Text(0, 20, "Average Case", 0, "40px arial"),
                new Text(0, 120, "The average case is the number of steps the algorithm will usually take for that input size." , 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects4.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context3),
                    onComplete: () => setIsAnimating(false)
                })
            });
        }

        // Step 5
        const step5 = () => {

            // Graphic objects for step 5
            const objects5 = [
                new Text(0, 20, "Example", 0, "40px arial"),
                new Text(0, 120, "Take linear searching on an array of size n. The best case is O(1), if the element we are searching for is in the" , 0),
                new Text(0, 145, "first index of the array. The worst case is O(n), when we have to search the entire array. On average, it will take" , 0),
                new Text(0, 170, "O(n/2), which we will later see is actually O(n)" , 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects5.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context3),
                    onComplete: () => setIsAnimating(false)
                })
            });
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
    }, [step]);

    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={3} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={canvasRef3} width={800} height={600} style={{ border: '1px solid black' }}>
                Canvas not supported.
            </canvas>
        </div>
    );
}


// This animation explains the common mistakes regarding time and space complexity
export function CommonMistakesAnimation() {

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
    const numSteps = 2;
   
    const canvasRef4 = useRef(null);    // Reference to the canvas element

    // This hook updates the canvas based on the step dependency
    useEffect(() => {
        const canvas4 = canvasRef4.current;
        const context4 = canvas4.getContext('2d');
        context4.clearRect(0, 0, canvas4.width, canvas4.height);

        // Step 1
        const step1 = () => {

             // Graphic objects for step 1
            const objects1 = [
                new Text(0, 50, "It is easy to confuse big O, big omega and big theta with the worst, best and average cases of an algorithm.", 0),
                new Text(0, 75, "However, big O, big omega and big theta are the bounds on the runtime as it grows proportionally to the input" , 0),
                new Text(0, 100, "size. The worst, best and average case of an algorithm apply only  to a specific input or scenario.", 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects1.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context4),
                    onComplete: () => setIsAnimating(false)
                })
            });   
        }

        // Step 2
        const step2 = () => {

            // Graphic objects for step 2
            const objects2 = [
                new Text(0, 50, "Another common misconception is believing that the best case of an algorithm is when its input size", 0),
                new Text(0, 75, "is small. However, any sized is just an instance of the problem, and has its own best, worst and average cases." , 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects2.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context4),
                    onComplete: () => setIsAnimating(false)
                })
            });
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
            default:
                break;
        }
    }, [step]);

    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={4} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={canvasRef4} width={800} height={600} style={{ border: '1px solid black' }}>
                Canvas not supported.
            </canvas>
        </div>
    );
}


// This animation explains the rules to help simplify Big O
export function BigORules() {

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
    const numSteps = 5;
   
    const canvasRef5 = useRef(null);    // Reference to the canvas element

    // This hook updates the canvas based on the step dependency
    useEffect(() => {
        const canvas5 = canvasRef5.current;
        const context5 = canvas5.getContext('2d');
        context5.clearRect(0, 0, canvas5.width, canvas5.height);

        // Step 1
        const step1 = () => {

             // Graphic objects for step 1
            const objects1 = [
                new Text(0, 50, "There are some rules to simplify big O which are as follows:", 0, "25px Arial"),
                new Text(0, 110, "1. If f(n) is in O(g(n)) and g(n) is in O(h(n)), then f(n) is in O(h(n))." , 0),
                new Text(0, 150, "2. If f(n) is in O(kg(n)) for any constant k>0, then f(n) is in O(g(n))." , 0),
                new Text(0, 190, "3. If f1(n) is in O(g1(n)) and f2(n) is in O(g2(n)), then f1(n) + f2(n) is inO(max(g1(n),g2(n)))." , 0),
                new Text(0, 230, "4. If f1(n) is in O(g1(n)) and f2(n) is in O(g2(n)), then f1(n)f2(n) is inO(g1(n)g2(n))." , 0)
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            objects1.forEach((obj) => {
                gsap.to(obj, {
                    duration: 1,
                    opacity : 1,
                    onUpdate: () => obj.draw(context5),
                    onComplete: () => setIsAnimating(false)
                })
            });   
        }

        // Step 2
        const step2 = () => {

            // Graphic objects for step 2
            const objects2 = [
                new Text(0, 20, "Rule 1 Explanation", 0, "40px arial"),
                new Text(0, 100, "If g is the upper bound of f, and h is the upper bound of g, then h would also be an upper bound of f, as it would", 0),
                new Text(0, 120, "always be greater or equal to f." , 0),
                new Text(0, 160, "Ex: If f(n) = 2n + 1 is O(n), and g(n) = 3n is O(n), then f(n) is also O(g(n)) because both are linearly bounded." , 0)
            ];

            let timeline = gsap.timeline();

            timeline.to([objects2[0], objects2[1], objects2[2]], {
                duration: 1,
                opacity: 1,
                onUpdate: () => {
                    objects2[0].draw(context5);
                    objects2[1].draw(context5);
                    objects2[2].draw(context5);
                }
            });

            timeline.to(objects2[3], {
                duration: 1,
                opacity: 1,
                onUpdate: () => objects2[3].draw(context5),
                onComplete: () => setIsAnimating(false)
            });
        }

        // Step 3
        const step3 = () => {

            // Graphic objects for step 3
            const objects3 = [
                new Text(0, 20, "Rule 2 Explanation", 0, "40px arial"),
                new Text(0, 100, "Leading coefficients become negligible as input size becomes large", 0),
                new Text(0, 140, "Ex: f(n) = 5n" , 0),
                new Text(0, 180, "While the line for f(n) is steeper than O(n), both functions grow linearly and only differ by a constant factor of 5." , 0),
                new Text(0, 200, "As n increases, it will have a much larger effect compared to the constant. For this reason, f is still bounded by" , 0),
                new Text(0, 220, "O(n)" , 0)
            ];
           
            // GSAP timeline is used to order which graphics are drawn first
            let timeline = gsap.timeline();

            // Draw the first two text objects
            timeline.to([objects3[0], objects3[1]], {
                duration: 1,
                opacity: 1,
                onUpdate: () => {
                    objects3[0].draw(context5);
                    objects3[1].draw(context5);
                }
            });

            // Draw the third text object
            timeline.to(objects3[2], {
                duration: 1,
                opacity: 1,
                onUpdate: () => objects3[2].draw(context5)
            });

            // Draw the fourth, fifth and sixth text objects
            // When the animation is finished isAnimating is set to false
            timeline.to([objects3[3], objects3[4], objects3[5]], {
                duration: 1,
                opacity: 1,
                onUpdate: () => {
                    objects3[3].draw(context5);
                    objects3[4].draw(context5);
                    objects3[5].draw(context5);
                },
                onComplete: () => setIsAnimating(false)
            });
        }

        // Step 4
        const step4 = () => {

            // Graphic objects for step 4
            const objects4 = [
                new Text(0, 20, "Rule 3 Explanation", 0, "40px arial"),
                new Text(0, 100, "When adding or subtracting O functions, the O with the highest dominance will dominate the others,", 0),
                new Text(0, 120, "making them negligible in runtime analysis." , 0),
                new Text(0, 160, "Ex: f(n) = n² and g(n) = n. f(n) + g(n) = n² + n is still O(n²) because n² dominates n." , 0)
            ];

            // GSAP timeline is used to order which graphics are drawn first
            let timeline = gsap.timeline();

            // Draw the first three text objects
            timeline.to([objects4[0], objects4[1], objects4[2]], {
                duration: 1,
                opacity: 1,
                onUpdate: () => {
                    objects4[0].draw(context5);
                    objects4[1].draw(context5);
                    objects4[2].draw(context5);
                }
            });

            // Draw the fourth text object
            // When the animation is finished isAnimating is set to false
            timeline.to(objects4[3], {
                duration: 1,
                opacity: 1,
                onUpdate: () => objects4[3].draw(context5),
                onComplete: () => setIsAnimating(false)
            });
        }

        // Step 5
        const step5 = () => {

            // Graphic objects for step 5
            const objects5 = [
                new Text(0, 20, "Rule 4 Explanation", 0, "40px arial"),
                new Text(0, 100, "When an algorithm completes some steps multiple times, i.e. looping, the runtimes are multiplied together.", 0),
            ];

            // GSAP tween is used to fade in all the graphics smoothly
            // For each update the object is drawn with a brighter opacity
            // When the animation is finished isAnimating is set to false
            gsap.to([objects5[0], objects5[1]], {
                duration: 1,
                opacity: 1,
                onUpdate: () => {
                    objects5[0].draw(context5);
                    objects5[1].draw(context5);
                },
                onComplete: () => setIsAnimating(false)
            });
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
    }, [step]);

    return (
        <div>
            <AnimationTool currStep={step} numSteps={numSteps} updateStep={handleStepChange} animationNum={5} isAnimating={isAnimating}></AnimationTool>
            <br></br>
            <canvas ref={canvasRef5} width={800} height={600} style={{ border: '1px solid black' }}>
                Canvas not supported.
            </canvas>
        </div>
    );
}