import React, { useRef, useEffect } from 'react';

const CanvasRenderer = ({ layout, width, height }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawCells(ctx, layout);
  }, [layout]);

  const drawCells = (ctx, layout) => {
    ctx.clearRect(0, 0, width, height); // Clear canvas

    layout.forEach(({ x, y, width, height, value, index }) => {
      // Draw cell box
      ctx.fillStyle = 'lightblue';
      ctx.fillRect(x, y, width, height);

      // Draw cell border
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);

      // Draw value in the center
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.font = '16px Arial';
      ctx.fillText(value, x + width / 2, y + height / 2);

      // Draw index below the cell
      ctx.fillText(index, x + width / 2, y + height + 12);
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '1px solid black' }}
    ></canvas>
  );
};

export default CanvasRenderer;
