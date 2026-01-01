import gsap, { timeline } from 'gsap';
import { ArrayCell } from './ArrayCell';

// Array Class
export class Array {
    protected readonly arraySize: number;
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
            this.cells.push(new ArrayCell(this.x + i * this.cellWidth, this.y, this.cellWidth, this.cellHeight, contents[i], this.opacity));
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
    // TODO May make access of this method protected after testing
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
            // Set clearExtra to false so index numbers are not cleared if they are used
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
                    // Set clearExtra to false so index numbers are not cleared if they are used
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
                // Set clearExtra to false so index numbers are not cleared if they are used
                this.cells[index].drawCell(context, false);
            }
        }
    }

    // Change fill color of an individual cell
    setFillColor(context: CanvasRenderingContext2D, index: number, fillColor: string, redraw: boolean = true) {
        if (this.checkIndexValidity(index)) {
            this.cells[index].fillColor = fillColor;

            if (redraw) {
                // Set clearExtra to false so index numbers are not cleared if they are used
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
                        // Set clearExtra to false so index numbers are not cleared if they are used
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
                        // Set clearExtra to false so index numbers are not cleared if they are used
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