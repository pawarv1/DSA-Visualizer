import * as d3 from 'd3';

// Generate a generic layout for arrays
export const generateArrayLayout = (array, canvasWidth, canvasHeight, cellSize = 50) => {
  const columns = Math.floor(canvasWidth / cellSize); // Number of cells per row
  const layout = array.map((value, index) => ({
    value,
    index,
    x: (index % columns) * cellSize, // X position
    y: Math.floor(index / columns) * cellSize, // Y position
    width: cellSize - 10, // Adjust for spacing
    height: cellSize - 10,
  }));

  return { layout };
};

// Placeholder for other data structures
export const generateTreeLayout = (treeData, canvasWidth, canvasHeight) => {
  // Use D3 tree layout for hierarchical structures
  const treeLayout = d3.tree().size([canvasWidth, canvasHeight]);
  const root = d3.hierarchy(treeData);
  const nodes = treeLayout(root).descendants();

  return nodes.map(node => ({
    x: node.x,
    y: node.y,
    value: node.data.value,
  }));
};
