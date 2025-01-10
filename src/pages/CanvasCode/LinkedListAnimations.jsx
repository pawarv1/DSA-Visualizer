import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from "./AnimationTool";

/*
This component handles all the canvas logic needed for the various linked lists animations
Team will work on the animations as specified in last meeting
*/

function drawNode(ctx, x, y, filled=false) {
  const context = ctx;
  const elements1 = [
    "Data", "Next"
  ]
  
  for (let i = 0; i < 2; i++) {
    if(filled) {
      context.fillStyle = "blue";
      context.fillRect(x,y,80,50);
      context.fillStyle = 'black';
    } else {
      context.strokeRect(x,y,80,50);
    }
    context.font = "12px Arial";
    context.textAlign = "center";
    context.fillText(elements1[i], x + 40, y + 25);
    x += 80;
  }
  context.beginPath();
  context.moveTo(x, y + 25);
  context.lineTo(x + 50, y + 25);
  context.stroke();
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
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Typically, the first node in a linked list is labeled as the head node. ", canvas.width/2, 50, canvas.width-10);
        context.textAlign = "center";
        context.fillText("The Next pointer of the Head node now points to a new node", canvas.width/2, 80, canvas.width-10);

        let x = 10;
        let y = 170;
      
        const elements1 = [
          "Data", "Next"
        ]
        
        context.fillText("Head", x + 80, y - 20);
        drawNode(context, x, y);
        x += 210;
        drawNode(context, x, y);
        x += 160
        context.font = "16px Arial";
        context.fillText("Null", x + 70, y + 30);

      }

      const step2 = () => {
        let x = 10;
        let y = 100;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        
        //top row
        context.font = "16px Arial";
        context.fillText("Head", x + 80, y - 20);
        drawNode(context, x, y);
        x += 230

        context.font = "16px Arial";
        context.fillText("Null", x, y + 30);

        x += 30;
        context.font = "16px Arial";
        context.fillText("New Node", x + 80, y - 20);
        drawNode(context, x, y, true);
        x += 230
        context.font = "16px Arial";
        context.fillText("Null", x, y + 30);

        //bottom row
        x = 10;
        y += 150;
        context.font = "16px Arial";
        context.fillText("Head", x + 80, y - 20);
        drawNode(context, x, y);

        x += 210
        context.font = "16px Arial";
        context.fillText("New Node", x + 80, y - 20);
        drawNode(context, x, y, true);

        x += 230
        context.font = "16px Arial";
        context.fillText("Null", x, y + 30);

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

export function Animation2() {
    const [step, setStep] = useState(1); // Initial step
    
    const handleStepChange = (newStep) => {
      setStep(newStep); // Update the step
    };
  
    const numSteps = 2;
  
    const canvasRef2 = useRef(null); // Reference to the canvas element
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

export function Animation3() {
    const [step, setStep] = useState(1); // Initial step
    
    const handleStepChange = (newStep) => {
      setStep(newStep); // Update the step
    };
  
    const numSteps = 3;
  
    const canvasRef3 = useRef(null); // Reference to the canvas element
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