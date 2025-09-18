import gsap, { timeline } from 'gsap';
import { ArrayCell } from './ArrayCell';

// Related animation for getting prefixSums of arrays, will be used later
/*
export function prefixSum(x: number, y: number, cellWidth: number, cellHeight: number, arr: Array, context: CanvasRenderingContext2D, opacity: number = 1, outlineColor: string = 'black') {
    const elements = new window.Array(arr.getArraySize()).fill("");
    const prefixSumArray = new Array(x, y, cellWidth, cellHeight, elements, opacity, outlineColor);
    prefixSumArray.draw(context);

    const timeline = gsap.timeline();
    let sum = 0;
    
    // Iterate through the array, summing up the elements and highlighting the current position yellow
    for (let i = 0; i < arr.getArraySize(); i++) {  
        sum += arr.getElementAt(i);
        elements[i] = sum;
        timeline.to(prefixSumArray, {
            duration: 1,
            onUpdate: () => {
                arr.setFillColor(context, i, "yellow");
                prefixSumArray.setElementAt(context, i, elements[i]);
            }
        });
    }
}


// Can be used to show two pointers, will be used later
export function TwoSum(arr: Array, targetSum: number, context: CanvasRenderingContext2D) {
    arr.draw(context);
    let i = 0;
    let j = arr.getArraySize() - 1;

    arr.setFillColor(context, i, "yellow");
    arr.setFillColor(context, j, "yellow");

    function updatePointers() {
        if (i != j) {
            if (arr.getElementAt(i) + arr.getElementAt(j) < targetSum) {
                arr.setOpacity(context, i, 0.25)
                i++;
                arr.setFillColor(context, i, "yellow"); // Highlight new index
                setTimeout(updatePointers, 1000); // Wait and then update again
            } else if (arr.getElementAt(i) + arr.getElementAt(j) > targetSum) {
                arr.setOpacity(context, j, 0.25)
                j--;
                arr.setFillColor(context, j, "yellow"); // Highlight new index // Highlight new index
                setTimeout(updatePointers, 1000); // Wait and then update again
            } else {
                // Found the two elements that sum up to the target
                arr.setFillColor(context, i, "lightgreen");
                arr.setFillColor(context, j, "lightgreen");
            }
        } else {
            // Did not find the two elements that sum up to the target
            arr.setFillColor(context, i, "red");
        }
    }

    setTimeout(updatePointers, 1000); // Start the first update
}
*/


// Array Class
export class Array {
    protected arraySize: number;
    protected cells: ArrayCell[];

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, contents: any[], protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.arraySize = contents.length;
        this.opacity = opacity;
        this.cells = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.cells.push(new ArrayCell(this.x + i * this.cellWidth, this.y, this.cellWidth, this.cellHeight, contents[i], this.opacity, "black", "white"));
        }
    }

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        context.save();
        if (drawIndex) {
            let fontSize = Math.min(12, Math.floor(this.cellWidth / 4));
            context.globalAlpha = this.opacity;
            context.fillStyle = 'black';
            context.font = `${fontSize}px Arial`;
            context.textAlign = 'center';
            context.textBaseline = 'top';
            
        }

        for (let i = 0; i < this.arraySize; i++) {
            this.cells[i].opacity = this.opacity;
            this.cells[i].drawCell(context);
            if (drawIndex) {
                // Print index numbers below array cells
                context.fillText(i.toString(), this.x + (this.cellWidth * i) + this.cellWidth / 2, this.y + this.cellHeight + 3);
            }
        };
        context.restore();
    }

    // Throws RangeError if index is out of bounds
    checkIndexValidity(index: number) {
        if (index < 0 || index >= this.arraySize) {
            console.error(`Index ${index} is out of bounds (valid range: 0 to ${this.arraySize - 1})`);
            return false;
        }
        return true;
    }

    // Set the element at the given index
    setElementAt(context: CanvasRenderingContext2D, index: number, newElement: any) {
        if (this.checkIndexValidity(index)) {
            this.cells[index].content = newElement;
            this.cells[index].drawCell(context, false);
        }
    }

    // Can change opacity of an individual cell or all the cells
    setOpacity(context: CanvasRenderingContext2D, index: string | number, opacity: number, redraw: boolean = true) {
        // All cells
        if (typeof index === 'string' && index === "all") {
            this.opacity = opacity;
            if (redraw) {
                this.draw(context);
            }
        }
        // Individual cell
        else if (typeof index === 'number') {
            if (this.checkIndexValidity(index)) {
                this.cells[index].opacity = opacity;

                if (redraw) {
                    this.cells[index].drawCell(context, false);
                }
            }
        }
    }

    // Change outline color of an individual cell
    setOutlineColor(context: CanvasRenderingContext2D, index: number, outlineColor: string, redraw: boolean = true) {
        if (this.checkIndexValidity(index)) {
            this.cells[index].outlineColor = outlineColor;

            if (redraw) {
                this.cells[index].drawCell(context, false);
            }
        }
    }

    // Change fill color of an individual cell
    setFillColor(context: CanvasRenderingContext2D, index: number, fillColor: string, redraw: boolean = true) {
        if (this.checkIndexValidity(index)) {
            this.cells[index].fillColor = fillColor;

            if (redraw) {
                this.cells[index].drawCell(context, false);
            }
        }
    }

    getArraySize() {
        return this.arraySize;
    }

    // Return the element at the given index
    getElementAt(index: number) {
        if (this.checkIndexValidity(index)) {
            return this.cells[index].content;
        }
    }

    // Traverse through the array and print each element
    // Hightlight and change outline color of the current element
    async print(context: CanvasRenderingContext2D, iterationSpeed: number = 1) {
        await new Promise<void>((resolve) => {
            // Resolve after the timeline animation completes
            const timeline = gsap.timeline({onComplete: () => { resolve() }});
        
            for (let i = 0; i < this.getArraySize(); i++) {
                timeline.to(this, {
                    duration: iterationSpeed,
                    onUpdate: () => {
                        this.setOutlineColor(context, i, "red", true);
                        this.setFillColor(context, i, "yellow", true);
                        console.log(this.getElementAt(i));
                    },
                    onComplete: () => {
                        // Set the outline and fill color back to normal when finished
                        this.setOutlineColor(context, i, "black", true);
                        this.setFillColor(context, i, "white", true);
                    }
                });
            }
        });
    }
    
    // Animate the swap of two elements through fading
    async swapElements(context: CanvasRenderingContext2D, index1: number, index2: number) {
        if (this.checkIndexValidity(index1) && this.checkIndexValidity(index2)) {
            const cell1 = this.cells[index1];
            const cell2 = this.cells[index2];
            cell1.fillColor = "yellow";
            cell2.fillColor = "yellow";
            
            // Fade out both cells
            const fadeOut = () => new Promise<void>((resolve) => {
                gsap.to([cell1, cell2], {
                    opacity: 0,
                    duration: 1,
                    onUpdate: () => {
                        cell1.drawCell(context, false);
                        cell2.drawCell(context, false);
                    },
                    onComplete: () => resolve()
                });
            });

            // Swap the contents while the two cells are still faded out 
            const swapContent = () => {
                const temp = cell1.content;
                cell1.content = cell2.content;
                cell2.content = temp;
            };

            // Fade the swapped cells back in
            const fadeIn = () => new Promise<void>((resolve) => {
                gsap.to([cell1, cell2], {
                    opacity: 1,
                    duration: 1,
                    onUpdate: () => {
                        cell1.drawCell(context, false);
                        cell2.drawCell(context, false);
                    },
                    onComplete: () => resolve()
                });
            });

            await fadeOut();
            swapContent();
            await fadeIn();
            // Reset the fill color without redrawing
            cell1.fillColor = "white";
            cell2.fillColor = "white";
        }
    }

    // Clear the array
    clear(context: CanvasRenderingContext2D) {
        const extraHeight = 18; // Covers index number (3 offset + 12 font + buffer)
        context.clearRect(this.x - 1, this.y - 1, (this.cellWidth * this.arraySize) + 2, this.cellHeight + extraHeight);
    }
}


// Vertical Array class, used to help with hashing animations
export class VerticalArray extends Array {

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, contents: any[], protected opacity: number = 1) {
        super(x, y, cellWidth, cellHeight, contents, opacity);
        this.arraySize = contents.length;
        this.cells = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.cells.push(new ArrayCell(this.x, this.y + i * this.cellHeight, this.cellWidth, this.cellHeight, contents[i], this.opacity, "black", "white"));
        }
    }

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        if (drawIndex) {
            let fontSize = Math.min(12, Math.floor(this.cellWidth / 4));
            context.save();
            context.globalAlpha = this.opacity;
            context.fillStyle = 'black';
            context.font = `${fontSize}px Arial`;
            context.textAlign = 'center';
            context.textBaseline = 'top';

            // Print index to the left of the array
            for (let i = 0; i < this.arraySize; i++) {
                context.fillText(i.toString(), this.x - 10, this.y + (this.cellHeight * i) + this.cellHeight / 2);
                const cell = this.cells[i];
                cell.opacity = this.opacity;
                cell.drawCell(context, false);
            }
            context.restore();
        }
    }

    // Clear the array
    clear(context: CanvasRenderingContext2D) {
        // Need to clear more space to account for index numbers
        context.clearRect(this.x - 15, this.y - 1, this.cellWidth + 16, (this.cellHeight * this.arraySize) + 2);
    }
}