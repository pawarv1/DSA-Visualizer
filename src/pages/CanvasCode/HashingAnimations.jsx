import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from './OutdatedAnimationTool';

/*
This component handles all the canvas logic needed for the various hashing animations
Team will work on the animations as specified in last meeting
*/

export function Animation3() {
    const [step, setStep] = useState(1); // Initial step
    
    const handleStepChange = (newStep) => {
      setStep(newStep); // Update the step
    };
  
    const numSteps = 3;

    const canvasRef3 = useRef(null); // Reference to the canvas element

    useEffect(() => {
        const canvas = canvasRef3.current;
        const context = canvas.getContext('2d'); // Get the 2D context

        // function to draw arrows to represent pointers
        function drawArrow(ctx, fromX, fromY, toX, toY, headLength = 10) {
          const angle = Math.atan2(toY - fromY, toX - fromX);
    
          // Draw the line
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
    
          // Draw the arrowhead
          ctx.beginPath();
          ctx.moveTo(toX, toY);
          ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.lineTo(toX, toY);
          ctx.closePath();
          ctx.fill();
        }

        // Logic for the first step of the animation
        const step1 = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };

        /* Hashing Animation 3, Step 2: Collisons - Jacob */
        const step2 = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // The start of the figure
            let x = 250;  // These coords can be used to control the figure
            let y = 50;   // initial: x = 250; y = 50

            context.fillStyle = 'black';
            context.font = "14px Arial";
            context.textAlign = "center";
            context.fillText("Hashing Collisions", x, y); // Step title
            // Draw underline for step title
            context.strokeStyle = 'black'; 
            context.beginPath();
            context.moveTo(x - 75, y + 5);
            context.lineTo(x + 75, y + 5);
            context.stroke();

            context.fillText("When passed through the hash function, \"John\" and \"Tim\"",
                x, y + 50);
            context.fillText("[note: example keys for now] map to the same index,",
                x, y + 70);
            context.fillText("so data may be unintentionally overwritten and lost.",
                x, y + 90);
            
            context.fillText("h(John) and h(Tim) both equal 3",
                x, y + 440);

            // Write the names that will be mapped by hash function
            context.fillText("Alex", x - 200, y + 200);
            context.fillText("John", x - 200, y + 300);
            context.fillText("Tim", x - 200, y + 400);

            // Draw the box that serves as the visual for the hash function
            context.fillStyle = "grey";
            context.fillRect(x - 100, y + 120, 100, 300);
            context.fillStyle = "white";
            context.fillText("Hash Function", x - 50, y + 150);

            // Draw the boxes that will serve as the array/memory
            for (let i = 0; i < 5; ++i) {
                context.strokeRect(x + 100, y + 120, 100, 60);
                context.font = "14px Arial";
                context.textAlign = "center";
                context.fillStyle = "black";
                context.fillText(i, x + 75, y + 155);

                // Write "???" in index 3 to convey that a memory overwrite error may occur
                if (i == 3) {
                    context.font = "24px Arial";
                    context.fillStyle = "red";
                    context.fillText("???", x + 150, y + 160);
                }
                y += 60;
            }

            // Draw the arrows from the names through the hash function to the mapped index in the array/memory
            // Alex -> 1
            drawArrow(context, x - 180, y - 105, x + 100, y - 100);

            // John -> 3
            drawArrow(context, x - 180, y - 5, x + 100, y + 20);
            
            // Tim -> 3
            drawArrow(context, x - 180, y + 95, x + 100, y + 35);
        };

        /* Step 3 */
        const step3 = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };

        // Switch statement which runs the associated step method for the given step
      switch(step) {
        case 1:
          step1();
          break;
        case 2:
          step2();
          break;
        case 3:
          step3();
          break;
      };
    }, [step]);
  
    return (
      <>
        <h2>Step: {step}/{numSteps}</h2>
        <AnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange}></AnimationTool><br></br>
        <canvas ref={canvasRef3} width={500} height={500} style={{ border: '1px solid black' }}>
          Canvas not supported.
        </canvas>
        </>
    );
}