import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from "./AnimationTool";

/*
This component handles all the canvas logic needed for the various linked lists animations
Team will work on the animations as specified in last meeting
*/

export function Animation1() {
    const [step, setStep] = useState(1); // Initial step
    
    const handleStepChange = (newStep) => {
      setStep(newStep); // Update the step
    };
  
    const numSteps = 3;
  
    const canvasRef1 = useRef(null); // Reference to the canvas element
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
    
    /* ANIMATION 3 - Jacob */
    useEffect(() => {
      const canvas = canvasRef3.current;
      const context = canvas.getContext('2d'); // Get the 2D context
      context.font = "14px Arial";

      // Logic for the first step of the animation
      const step1 = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";

        /* Start of Figure 1: Adding a node when the list is empty. That node becomes the head */
        context.fillText("Figure 1. Adding a node when the list is empty. That node becomes the head.", canvas.width/2, 25);
        // Figure 1.1
        context.fillText("1.1", 25, 75);
        context.fillText("New Node", 80, 90);
        context.fillText("[List is Empty, Head not initialized]", 110, 175);
      
        const elements = [
          "Data", "Next"
        ];

        // draw the new node boxes: [Data | Next]
        let x = 20;
        let y = 100;
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x,y,80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 40 - (i*15), y + 25);
          x += 80;
        }
        
        // Figure 1.2
        y = 75;
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("1.2", 260, y);
        context.fillText("Head", 260, y + 55);
        context.fillText("Null", 470, y+ 55);
        context.fillText("[Head now points to the new node]", 380, y + 100);

        // draw pointer from Head to new node
        context.strokeStyle = "black"
        context.beginPath();
        context.moveTo(260, y + 60);
        context.lineTo(300, y + 60);
        context.closePath();
        context.stroke();
        // draw pointer from Next to Null
        context.beginPath();
        context.moveTo(405, y + 60);
        context.lineTo(470, y + 60);
        context.closePath();
        context.stroke();

        // draw the boxes: [Data | Next]
        x = 300;
        y = 100;
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x,y,80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 40 - (i*15), y + 25);
          x += 80;
        }

        /* Start of Figure 2: adding new node before the head, the new node becomes the new head */
        // Figure 2.1
        x = 25;
        y = 250;
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Figure 2. Adding a new node before the head. That node becomes the head.", canvas.width/2, y);
        context.fillText("2.1", 25, 285);
        context.fillText("Head", x, y + 75);
        context.fillText("Null", x + 190, y + 75);
        context.fillText("A New Node", x + 335, y + 40);
        
        // draw pointer from Head to node
        context.strokeStyle = "black"
        context.beginPath();
        context.moveTo(x, y + 80);
        context.lineTo(x + 30, y + 80);
        context.closePath();
        context.stroke();
        // draw pointer from Next to Null
        context.beginPath();
        context.moveTo(x + 135, y + 80);
        context.lineTo(x + 180, y + 80);
        context.closePath();
        context.stroke();

        // draw the existing node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 30, y + 50, 80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 70 - (i*15), y + 75);
          x += 80;
        }

        // draw new node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "green";
          context.strokeRect(x + 110, y + 50, 80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 150 - (i*15), y + 75);
          x += 80;
        }

        // Figure 2.2: new node becomes new head. Next points to the other node
        x = 25;
        y = 350;
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("2.2", 25, 390);
        context.fillText("Head", x, y + 75);
        context.fillText("Null", x + 400, y + 75);
        context.font = "12px Arial";
        context.fillText("[Head is set to point to the green node instead. So the green node becomes the head.", 
          x + 220, y + 120);
        context.fillText("The green node's Next pointer then points to the node that used to be the head]",
          x + 220, y + 140);
        
        // draw pointer from Head to node
        context.strokeStyle = "black"
        context.beginPath();
        context.moveTo(x, y + 80);
        context.lineTo(x + 30, y + 80);
        context.closePath();
        context.stroke();
        // draw pointer from Next to other node
        context.beginPath();
        context.moveTo(x + 135, y + 80);
        context.lineTo(x + 240, y + 80);
        context.closePath();
        context.stroke();
        // draw pointer from black node's Next to Null
        context.beginPath();
        context.moveTo(x + 350, y + 80);
        context.lineTo(x + 400, y + 80);
        context.closePath();
        context.stroke();

        // draw the new head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "green";
          context.strokeRect(x + 30, y + 50, 80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 70 - (i*15), y + 75);
          x += 80;
        }

        // draw the other node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 80, y + 50, 80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 120 - (i*15), y + 75);
          x += 80;
        }
      }

      /* Step 2 */
      const step2 = () => {
        let x = 250;
        let y = 40;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Adding a node to the end of a linked list", x, y);

        const elements = [
          "Data", "Next"
        ];

        // Figure 1.1
        x = 30;
        y = 140;
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("1.1", 25, 75);
        context.fillText("Head", x, y);
        context.fillText("Null", x + 270, y);
        context.fillText("A New Node", x + 375, y - 35)
        context.font = "12px Arial";
        
        // draw pointer from Head to head node
        context.strokeStyle = "black"
        context.beginPath();
        context.moveTo(x, y + 5);
        context.lineTo(x + 30, y + 5);
        context.closePath();
        context.stroke();
        // draw pointer from head node's Next to 2nd node
        context.beginPath();
        context.moveTo(x + 105, y + 5);
        context.lineTo(x + 150, y + 5);
        context.closePath();
        context.stroke();
        // draw pointer from 2nd node's Next to Null
        context.beginPath();
        context.moveTo(x + 230, y + 5);
        context.lineTo(x + 265, y + 5);
        context.closePath();
        context.stroke();

        // draw the head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 30, y - 25, 60 - (i*30), 50);
          context.font = "10px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 60 - (i*15), y);
          x += 60;
        }

        // draw the 2nd node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 30, y - 25, 60 - (i*30),50);
          context.font = "10px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 60 - (i*15), y);
          x += 60;
        }

        // draw the 3rd (new) node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x + 90, y - 25, 60 - (i*30),50);
          context.font = "10px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 120 - (i*15), y);
          x += 60;
        }

        // Figure 1.2
        x = 30;
        y = 300;
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("1.2", 25, 250);
        context.fillText("Head", x, y);
        context.fillText("Null", x + 390, y);
        context.fillText("A New Node", x + 310, y - 35)
        context.font = "12px Arial";
        
        // draw pointer from Head to head node
        context.strokeStyle = "black"
        context.beginPath();
        context.moveTo(x, y + 5);
        context.lineTo(x + 30, y + 5);
        context.closePath();
        context.stroke();
        // draw pointer from head node's Next to 2nd node
        context.beginPath();
        context.moveTo(x + 105, y + 5);
        context.lineTo(x + 150, y + 5);
        context.closePath();
        context.stroke();
        // draw pointer from 2nd node's Next to 3rd (new) node
        context.beginPath();
        context.moveTo(x + 230, y + 5);
        context.lineTo(x + 265, y + 5);
        context.closePath();
        context.stroke();
        // draw pointer from 3rd (new) node's Next to Null
        context.beginPath();
        context.moveTo(x + 340, y + 5);
        context.lineTo(x + 390, y + 5);
        context.closePath();
        context.stroke();

        // draw the head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 30, y - 25, 60 - (i*30), 50);
          context.font = "10px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 60 - (i*15), y);
          x += 60;
        }

        // draw the 2nd node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 30, y - 25, 60 - (i*30),50);
          context.font = "10px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 60 - (i*15), y);
          x += 60;
        }

        // draw the 3rd (new) node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x + 25, y - 25, 60 - (i*30),50);
          context.font = "10px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 55 - (i*15), y);
          x += 60;
        }
      }

      /* Step 3 */
      const step3 = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        let x = 250;
        let y = 40;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Adding a node to the middle of a linked list", x, y);

        const elements = [
          "Data", "Next"
        ];

        // Figure 1.1
        x = 30;
        y = 140;
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("1.1", 25, 75);
        context.fillText("Head", x, y);
        context.fillText("Null", x + 440, y);
        context.fillText("A New Node", x + 220, y + 65)
        context.font = "12px Arial";
        
        // draw pointer from Head to head node
        context.strokeStyle = "black"
        context.beginPath();
        context.moveTo(x, y + 5);
        context.lineTo(x + 30, y + 5);
        context.closePath();
        context.stroke();
        // draw pointer from head node's Next to 2nd node
        context.beginPath();
        context.moveTo(x + 125, y + 5);
        context.lineTo(x + 300, y + 5);
        context.closePath();
        context.stroke();
        // draw pointer from 2nd node's Next to Null
        context.beginPath();
        context.moveTo(x + 390, y + 5);
        context.lineTo(x + 440, y + 5);
        context.closePath();
        context.stroke();

        // draw the head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 30, y - 25, 70 - (i*30), 50);
          context.font = "11px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 65 - (i*15), y);
          x += 70;
        }

        // draw the 2nd node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 160, y - 25, 70 - (i*30),50);
          context.font = "11px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 195 - (i*15), y);
          x += 70;
        }

        // draw the blue (new) node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x - 115, y + 75, 70 - (i*30), 50);
          context.font = "11px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x - 80 - (i*15), y + 100);
          x += 70;
        }

        // Figure 1.2
        x = 30;
        y = 400;
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("1.2", 25, 350);
        context.fillText("Head", x, y);
        context.fillText("Null", x + 440, y);
        context.fillText("A New Node", x + 220, y - 20)
        context.font = "12px Arial";
        
        // draw pointer from Head to head node
        context.strokeStyle = "black"
        context.beginPath();
        context.moveTo(x, y + 5);
        context.lineTo(x + 30, y + 5);
        context.closePath();
        context.stroke();
        // draw pointer from head node's Next to middle (new) node
        context.beginPath();
        context.moveTo(x + 125, y + 5);
        context.lineTo(x + 165, y + 15);
        context.closePath();
        context.stroke();
        // draw pointer from middle (new) node's Next to 3rd node
        context.beginPath();
        context.moveTo(x + 255, y + 20);
        context.lineTo(x + 300, y + 10);
        context.closePath();
        context.stroke();
        // draw pointer from 3rd node's Next to Null
        context.beginPath();
        context.moveTo(x + 390, y + 5);
        context.lineTo(x + 440, y + 5);
        context.closePath();
        context.stroke();

        // draw the head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 30, y - 25, 70 - (i*30), 50);
          context.font = "11px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 65 - (i*15), y);
          x += 70;
        }

        // draw the 3rd node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x + 160, y - 25, 70 - (i*30),50);
          context.font = "11px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 195 - (i*15), y);
          x += 70;
        }

        // draw the middle (new) node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x - 115, y - 10, 70 - (i*30), 50);
          context.font = "11px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x - 80 - (i*15), y + 15);
          x += 70;
        }
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
      }
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