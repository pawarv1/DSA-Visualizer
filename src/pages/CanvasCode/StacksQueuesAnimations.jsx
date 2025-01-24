/* This component handles all the canvas logic needed for the various Stacks & Queues animations */

import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from './OutdatedAnimationTool';

export function Animation2() {
    const [step, setStep] = useState(1); // Initial step
    
    const handleStepChange = (newStep) => {
      setStep(newStep); // Update the step
    };
  
    const numSteps = 4;

    const canvasRef2 = useRef(null); // Reference to the canvas element

    useEffect(() => {
        const canvas = canvasRef2.current;
        const context = canvas.getContext('2d'); // Get the 2D context

        // Function to draw arrows to represent pointers
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

            // The start of the figure
            let x = 250;  // These coords can be used to control the figure
            let y = 40;   // initial: x = 250; y = 40

            context.fillStyle = 'black';
            context.font = "16px Arial";
            context.textAlign = "center";
            context.fillText("Queues", x, y); // Step title
            // Draw underline for step title
            context.strokeStyle = 'black'; 
            context.beginPath();
            context.moveTo(x - 40, y + 5);
            context.lineTo(x + 40, y + 5);
            context.stroke();

            context.font = "14px Arial";
            context.fillText("A queue can be visualized as a group of people waiting in a single-file line.", x, y + 40);
            context.fillText("A queue may be implemented using an array or a linked list, for example.", x, y + 60);
            context.fillText("(Front of line)", x - 185, y + 325);
            context.fillText("(Back of line)", x + 175, y + 325);

            // Draw head pointer
            context.fillText("Head", x - 150, y + 170);
            drawArrow(context, x - 150, y + 180, x - 150, y + 210);

            // Draw tail pointer
            context.fillText("Tail", x + 60, y + 170);
            drawArrow(context, x + 60, y + 180, x + 60, y + 210);

            const elements = [
                "Varun", "Sam", "Stenneth", "Hugo"
            ];
      
            // draw the queue boxes: [ Varun | Sam | Stenneth | Hugo ]
            for (let i = 0; i < 4; i++) {
                context.strokeStyle = "black";
                context.strokeRect(x - 185, y + 210, 70, 50);
                context.font = "12px Arial";
                context.textAlign = "center";
                context.fillText(elements[i], x - 150, y + 235);
                x += 70;
            }
        };

        /* Hashing Animation 3, Step 2: Collisons - Jacob */
        const step2 = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // The start of the figure
            let x = 250;  // These coords can be used to control the figure
            let y = 40;   // initial: x = 250; y = 40

            context.fillStyle = 'black';
            context.font = "16px Arial";
            context.textAlign = "center";
            context.fillText("Queues: Enqueue Function", x, y); // Step title
            // Draw underline for step title
            context.strokeStyle = 'black'; 
            context.beginPath();
            context.moveTo(x - 120, y + 5);
            context.lineTo(x + 120, y + 5);
            context.stroke();

            context.font = "14px Arial";
            context.fillText("The enqueue function can be visualized as", x, y + 40);
            context.fillText("someone joining at the end of the line or queue.", x, y + 60);
            context.fillText("The tail pointer or index must be updated to point to the last person in the queue.", x, y + 80);
            context.font = "14px Courier";
            context.fillText("queue.enqueue(Bryan)", x, y + 120);
            
            context.font = "14px Arial";
            context.fillText("(Front of line)", x - 185, y + 325);
            context.fillText("(Back of line)", x + 175, y + 325);

            // Draw head pointer
            context.fillText("Head", x - 150, y + 170);
            drawArrow(context, x - 150, y + 180, x - 150, y + 210);

            // Draw tail pointer
            context.fillText("Tail", x + 130, y + 170);
            drawArrow(context, x + 130, y + 180, x + 130, y + 210);

            const elements = [
                "Varun", "Sam", "Stenneth", "Hugo", "Bryan"
            ];
      
            // draw the queue boxes: [ Varun | Sam | Stenneth | Hugo ]
            for (let i = 0; i < 5; i++) {
                context.strokeStyle = "black";
                context.strokeRect(x - 185, y + 210, 70, 50);
                context.font = "12px Arial";
                context.textAlign = "center";
                context.fillText(elements[i], x - 150, y + 235);
                x += 70;
            }
        };

        /* Step 3 */
        const step3 = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // The start of the figure
            let x = 250;  // These coords can be used to control the figure
            let y = 40;   // initial: x = 250; y = 40

            context.fillStyle = 'black';
            context.font = "16px Arial";
            context.textAlign = "center";
            context.fillText("Queues: Dequeue Function", x, y); // Step title
            // Draw underline for step title
            context.strokeStyle = 'black'; 
            context.beginPath();
            context.moveTo(x - 120, y + 5);
            context.lineTo(x + 120, y + 5);
            context.stroke();

            context.font = "14px Arial";
            context.fillText("The dequeue function can be visualized as when the first person waiting in line", x, y + 40);
            context.fillText(" exits the queue. This is why it is called FIFO (first in, first out) order.", x, y + 60);
            context.fillText("The head pointer or index must be updated", x, y + 80);
            context.fillText("to point to the new head element in the queue.", x, y + 100);
            context.fillText("(Click the next button to see the dequeue function in action)", x, y + 400);
            
            context.fillText("(Front of line)", x - 185, y + 325);
            context.fillText("(Back of line)", x + 175, y + 325);

            // Draw head pointer
            context.fillText("Head", x - 150, y + 170);
            drawArrow(context, x - 150, y + 180, x - 150, y + 210);

            // Draw tail pointer
            context.fillText("Tail", x + 130, y + 170);
            drawArrow(context, x + 130, y + 180, x + 130, y + 210);

            const elements = [
                "Varun", "Sam", "Stenneth", "Hugo", "Bryan"
            ];
      
            // draw the queue boxes: [ Varun | Sam | Stenneth | Hugo ]
            for (let i = 0; i < 5; i++) {
                context.strokeStyle = "black";
                context.strokeRect(x - 185, y + 210, 70, 50);
                context.font = "12px Arial";
                context.textAlign = "center";
                context.fillText(elements[i], x - 150, y + 235);
                x += 70;
            }
        };

        /* Step 4 */
        const step4 = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // The start of the figure
            let x = 250;  // These coords can be used to control the figure
            let y = 40;   // initial: x = 250; y = 40

            context.fillStyle = 'black';
            context.font = "16px Arial";
            context.textAlign = "center";
            context.fillText("Queues: Dequeue Function", x, y); // Step title
            // Draw underline for step title
            context.strokeStyle = 'black'; 
            context.beginPath();
            context.moveTo(x - 120, y + 5);
            context.lineTo(x + 120, y + 5);
            context.stroke();

            context.font = "14px Arial";
            context.fillText("The dequeue function can be visualized as when the first person waiting in line", x, y + 40);
            context.fillText(" exits the queue. This is why it is called FIFO (first in, first out) order.", x, y + 60);
            context.fillText("The head pointer or index must be updated", x, y + 80);
            context.fillText("to point to the new head element in the queue.", x, y + 100);
            context.font = "14px Courier";
            context.fillText("queue.dequeue()", x, y + 140);
            
            context.font = "14px Arial";
            context.fillText("(Front of line)", x - 185, y + 325);
            context.fillText("(Back of line)", x + 175, y + 325);

            // Draw head pointer
            context.fillText("Head", x - 80, y + 170);
            drawArrow(context, x - 80, y + 180, x - 80, y + 210);

            // Draw tail pointer
            context.fillText("Tail", x + 130, y + 170);
            drawArrow(context, x + 130, y + 180, x + 130, y + 210);

            const elements = [
                "Sam", "Stenneth", "Hugo", "Bryan"
            ];
      
            // draw the queue boxes: [ Varun | Sam | Stenneth | Hugo ]
            for (let i = 0; i < 4; i++) {
                context.strokeStyle = "black";
                context.strokeRect(x - 115, y + 210, 70, 50);
                context.font = "12px Arial";
                context.textAlign = "center";
                context.fillText(elements[i], x - 80, y + 235);
                x += 70;
            }
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
        case 4:
          step4();
          break;
      };
    }, [step]);
  
    return (
      <>
        <h2>Step: {step}/{numSteps}</h2>
        <AnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange}></AnimationTool><br></br>
        <canvas ref={canvasRef2} width={500} height={500} style={{ border: '1px solid black' }}>
          Canvas not supported.
        </canvas>
        </>
    );
}