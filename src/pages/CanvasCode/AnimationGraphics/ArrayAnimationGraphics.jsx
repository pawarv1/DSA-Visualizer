import gsap from 'gsap';
import { Timeline } from 'gsap/gsap-core';
import { Text } from './GeneralAnimationGraphics';

/*
This component includes all the classes for the various array related graphics
*/


//FIXME may not need to clear in the draw


// Function to adjust font size based on content and cell dimensions
/*
function adjustFontSize(context, content, boxWidth) {
    let fontSize = 16; // Start with a default font size
    context.font = `${fontSize}px Arial`;
    let metrics = context.measureText(content);
    let textWidth = metrics.width;

    // Reduce font size until the text fits within the cell width
    while (textWidth > boxWidth && fontSize > 1) {
        fontSize--; // Decrease font size
        context.font = `${fontSize}px Arial`; // Update font size in context
        metrics = context.measureText(content); // Recalculate text metrics
        textWidth = metrics.width;
    }

    return context.font; // Return the adjusted font
}
*/


export function prefixSum(x, y, cellWidth, cellHeight, arr, context, opacity = 1, outlineColor = 'black') {
    const elements = new window.Array(arr.arraySize).fill("");
    const prefixSumArray = new Array(x, y, cellWidth, cellHeight, elements, opacity, outlineColor);
    prefixSumArray.draw(context);

    let timeline = gsap.timeline();

    let sum = 0;

    for (let i = 0; i < arr.arraySize; i++) {  
        sum += arr.contents[i];
        elements[i] = sum;
        timeline.to(prefixSumArray, {
            duration: 1,
            onUpdate: () => {
                arr.cells[i].drawCell(context, false, true);
                prefixSumArray.changeElement(context, i, elements[i]);
            }
        });
    }
}


export function suffixSum(x, y, cellWidth, cellHeight, arr, context, opacity = 1, outlineColor = 'black') {
    const elements = new window.Array(arr.arraySize).fill("");
    const suffixSumArray = new Array(x, y, cellWidth, cellHeight, elements, opacity, outlineColor);
    suffixSumArray.draw(context);

    let timeline = gsap.timeline();

    let sum = 0;

    for (let i = arr.arraySize - 1; i >= 0; i--) {  
        sum += arr.contents[i];
        elements[i] = sum;
        timeline.to(suffixSumArray, {
            duration: 1,
            onUpdate: () => {
                arr.cells[i].drawCell(context, false, true);
                suffixSumArray.changeElement(context, i, elements[i]);
            }
        });
    }
}


export function linearSearch(arr, target, context) {
    arr.draw(context);
    
    function searchStep(currIndex) {
        arr.cells[currIndex].drawCell(context, true);
        if (arr.contents[currIndex] == target) {
            setTimeout(() => {
                arr.cells[currIndex].drawCell(context, true, false, "lightgreen");
            }, 1000);
        }
        else {
            if (currIndex == arr.arraySize - 1) {
                setTimeout(() => {
                    arr.cells[currIndex].drawCell(context, true, false, "red");
                }, 1000);
            }
            else {
                setTimeout(() => {
                    searchStep(currIndex + 1)
                    arr.cells[currIndex].opacity = 0.25;
                    arr.cells[currIndex].drawCell(context);
                }, 1000);
            }
        }
    }

    setTimeout(() => searchStep(0), 1000);
}


export function binarySearch(arr, target, context) {

    arr.draw(context);

    function searchStep(low, high) {
        if (low >  high) {
            return;
        }

        let middle = Math.floor((low + high) / 2);
        arr.cells[low].drawCell(context, true);
        arr.cells[high].drawCell(context, true);
        arr.cells[middle].drawCell(context, true, false, "lightblue");
        
        if (arr.contents[middle] < target) {
            setTimeout(() => {
                for (let i = low; i < middle + 1; i++) {
                    arr.cells[i].opacity = 0.25;
                    arr.cells[i].drawCell(context);
                }
                searchStep(middle + 1, high)
            }, 1500);
        }
        else if (arr.contents[middle] > target) {
            setTimeout(() => {
                for (let i = high; i > middle - 1; i--) {
                    arr.cells[i].opacity = 0.25;
                    arr.cells[i].drawCell(context);
                }
                searchStep(low, middle - 1)
            }, 1500);
        }
        else {
            setTimeout(() => {
                arr.cells[middle].drawCell(context, true, false, "lightgreen");
                for (let i = 0; i < arr.arraySize; i++) {
                    if (i != middle) {
                        arr.cells[i].opacity = 0.25;
                        arr.cells[i].drawCell(context);
                    }
                }
            }, 1500);
        }

        
    }
    setTimeout(() => searchStep(0, arr.arraySize - 1), 1000);
}


// ADD ARROWS 
// Given a sorted array arr (sorted in ascending order) and a target, find if there exists any pair of elements (arr[i], arr[j]) such that their sum is equal to the target.
export function TwoPointers(arr, targetSum, context) {
    arr.draw(context);
    const myArray = arr.contents;
    let i = 0;
    let j = myArray.length - 1;

    arr.cells[i].drawCell(context, true);
    arr.cells[j].drawCell(context, true);

    function updatePointers() {
        if (i != j) {
            if (myArray[i] + myArray[j] < targetSum) {
                arr.cells[i].opacity = 0.25;
                arr.cells[i].drawCell(context); // Redraw previous index
                i++;
                arr.cells[i].drawCell(context, true); // Highlight new index
                setTimeout(updatePointers, 1000); // Wait and then update again
            } else if (myArray[i] + myArray[j] > targetSum) {
                arr.cells[j].opacity = 0.25;
                arr.cells[j].drawCell(context); // Redraw previous index
                j--;
                arr.cells[j].drawCell(context, true); // Highlight new index
                setTimeout(updatePointers, 1000); // Wait and then update again
            } else {
                arr.cells[i].drawCell(context, true, false, "lightgreen");
                arr.cells[j].drawCell(context, true, false, "lightgreen");
            }
        } else {
            arr.cells[i].drawCell(context, true, false, "red");
        }
    }

    setTimeout(updatePointers, 1000); // Start the first update
}


// ArrayCell Class
class ArrayCell {
    constructor(x, y, cellWidth, cellHeight, content, opacity = 1, outlineColor = 'black') {
        this.x = x; 
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.content = content;
        this.opacity = opacity;
        this.outlineColor = outlineColor;        
    }

    static type = "arrayCell";

    setElement(context, newElement) {
        this.content = newElement;
        this.drawCell(context);
    }

    // Adjust font size to fit within the cell
    adjustFontSize(context) {
        let fontSize = 16; // Initial font size
        context.font = `${fontSize}px Arial`;
        let textWidth = context.measureText(this.content).width;

        // Reduce the font size until the text fits within the cell width
        while (textWidth > this.cellWidth - 10 && fontSize > 1) { // Leave some padding
            fontSize--;
            context.font = `${fontSize}px Arial`;
            textWidth = context.measureText(this.content).width;
        }
        return context.font;
    }

    // Draw the cell, optionally with highlight
    drawCell(context, highlight = false, outlineHighlight = false, highlightColor = "yellow", outlineHighlightColor = "red") {
        context.save(); // Save current state of the canvas
        this.clear(context);

        if (highlight) {
            context.fillStyle = highlightColor;
            context.fillRect(this.x, this.y, this.cellWidth, this.cellHeight);
        }
        
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'black';
        context.globalAlpha = this.opacity;

        if (outlineHighlight) {
            context.strokeStyle = outlineHighlightColor;
        }
        else {
            context.strokeStyle = this.outlineColor;
        }

        // Adjust font size based on content and cell dimensions
        const font = this.adjustFontSize(context);
        context.font = font;

        context.strokeRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.fillText(this.content, this.x + this.cellWidth / 2, this.y + this.cellHeight / 2);

        context.restore(); // Restore original state
    }

    clear(context) { 
        context.clearRect(this.x, this.y, this.cellWidth, this.cellHeight);
    }
}


//Array Class
export class Array {
    constructor(x, y, cellWidth, cellHeight, contents, opacity = 1, outlineColor = 'black') {
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.contents = contents;
        this.arraySize = contents.length;
        this.opacity = opacity;
        this.outlineColor = outlineColor;
        this.cells = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.cells.push(new ArrayCell(this.x + i * this.cellWidth, this.y, this.cellWidth, this.cellHeight, contents[i], this.opacity, this.outlineColor));
        }
    }

    static type = "array";

    draw(context) {
        this.cells.forEach(cell => {
            cell.opacity = this.opacity;
            cell.drawCell(context)
        });
    }

    hightlightIndex(context, index) {
        this.cells[index].drawCell(context, true);
    }

    // FixMe: There is no error handling here for index out of bounds
    changeElement(context, index, newElement) {
        this.cells[index].setElement(context, newElement);
    }

    clear(context) {
        context.clearRect(this.x, this.y, this.cellWidth * this.arraySize, this.cellHeight);
    }
}