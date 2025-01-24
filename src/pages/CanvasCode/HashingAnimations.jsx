import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from "./AnimationTool";

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


export function Animation1() {
    const [step, setStep] = useState(1); // Initial step
    
    const handleStepChange = (newStep) => {
      setStep(newStep); // Update the step
    };
  
    const numSteps = 2;
  
    const canvasRef1 = useRef(null); // Reference to the canvas element

    // This hook updates the canvas based on the step dependencu
    // Dependency array may need to be updated
    useEffect(() => {
      const canvas = canvasRef1.current;
      const context = canvas.getContext('2d'); // Get the 2D context
      context.font = "14px Arial";

      const step1 = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.textAlign = "center";
        context.fillText("A hashing function is an algorithm used to convert an element to a hash value. ", canvas.width/2, 50, canvas.width-10);
        context.fillText("The hash value is used to index the element in the hash table.", canvas.width/2, 80, canvas.width-10);  
        context.fillText("Example: Hashing function h(k) = k % 5", canvas.width/2, 110, canvas.width-10);      

      }

      const step2 = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.textAlign = "center";
        context.fillText("Hash tables are a type of data structure that stores elements in key-value pairs.", canvas.width/2, 50, canvas.width-10);
        context.fillText("The key is used to index the value in the hash table.", canvas.width/2, 80, canvas.width-10);
        context.fillText("They are useful for their fast look-up times.", canvas.width/2, 110, canvas.width-10);

        context.font = "16px Arial";
        context.fillText("h(10) = 10 % 5 = 0", 100, 250, canvas.width-10);
        //draw an arrow from the text to the box with index 0
        drawArrow(context, 170, 245, 380, 160);
        context.fillText("h(3) = 3 % 5 = 3", 100, 280, canvas.width-10);
        //draw an arrow from the text to the box with index 0
        drawArrow(context, 165, 275, 380, 310);

        //draw a stack of 5 boxes on the right side of the canvas with an index number to the left of each box
        let x = 380;
        let y = 150;
        let boxWidth = 80;
        let boxHeight = 50;

        for (let i = 0; i < 5; i++) {
          context.strokeRect(x, y, boxWidth, boxHeight);
          context.fillText(i, x - 20, y + 30);
          if(i == 0 || i == 3) {
            context.fillText(i, x + 40, y + 30);
          }
          y += 50;
        }
      }

      switch(step) {
        case 1:
          step1();
          break;
        case 2:
          step2();
          break;
        default:
          break;
      }
    }, [step]);

    return (
      <>
        <h2>Step: {step}/{numSteps}</h2>
        <AnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange}></AnimationTool><br></br>
        <canvas ref={canvasRef1} width={500} height={500} style={{ border: '1px solid black' }}>
          Canvas not supported.
        </canvas>
        </>
    );
}