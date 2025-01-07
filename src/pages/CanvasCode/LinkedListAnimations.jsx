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
    
      useEffect(() => {
        const canvas = canvasRef1.current;
        const context = canvas.getContext('2d'); // Get the 2D context
        context.font = "14px Arial";

        const step1 = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = 'black';
          context.font = "14px Arial";
          context.textAlign = "center";

          //I set my code up so you can change these variables pretty easily to align the entirety of the text.


          let y = 160 //Position of all of the text boxes and the rect
          let x = canvas.width/2+5;//position of the visualization's x position
          let xWidth = 80 //Width of the box in the visualization
          let yWidth = 50 //Height of aforementioned thing
          
          context.fillText("When a variable is initialized, it is assigned an address in memory where it stores its value.", canvas.width/2, y - 80)




          

          context.textAlign = "left"
          context.fillText("int i = 5", 10, y)
          

          context.textAlign = "right"; 
          context.fillText("0x9234091", canvas.width/2-5, y)
          context.textAlign = "center";


          
          context.strokeRect(x, y-30, xWidth, yWidth);
          context.fillText("5", x + xWidth/2, y);
          context.fillText("i", x + xWidth/2, y - yWidth + 10);

          context.textAlign = "center";
          context.fillText("Above is a visual representation of how 'i' is stored in memory. The value of 'i' is stored at the address 0x9234091", canvas.width/2, y + 80)

        }

        const step2 = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = 'black';
          context.font = "14px Arial";
          context.textAlign = "center";

          
          //You fool, you think im gonna rewrite my comments?
          //You're sorely mistaken
          //Read step 1 to see what these do
          
          let y = 160 
          let x = canvas.width/2+5;
          let xWidth = 80
          let yWidth = 50
          
          context.fillText("A pointer is a variable that stores a memory address where a value is stored.", canvas.width/2, y - 80)




          

          context.textAlign = "left"
          context.fillText("int* i", 10, y-20)
          context.fillText("i* = 5", 10, y)
          

          

          context.textAlign = "right"; 
          context.fillText("0x9234091", canvas.width/2-5, y)

          let arrowStart = canvas.width/2-40
          let arrowEnd = 50
          let middleGround = (canvas.width/2-40 - 10) / 2

          drawArrow(arrowStart, y-20, arrowEnd, y-30, middleGround ,y-70)

          context.textAlign = "center";

          context.strokeRect(x, y-30, xWidth, yWidth);
          
          context.fillText("5", x + xWidth/2, y);
          
          context.fillText("i", x + xWidth/2, y - yWidth + 10);
          

          context.textAlign = "center";
          context.fillText("Here, ‘i’ is equal to 0x9234091 because that is the address of our value.", canvas.width/2, y + 80)
          context.fillText("Using the '*' character allows us to dereferences a pointer, which means we can put a value at the address of a pointer.", canvas.width/2, y + 100)
          context.fillText("\"i* = 5\" allows us to store the number 5 at the memory address 0x9234091.", canvas.width/2, y + 120)
          
        
        }

        const step3 = () => {
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



    function drawArrow(startX, startY, endX,endY, pullX, pullY)
    {
      context.beginPath();
      context.strokeStyle = "black";
      context.lineWidth = 2;


      context.moveTo(startX,startY)

      if(arguments.length == 6)
      {
      context.quadraticCurveTo(pullX,pullY,endX,endY)
      context.stroke()
      context.moveTo(endX,endY)

      //offset changes arrow direction based on whether the pull is above or below
      let offset = -15
      if(pullY >  (startY+endY)/2)
      {
        offset *= -1
      }
      
      
      
      context.lineTo(endX,endY+offset)
      context.moveTo(endX,endY)
      context.lineTo(endX+Math.abs(offset),endY)
      context.stroke()
     }


     else if(arguments.length == 4)
     {

      context.lineTo(endX,endY)
      context.stroke()

      //Trig should be done
      let offset = 15

      //Between here
      context.moveTo(endX,endY)
      context.lineTo(endX,endY+offset)
      context.moveTo(endX,endY)
      context.lineTo(endX+Math.abs(offset),endY)
      context.stroke()


     }






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