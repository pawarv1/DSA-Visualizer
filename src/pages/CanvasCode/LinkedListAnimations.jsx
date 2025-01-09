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
          //context.rotate(45 * Math.PI / 180) 
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


          //Ok maybe I should comment this
          
          let arrowStart = canvas.width/2-40 
          let arrowEnd = 50
          let middleGround = (canvas.width/2-40 - 10) / 2 // This makes a central point that I can pull the curve to


          drawArrow(arrowStart, y-20, arrowEnd, y-30,-75, middleGround,y-70)

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

          //I set my code up so you can change these variables pretty easily to align the entirety of the text.


          let y = 160 //Position of all of the text boxes and the rect
          let x = 20;//position of the visualization's x position
          let xWidth = 80 //Width of the box in the visualization
          let yWidth = 50 //Height of aforementioned thing
          
          context.fillText("This is the basic layout of a singly linked list node. It is a building block for the linked lists we will be demonstrating it is composed of 2 elements.", canvas.width/2, y - 80)
          context.textAlign = "left";
          
          context.fillText("Data: which stores information such as values, strings, or even arrays/objects.", x, y - 40)
          context.fillText("Pointers: which typically point to other nodes of the same type. This allows code to traverse the linked list.", x, y - 20)
          context.textAlign = "center";


          let boxY = y+10

          context.strokeRect(x, boxY, xWidth, yWidth);

          context.strokeRect(x + xWidth, boxY, xWidth*.75, yWidth);

          context.fillText("Data", x + xWidth/2, boxY+30);
          context.fillText("Next", x  + xWidth/2 * .75 + xWidth , boxY+30);

          let arrowXStart = x  + xWidth * .75 + xWidth 


          drawArrow(arrowXStart, boxY+25, arrowXStart + 100, boxY+25, 135);


        
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

    
    //Parameters: line's starting x and y, line's ending x and y, angle to rotate the arrow in degrees, the x and y coord of the point the line curves to
    //Guess what it does!
    //Nah I'll just tell you, it draws an arrow!
    //If you leave out the last two parameters it will draw a straight line 
    
    function drawArrow(startX, startY, endX, endY, angle, pullX, pullY)
    {

      context.beginPath();
      context.strokeStyle = "black";
      context.lineWidth = 2;


      context.moveTo(startX,startY)

      if(arguments.length == 7)
      {
      context.quadraticCurveTo(pullX,pullY,endX,endY)
      context.stroke()
      context.moveTo(endX,endY)


      }


     else if(arguments.length == 5)
     {
      context.lineTo(endX,endY)
      context.stroke()
     }

     context.save()


     

     context.translate(endX, endY);


     context.rotate(angle * Math.PI / 180) 

     context.moveTo(0,0)
     context.lineTo(0,20)
     context.moveTo(0,0)
     context.lineTo(20,0)
     context.stroke()
    
     
     context.restore()




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