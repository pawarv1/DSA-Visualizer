import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from "./OutdatedAnimationTool";

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

        /* Start of Figure 1: Adding a node when the list is empty. That node becomes the head */
        // Figure 1.1
        let x = 20;   // these x & y coordinates can be used to control the entirety of Figure 1
        let y = 100;  // initial: x = 20; y = 100
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Figure 1. Adding a node when the list is empty. That node becomes the head.",
          canvas.width/2, y - 75);
        context.fillText("1.1", x + 5, y - 25);
        context.fillText("New Node", x + 70, y - 10);
        context.fillText("Null", x + 170, y + 33);
        context.fillText("(List is Empty, Head not initialized)", x + 95, y + 80);

        // draw pointer from blue (new) node's Next to Null
        context.strokeStyle = "black";
        drawArrow(context, x + 110, y + 30, x + 155, y + 30);
      
        const elements = [
          "Data", "Next"
        ];

        // draw the new node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x,y,80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 40 - (i*15), y + 25);
          x += 80;
        }
        
        // Figure 1.2
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("1.2", x + 70, y - 25);
        context.fillText("Head", x + 80, y + 25);
        context.fillText("Null", x + 295, y + 32);
        context.fillText("(Head now points to the new node)", x + 195, y + 80);

        // draw pointer from Head to new node
        context.strokeStyle = "black"
        drawArrow(context, x + 80, y + 30, x + 120, y + 30);

        // draw pointer from Next to Null
        drawArrow(context, x + 230, y + 30, x + 280, y + 30);

        // draw the boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x + 120, y, 80 - (i*30), 50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x + 160 - (i*15), y + 25);
          x += 80;
        }

        /* Start of Figure 2: adding new node before the head, the new node becomes the new head */
        // Figure 2.1
        x = 25;   // these x & y coords can be used to control the entirety of Figure 2
        y = 250;
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Figure 2. Adding a new node before the head. That node becomes the head.", canvas.width/2, y);
        context.fillText("2.1", x, y + 35);
        context.fillText("Head", x, y + 75);
        context.fillText("Null", x + 200, y + 83);
        context.fillText("Null", x + 445, y + 83); // the green (new) node's Next points to Null
        context.fillText("A New Node", x + 335, y + 40);
        
        // draw pointer from Head to node
        context.strokeStyle = "black"
        drawArrow(context, x, y + 80, x + 30, y + 80);

        // draw pointer from current head node's Next to Null
        drawArrow(context, x + 135, y + 80, x + 180, y + 80);

        // draw pointer from green (new) node's Next to Null
        drawArrow(context, x + 380, y + 80, x + 425, y + 80);

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
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("2.2", x - 320, y + 140);
        context.fillText("Head", x - 320, y + 180);
        context.fillText("Null", x + 130, y + 188);
        context.font = "12px Arial";
        context.fillText("(Head is set to point to the green node instead. So the green node becomes the head.", 
          x - 100, y + 220);
        context.fillText("The green node's Next pointer then points to the node that used to be the head)",
          x - 100, y + 240);
        
        // draw pointer from Head to node
        context.strokeStyle = "black"
        drawArrow(context, x - 320, y + 185, x - 290, y + 185);
        
        // draw pointer from green (new head) node's Next to other node
        drawArrow(context, x - 180, y + 185, x - 60, y + 185);

        // draw pointer from black node's Next to Null
        drawArrow(context, x + 50, y + 185, x + 110, y + 185);

        // draw the new head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "green";
          context.strokeRect(x - 290, y + 150, 80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x - 250 - (i*15), y + 175);
          x += 80;
        }

        // draw the other node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "black";
          context.strokeRect(x - 220, y + 150, 80 - (i*30),50);
          context.font = "12px Arial";
          context.textAlign = "center";
          context.fillText(elements[i], x - 180 - (i*15), y + 175);
          x += 80;
        }
      };

      /* Step 2 */
      const step2 = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Start of the Figure
        // Figure 1.1
        let x = 30;   // these x & y coords can be used to control Figure 1.1 and 1.2
        let y = 140;  // initial: x = 30; y = 140
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Adding a node to the end of a linked list", x + 220, y - 100);
        context.fillText("1.1", x - 5, y - 65);
        context.fillText("Head", x - 5, y);
        context.fillText("Null", x + 280, y + 8);
        context.fillText("Null", x + 455, y + 8);
        context.fillText("A New Node", x + 375, y - 35);
        context.fillText("(The resizing is simply for visual purposes", x + 220, y + 310);
        context.fillText("and has no other meaning)", x + 220, y + 330);
        
        // draw pointer from Head to head node
        context.strokeStyle = "black"
        drawArrow(context, x, y + 5, x + 30, y + 5);

        // draw pointer from head node's Next to 2nd node
        drawArrow(context, x + 105, y + 5, x + 150, y + 5);

        // draw pointer from 2nd node's Next to Null
        drawArrow(context, x + 225, y + 5, x + 265, y + 5);

        // draw pointer from blue (new) node's Next to Null
        drawArrow(context, x + 405, y + 5, x + 440, y + 5);

        const elements = [
          "Data", "Next"
        ];

        // draw the head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeRect(x + 30, y - 25, 60 - (i*30), 50);
          context.font = "10px Arial";
          context.fillText(elements[i], x + 60 - (i*15), y);
          x += 60;
        }

        // draw the 2nd node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeRect(x + 30, y - 25, 60 - (i*30),50);
          context.fillText(elements[i], x + 60 - (i*15), y);
          x += 60;
        }

        // draw the 3rd (new) node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x + 90, y - 25, 60 - (i*30),50);
          context.fillText(elements[i], x + 120 - (i*15), y);
          x += 60;
        }

        // Figure 1.2
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("1.2", x - 370, y + 110);
        context.fillText("Head", x - 365, y + 170);
        context.fillText("Null", x + 95, y + 178);
        context.fillText("A New Node", x + 5, y + 130)
        
        // draw pointer from Head to head node
        context.strokeStyle = "black"
        drawArrow(context, x - 360, y + 175, x - 330, y + 175);

        // draw pointer from head node's Next to 2nd node
        drawArrow(context, x - 240, y + 175, x - 190, y + 175);

        // draw pointer from 2nd node's Next to 3rd (new) node
        drawArrow(context, x - 100, y + 175, x - 50, y + 175);

        // draw pointer from 3rd (new) node's Next to Null
        drawArrow(context, x + 40, y + 175, x + 80, y + 175);

        // draw the head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeRect(x - 330, y + 140, 70 - (i*30), 50);
          context.font = "11px Arial";
          context.fillText(elements[i], x - 295 - (i*15), y + 165);
          x += 70;
        }

        // draw the 2nd node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeRect(x - 330, y + 140, 70 - (i*30), 50);
          context.fillText(elements[i], x - 295 - (i*15), y + 165);
          x += 70;
        }

        // draw the 3rd (new) node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x - 330, y + 140, 70 - (i*30), 50);
          context.fillText(elements[i], x - 295 - (i*15), y + 165);
          x += 70;
        }
      }

      /* Step 3 */
      const step3 = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // The start of Figure 1
        // Figure 1.1
        let x = 30;   // These x & y coords control Figure 1.1
        let y = 140;  // initial: x = 30; y = 140
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("Adding a node to the middle of a linked list", x + 220, y - 100);
        context.fillText("1.1", x - 5, y - 65);
        context.fillText("Head", x - 5, y);
        context.fillText("Null", x + 445, y + 8);
        context.fillText("A New Node", x + 220, y + 65)
        
        // draw pointer from Head to head node
        context.strokeStyle = "black"
        drawArrow(context, x, y + 5, x + 30, y + 5);

        // draw pointer from head node's Next to 2nd node
        drawArrow(context, x + 125, y + 5, x + 300, y + 5);

        // draw pointer from 2nd node's Next to Null
        drawArrow(context, x + 390, y + 5, x + 430, y + 5);

        const elements = [
          "Data", "Next"
        ];

        // draw the head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeRect(x + 30, y - 25, 70 - (i*30), 50);
          context.font = "11px Arial";
          context.fillText(elements[i], x + 65 - (i*15), y);
          x += 70;
        }

        // draw the 2nd node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeRect(x + 160, y - 25, 70 - (i*30),50);
          context.fillText(elements[i], x + 195 - (i*15), y);
          x += 70;
        }

        // draw the blue (new) node boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeStyle = "blue";
          context.strokeRect(x - 115, y + 75, 70 - (i*30), 50);
          context.fillText(elements[i], x - 80 - (i*15), y + 100);
          x += 70;
        }

        // Figure 1.2
        x = 30;   // These x & y coords control Figure 1.2
        y = 400;  // initial: x = 30; y = 400
        context.fillStyle = 'black';
        context.font = "14px Arial";
        context.textAlign = "center";
        context.fillText("1.2", 25, 350);
        context.fillText("Head", x - 5, y);
        context.fillText("Null", x + 445, y + 8);
        context.fillText("A New Node", x + 220, y - 20)
        context.fillText("(A node can be inserted anywhere as long as", x + 220, y + 70)
        context.fillText("the pointers for that location are properly updated)", x + 220, y + 90)
        
        // draw pointer from Head to head node
        context.strokeStyle = "black"
        drawArrow(context, x, y + 5, x + 30, y + 5);

        // draw pointer from head node's Next to middle (new) node
        drawArrow(context, x + 125, y + 5, x + 165, y + 15);

        // draw pointer from middle (new) node's Next to 3rd node
        drawArrow(context, x + 255, y + 20, x + 300, y + 10);

        // draw pointer from 3rd node's Next to Null
        drawArrow(context, x + 390, y + 5, x + 430, y + 5);

        // draw the head boxes: [Data | Next]
        for (let i = 0; i < 2; i++) {
          context.strokeRect(x + 30, y - 25, 70 - (i*30), 50);
          context.font = "11px Arial";
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