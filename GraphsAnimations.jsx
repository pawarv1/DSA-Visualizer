import React, { useState, useRef, useEffect } from 'react';
import AnimationTool from './AnimationTool';

/*
This component handles all the canvas logic needed for the various Graphs animations
Team will work on the animations as specified in last meeting
*/

export function Animation2() {
    const [step, setStep] = useState(1); // Initial step
    
    const handleStepChange = (newStep) => {
      setStep(newStep); // Update the step
    };
  
    const numSteps = 3; //FIXME

    const canvasRef2 = useRef(null); // Reference to the canvas element

    useEffect(() => {
        const canvas = canvasRef2.current;
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

        // function to draw nodes for graphs
        function drawNode(ctx, x, y, radius, nodeLabel) {
          ctx.fillStyle = 'lightgrey';
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI*2, 1);
          ctx.stroke();
          ctx.fill();
          ctx.font = "16px Arial";
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.fillText(nodeLabel, x, y + 5);
        }

        // function to draw undirected edges between nodes
        function drawEdge(ctx, fromX, fromY, toX, toY) {
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
        }

        // Logic for the first step of the animation
        const step1 = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
        };

        /* Graphs Animation 2, Step 2: Undirected Graphs - Jacob */
        const step2 = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);

          // The start of the figure
          let x = 250;  // These coords can be used to control the figure
          let y = 40;   // initial: x = 250; y = 40

          context.fillStyle = 'black';
          context.font = "16px Arial";
          context.textAlign = "center";
          context.fillText("Undirected Graphs", x, y); // Step title
          // Draw underline for step title
          context.strokeStyle = 'black';
          context.beginPath();
          context.moveTo(x - 75, y + 5);
          context.lineTo(x + 75, y + 5);
          context.stroke();

          // Write info about graphs
          context.font = "14px Arial";
          context.textAlign = 'left';
          context.fillText("– With undirected graphs, edges have no direction.", x - 200, y + 35);
          context.fillText("In other words, the relationship between nodes is bidirectional.", x - 188, y + 55);

          context.fillText("– Based on the above example, we say that F and B are “adjacent” to A", x - 220, y + 325);
          context.fillText("since there are undirected edges connecting those nodes to A.", x - 208, y + 345);
          context.fillText("– An undirected graph such as this could be used to represent", x - 220, y + 400);
          context.fillText("social media friends, for example.", x - 209, y + 420);

          /* Draw example graph */
          // drawNode(ctx, x, y, radius, nodeLabel)
          drawNode(context, x - 100, y + 100, 20, "A"); // node A
          drawNode(context, x - 175, y + 175, 20, "B"); // node B
          drawNode(context, x - 100, y + 250, 20, "C"); // node C
          drawNode(context, x + 100, y + 250, 20, "D"); // node D
          drawNode(context, x + 175, y + 175, 20, "E"); // node E
          drawNode(context, x + 100, y + 100, 20, "F"); // node F
          
          // Draw edges
          // drawEdge(ctx, fromX, fromY, toX, toY)
          drawEdge(context, x - 120, y + 100, x - 175, y + 155); // A - B
          drawEdge(context, x - 175, y + 195, x - 120, y + 250); // B - C
          drawEdge(context, x - 80,  y + 250, x + 80,  y + 250); // C - D
          drawEdge(context, x + 120, y + 250, x + 175, y + 195); // D - E
          drawEdge(context, x + 175, y + 155, x + 120, y + 100); // E - F
          drawEdge(context, x + 80,  y + 100, x - 80,  y + 100); // F - A
          drawEdge(context, x - 155, y + 175, x + 155, y + 175); // B - E
        };

        /* Step 3: Directed Graphs - Jacob */
        const step3 = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);

          // The start of the figure
          let x = 250;  // These coords can be used to control the figure
          let y = 40;   // initial: x = 250; y = 40

          context.fillStyle = 'black';
          context.font = "16px Arial";
          context.textAlign = "center";
          context.fillText("Directed Graphs", x, y); // Step title
          // Draw underline for step title
          context.strokeStyle = 'black';
          context.beginPath();
          context.moveTo(x - 75, y + 5);
          context.lineTo(x + 75, y + 5);
          context.stroke();

          // Write info about graphs
          context.font = "14px Arial";
          context.textAlign = 'left';
          context.fillText("– With directed graphs, edges have a direction.", x - 220, y + 35);
          context.fillText("A directed edge represents a one-way relationship between nodes.", x - 208, y + 55);

          context.fillText("– Additionally, two nodes may have edges pointing to each other,", x - 210, y + 305);
          context.fillText("such as nodes B and E in the example above.", x - 198, y + 325);
          context.fillText("– For instance, a directed graph could be used to represent", x - 210, y + 370);
          context.fillText("a road network, with one-way and two-way streets.", x - 199, y + 390);
          context.fillText("* The next animation will expand on the concept of adjacency. *", x - 200, y + 440);

          /* Draw example graph */
          // drawNode(ctx, x, y, radius, nodeLabel)
          drawNode(context, x - 100, y + 100, 20, "A"); // node A
          drawNode(context, x - 175, y + 175, 20, "B"); // node B
          drawNode(context, x - 100, y + 250, 20, "C"); // node C
          drawNode(context, x + 100, y + 250, 20, "D"); // node D
          drawNode(context, x + 175, y + 175, 20, "E"); // node E
          drawNode(context, x + 100, y + 100, 20, "F"); // node F
          
          // Draw directed edges
          // drawEdge(ctx, fromX, fromY, toX, toY)
          drawArrow(context, x - 80,  y + 100, x + 80,  y + 100); // A -> F
          drawArrow(context, x - 175, y + 155, x - 120, y + 100); // B -> A
          drawArrow(context, x - 175, y + 195, x - 120, y + 250); // B -> C
          drawArrow(context, x - 157, y + 165, x + 157, y + 165); // B -> E
          drawArrow(context, x + 80,  y + 250, x - 80,  y + 250); // D -> C
          drawArrow(context, x + 120, y + 250, x + 175, y + 195); // D -> E
          drawArrow(context, x + 157, y + 185, x - 157, y + 185); // E -> B
          drawArrow(context, x + 120, y + 100, x + 175, y + 155); // F -> E
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
        <AnimationTool currStep={step} numSteps = {numSteps} updateStep={handleStepChange}></AnimationTool><br></br>
        <canvas ref={canvasRef2} width={500} height={500} style={{ border: '1px solid black' }}>
          Canvas not supported.
        </canvas>
        </>
    );
}