import React, { useState, useRef, useEffect } from 'react';
import OutdatedAnimationTool from './OutdatedAnimationTool';

/*
This component handles all the canvas logic needed for the various hashing animations
Team will work on the animations as specified in last meeting
*/

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
        <OutdatedAnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange}></OutdatedAnimationTool><br></br>
        <canvas ref={canvasRef1} width={500} height={500} style={{ border: '1px solid black' }}>Canvas</canvas>
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
        
          useEffect(() => {
            const canvas = canvasRef2.current;
            const context = canvas.getContext('2d'); // Get the 2D context
            
            context.font = "14px Arial";
    
            const step1 = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'black';
            context.font = "14px Arial";
            context.textAlign = "center";

            context.fillText("Hash tables are very useful because of their instantaneous lookup time. When given a key, you can directly access the element you are looking for.", canvas.width/2, 80)
            
            let x = 40;
            let y = 120;
            let xWidth = 120;
            let yWidth = 40;


            context.fillText("myHashTable", x + xWidth/2, y - 10);

            let values = 
            [["Vegetable", "Grains", "Dairy", "Fruit", "Protein"],
             ["Lettuce", "Null", "Null", "Apple", "Null"]]

             context.font = "12px Arial";

             //For loop creates the hashtable, this one highlights veggies in green
            for(let i = 0; i < 5; i++)
            {   
                context.strokeRect(x, y, xWidth, yWidth);
                context.textAlign = "center";

                if(values[0][i] == "Vegetable")
                 context.fillStyle = 'green';
                context.fillText(values[1][i], x + xWidth/2, y +yWidth/2);
                context.textAlign = "left";

                
                context.fillText("Key: " + values[0][i], x + xWidth + 5, y+ yWidth/2);
                context.fillStyle = 'black';

                y += yWidth
            }
            
            context.textAlign = "left";
            context.fillText("myHashTable(Vegetable)", canvas.width/2 + 40, 120);
            context.fillText("Returns \"Lettuce\"", canvas.width/2 + 40, 140);


            context.textAlign = "center";
            context.font = "14px Arial";

            context.fillText("", canvas.width/2, y+40 );


            }


            const step2 = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'black';
            context.font = "14px Arial";
            context.textAlign = "center";
            context.fillText("Similarly when inserting an element into a hash table, the key is hashed and the value associated with it is stored at the key’s location.", canvas.width/2,80)

             
            let x = 40;
            let y = 120;
            let xWidth = 120;
            let yWidth = 40;

            
            context.fillText("myHashTable", x + xWidth/2, y - 10);

            let values = 
            [["Vegetable", "Grains", "Dairy", "Fruit", "Protein"],
             ["Lettuce", "Null", "Milk", "Apple", "Null"]]

            context.font = "12px Arial";
            for(let i = 0; i < 5; i++)
            {   
                

                context.strokeRect(x, y, xWidth, yWidth);
                context.textAlign = "center";

                if(values[0][i] == "Dairy")
                context.fillStyle = 'blue';
                context.fillText(values[1][i], x + xWidth/2, y +yWidth/2);
                context.textAlign = "left";
                context.fillText("Key: " + values[0][i], x + xWidth + 5, y+ yWidth/2);

                context.fillStyle = 'black';
                y += yWidth
            }


            
            context.textAlign = "left";
            context.fillText("myHashTable.add(Dairy, Milk)", canvas.width/2 + 40, 120);
            context.fillText("Adds \"Milk\" at Dairy", canvas.width/2 + 40, 140);
            

            context.textAlign = "center";
            context.font = "14px Arial";
            context.fillText("", canvas.width/2, y+40 );
          }
    
    
        // Switch statement which runs the associated step method for the given step
        switch(step) {
            case 1:
                step1();
                break;

            case 2:
                step2();
                break;

        }
          }, [step]);


    return (
      <>
        <h2>Step: {step}/{numSteps}</h2>
        <OutdatedAnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange}></OutdatedAnimationTool><br></br>
        <canvas ref={canvasRef2} width={500} height={500} style={{ border: '1px solid black' }}>Canvas</canvas>
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
      };

      /* Hashing Animation 3, Step 2: Collisons - Jacob */
      const step2 = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);

          // The start of the figure
          let x = 250;  // These coords can be used to control the figure
          let y = 50;   // initial: x = 250; y = 50

          context.fillStyle = 'black';
          context.font = "14px Arial";
          context.textAlign = "center";
          context.fillText("Hashing Collisions", x, y); // Step title
          // Draw underline for step title
          context.strokeStyle = 'black'; 
          context.beginPath();
          context.moveTo(x - 75, y + 5);
          context.lineTo(x + 75, y + 5);
          context.stroke();

          context.fillText("When passed through the hash function, \"John\" and \"Tim\"",
              x, y + 50);
          context.fillText("[note: example keys for now] map to the same index,",
              x, y + 70);
          context.fillText("so data may be unintentionally overwritten and lost.",
              x, y + 90);
          
          context.fillText("h(John) and h(Tim) both equal 3",
              x, y + 440);

          // Write the names that will be mapped by hash function
          context.fillText("Alex", x - 200, y + 200);
          context.fillText("John", x - 200, y + 300);
          context.fillText("Tim", x - 200, y + 400);

          // Draw the box that serves as the visual for the hash function
          context.fillStyle = "grey";
          context.fillRect(x - 100, y + 120, 100, 300);
          context.fillStyle = "white";
          context.fillText("Hash Function", x - 50, y + 150);

          // Draw the boxes that will serve as the array/memory
          for (let i = 0; i < 5; ++i) {
              context.strokeRect(x + 100, y + 120, 100, 60);
              context.font = "14px Arial";
              context.textAlign = "center";
              context.fillStyle = "black";
              context.fillText(i, x + 75, y + 155);

              // Write "???" in index 3 to convey that a memory overwrite error may occur
              if (i == 3) {
                  context.font = "24px Arial";
                  context.fillStyle = "red";
                  context.fillText("???", x + 150, y + 160);
              }
              y += 60;
          }

          // Draw the arrows from the names through the hash function to the mapped index in the array/memory
          // Alex -> 1
          drawArrow(context, x - 180, y - 105, x + 100, y - 100);

          // John -> 3
          drawArrow(context, x - 180, y - 5, x + 100, y + 20);
          
          // Tim -> 3
          drawArrow(context, x - 180, y + 95, x + 100, y + 35);
      };

      /* Step 3 */
      const step3 = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
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
    };
  }, [step]);

  return (
    <>
      <h2>Step: {step}/{numSteps}</h2>
      <OutdatedAnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange}></OutdatedAnimationTool><br></br>
      <canvas ref={canvasRef3} width={500} height={500} style={{ border: '1px solid black' }}>Canvas</canvas>
    </>
  );
}