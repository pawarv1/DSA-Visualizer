import React, { useState } from 'react';
import CanvasRenderer from './tools/CanvasRenderer';
import { generateArrayLayout } from './tools/d3Layout';
import { bubbleSortAnimation } from './tools/animations';

function ArrayView() {
  const [array, setArray] = useState([5, 8, 3, 6, 2, 7, 1, 4, 9, 10]);

  const canvasWidth = 500;
  const canvasHeight = 300;
  const cellSize = 60; // Adjust cell size for better spacing

  const { layout } = generateArrayLayout(array, canvasWidth, canvasHeight, cellSize);

  return (
    <div>
      <h1>Array Visualization</h1>
      <CanvasRenderer layout={layout} width={canvasWidth} height={canvasHeight} /><br></br>
      <button onClick={() => bubbleSortAnimation(array, setArray)}>Bubble Sort</button>
      <button onClick={() => setArray([5, 8, 3, 6, 2, 7, 1, 4, 9, 10])}>Reset</button>
    </div>
  );
}

export default ArrayView;