export const bubbleSortAnimation = (array, setArray, speed = 500) => {
    let i = 0, j = 0;
    const arr = [...array];
  
    const interval = setInterval(() => {
      if (i < arr.length) {
        if (j < arr.length - i - 1) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]); // Update state to trigger re-render
          }
          j++;
        } else {
          j = 0;
          i++;
        }
      } else {
        clearInterval(interval);
      }
    }, speed);
  };
  
  
  // Add other animations (e.g., tree traversal, graph search)
  export const treeTraversalAnimation = (tree, callback, speed = 500) => {
    const traverse = (node) => {
      if (!node) return;
      callback(node); // Process node
      setTimeout(() => {
        traverse(node.left);
        traverse(node.right);
      }, speed);
    };
  
    traverse(tree.root);
  };
  