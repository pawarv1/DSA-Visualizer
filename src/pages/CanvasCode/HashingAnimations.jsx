import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from "./AnimationTool";


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
        <AnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange}></AnimationTool><br></br>
        <canvas ref={canvasRef2} width={500} height={500} style={{ border: '1px solid black' }}>
          Canvas not supported.
        </canvas>
        </>
    );
}