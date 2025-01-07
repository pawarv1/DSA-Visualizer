import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from './AnimationTool';

/*
This component handles all the canvas logic needed for the various array animations
The other data structure pages will have their own files similar to this one
*/


// The first animation, which serves as an introduction to arrays
export function Animation1() {

  const [step, setStep] = useState(1); // useState hook is used to track the steps in the animation
  
  // Callback function to update the step modifications in AnimationTool
  const handleStepChange = (newStep) => {
    setStep(newStep); 
  };

  // Number of steps for this animation
  const numSteps = 4;

  const canvasRef1 = useRef(null); // Reference to the canvas element

  // This hook updates the canvas based on the step dependencu
  // Dependency array may need to be updated
  useEffect(() => {
    const canvas = canvasRef1.current;
    const context = canvas.getContext('2d'); // Get the 2D context
    context.font = "14px Arial";

    // Logic for the first step of the animation
    const step1 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.font = "14px Arial";
      context.textAlign = "center";
      context.fillText("Arrays are a fixed size sequential collections of elements of the same type.", canvas.width/2, 80);
      let x = 10;
      let y = 100;
    
      const elements = [
        "apples", "bananas", "oranges", "grapes", "pineapples"
      ]

      for (let i = 0; i < 5; i++) {
        context.strokeRect(x,y,80,50);
        context.font = "12px Arial";
        context.textAlign = "center";
        context.fillText(elements[i], x + 40, y + 25);
        x += 80;
      }
    }

    // Logic for the second step of the animation
    const step2 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.textAlign = "center";
      context.fillText("Arrays usually only store elements of the same type, and most languages don’t support having more." , canvas.width/2, 80);
      context.textAlign = "left";
      context.fillText("The elements can be primitive types, or objects." , 0, 100);
      
      let x = 10;
      let y = 170;
    
      const elements1 = [
        3, 0, 12, 43, 96, 21
      ]

      for (let i = 0; i < 6; i++) {
        context.strokeRect(x,y,80,50);
        context.font = "12px Arial";
        context.textAlign = "center";
        context.fillText(elements1[i], x + 40, y + 25);
        x += 80;
      }

      const elements2 = [
        '"Sam"', '"Jacob"', '"Stenneth"', '"Hugo"', '"Varun"'
      ]

      x = 10;
      y = 350;

      for (let i = 0; i < 5; i++) {
        context.strokeRect(x,y,80,50);
        context.font = "12px Arial";
        context.textAlign = "center";
        context.fillText(elements2[i], x + 40, y + 25);
        x += 80;
      }
    }

    // Logic for the third step of the animation
    const step3 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.textAlign = "left";
      context.fillText("Arrays are indexed from 0, to their length - 1." , 0, 80);
      context.fillText("int arr[3]:" , 0, 140);

      let x = 80;
      let y = 110;
    
      const elements = [
        7,8,9
      ]

      for (let i = 0; i < 3; i++) {
        context.strokeRect(x,y,80,50);
        context.font = "12px Arial";
        context.textAlign = "center";
        context.fillText(elements[i], x + 40, y + 25);
        context.fillText(`arr[${i}]`, x + 10, y + 70);
        x += 80;
      }
    
      context.textAlign = "left";
      context.fillText("Array elements can be accessed using their indexes" , 0, 250);
      context.fillText("arr[0]:" , 0, 300);
      context.fillText("7" , 40, 300);
    }

    // Logic for the fourth step of the animation
    const step4 = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.textAlign = "center";
      context.fillText("Trying to access an array at the index of its length or greater will generate an error or exception. " , canvas.width/2, 80);
      context.textAlign = "left";
      context.fillText("This is because it is out of bounds of the arrays memory." , 0, 100);

      context.fillText("int arr[3]:" , 0, 160);

      let x = 80;
      let y = 130;
    
      const elements = [
        7,8,9
      ]

      for (let i = 0; i < 3; i++) {
        context.strokeRect(x,y,80,50);
        context.font = "12px Arial"
        context.textAlign = "center";
        context.fillText(elements[i], x + 40, y + 25);
        context.fillText(`arr[${i}]`, x + 10, y + 70);
        x += 80;
      }

      context.textAlign = "left";
      context.fillText("arr[3]:" , 0, 300);
      context.fillStyle = "red";
      context.fillText("ArrayIndexOutOfBoundsException" , 40, 300);
    }

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

// blank second animation, will be updated later
export function Animation2() {
  const [step, setStep] = useState(1); // Initial step
  
  const handleStepChange = (newStep) => {
    setStep(newStep); // Update the step
  };

  const numSteps = 6;

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

// blank third animatiion, will be updated later
export function Animation3() {
  const [step, setStep] = useState(1); // Initial step
  
  const handleStepChange = (newStep) => {
    setStep(newStep); // Update the step
  };

  const numSteps = 8;

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