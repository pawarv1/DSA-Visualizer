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
        context.fillText("The stack data structure can be visualized like a stack of books.", canvas.width/2, 50, canvas.width-10);
        context.fillText("You can add or take away a book from the top of the stack only. This is LIFO order.", canvas.width/2, 80, canvas.width-10);  

        //draw a stack of 4 boxes on the left side of the canvas with book titles in the middle.
        let x = 50;
        let y = 150;
        let boxWidth = 130;
        let boxHeight = 50;
        let bookTitles = ["Atlas Shrugged", "The Road", "Hamlet", "Crime & Punishment"];
        for(let i = 0; i < 4; i++) {
          context.strokeRect(x, y, boxWidth, boxHeight);
          context.fillText(bookTitles[i], x + 70, y + 30);
          y += 50;
        }

        //draw a stack of 3 boxes on the right side of the screen the same book titles in the middle.
        x = 320;
        y = 200;
        for(let i = 0; i < 3; i++) {
          context.strokeRect(x, y, boxWidth, boxHeight);
          context.fillText(bookTitles[i+1], x + 70, y + 30);
          y += 50;
        }

        //draw text in between the two stacks that says "stack.pop()"
        context.font = "20px Arial";
        context.fillText("stack.pop()", 250, 250);

      }

      const step2 = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.textAlign = "center";
        context.font = "16px Arial";
        context.fillText("Example of the stack.push() method: ", canvas.width/2, 50, canvas.width-10);
        
        //draw a stack of 4 boxes on the left side of the canvas with book titles in the middle.
        let x = 20;
        let y = 150;
        let boxWidth = 130;
        let boxHeight = 50;
        let bookTitles = ["The Very Hungry Caterpillar", "Atlas Shrugged", "The Road", "Hamlet", "Crime & Punishment"];
        context.font = "12px Arial";
        for(let i = 0; i < 4; i++) {
          context.strokeRect(x, y, boxWidth, boxHeight);
          context.fillText(bookTitles[i+1], x + 70, y + 30);
          y += 50;
        }

        //draw a stack of 5 boxes on the right side of the screen the same book titles in the middle.
        x = 350;
        y = 100;
        for(let i = 0; i < 5; i++) {
          context.strokeRect(x, y, boxWidth, boxHeight);
          context.fillText(bookTitles[i], x + 70, y + 30);
          y += 50;
        }

        //draw text in between the two stacks that says "stack.pop()"
        context.font = "20px Arial";
        context.fillText("stack.push(\"The Very ", 250, 250);
        context.fillText("Hungry Caterpillar\")", 250, 275);
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