import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from './AnimationTool';

export function Animation1() {

  const [step, setStep] = useState(1); // Initial step
  
  const handleStepChange = (newStep) => {
    setStep(newStep); // Update the step
  };

  const canvasRef1 = useRef(null); // Reference to the canvas element

  useEffect(() => {
    const canvas = canvasRef1.current;
    const context = canvas.getContext('2d'); // Get the 2D context
    context.font = "10px Arial";

    const step1 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.fillText("Arrays are a fixed size sequential collections of elements of the same type.",10,80);
      let x = 10;
      let y = 100;
    
      for (let i = 0; i < 5; i++) {
        context.strokeRect(x,y,50,40);
        x += 50;
      }
    }

    const step2 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.fillText("They can store primitive type data or objects.",10,80);
      let x = 10;
      let y = 100;
    
      for (let i = 0; i < 5; i++) {
        context.strokeRect(x,y,50,40);
        x += 50;
      }
    }

    const step3 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'orange';
      context.fillRect(50, 50, 100, 100);
    }

    const step4 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'yellow';
      context.fillRect(50, 50, 100, 100);
    }

    const step5 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'green';
      context.fillRect(50, 50, 100, 100);
    }

    const step6 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.fillRect(50, 50, 100, 100);
    }

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
      case 5:
        step5();
        break;
      case 6:
        step6();
        break;
    }
  });

  return (
    <>
      <h2>Step: {step}</h2>
      <AnimationTool currStep={step} numSteps = {6} updateStep={handleStepChange}></AnimationTool><br></br>
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

  const canvasRef2 = useRef(null); // Reference to the canvas element
  return (
    <>
      <h2>Step: {step}</h2>
      <AnimationTool currStep={step} numSteps = {6} updateStep={handleStepChange}></AnimationTool><br></br>
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

  const canvasRef3 = useRef(null); // Reference to the canvas element
  return (
    <>
      <h2>Step: {step}</h2>
      <AnimationTool currStep={step} numSteps = {6} updateStep={handleStepChange}></AnimationTool><br></br>
      <canvas ref={canvasRef3} width={500} height={500} style={{ border: '1px solid black' }}>
        Canvas not supported.
      </canvas>
      </>
  );
}