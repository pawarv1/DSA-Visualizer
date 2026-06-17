import gsap from 'gsap';
import { ArrayCell } from './ArrayCell';

// Array Class
export class StaticArray {
    protected readonly arrayLength: number;
    protected cells: ArrayCell[];

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, contents: any[], initialSize: number = contents.length, protected opacity: number = 1) {
        this.arrayLength = Math.max(initialSize, contents.length);
        this.cells = [];

        for (let i = 0; i < this.arrayLength; i++) {
            this.cells.push(new ArrayCell(this.x + i * this.cellWidth, this.y, this.cellWidth, this.cellHeight, contents[i] ?? "", this.opacity));
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

        for (let i = 0; i < this.arrayLength; i++) {
            this.cells[i].opacity = this.opacity;
            this.cells[i].drawCell(context);
            if (drawIndex) {
                // Print index numbers below array cells
                context.fillText(i.toString(), this.x + (this.cellWidth * i) + this.cellWidth / 2, this.y + this.cellHeight + 3);
            }
        }
        context.restore();
    }

    // Throws RangeError if index is out of bounds
    // TODO May make access of this method protected after testing
    checkIndexValidity(index: number) {
        if (index < 0 || index >= this.arrayLength) {
            console.error(`Index ${index} is out of bounds (valid range: 0 to ${this.arrayLength - 1})`);
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
    setOpacity(context: CanvasRenderingContext2D, index: "all" | number, opacity: number, redraw: boolean = true) {
        // All cells
        if (index === "all") {
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

    getArrayLength() {
        return this.arrayLength;
    }

    // Return the element at the given index
    getElementAt(index: number) {
        if (this.checkIndexValidity(index)) {
            return this.cells[index].content;
        }
    }

    // Change the fill and outline color of a cell for a duration of time, before it reverts back to the original colors
    async highlightCellFor(context: CanvasRenderingContext2D, index: number, duration: number = 1, outlineColor = "red", fillColor = "yellow"): Promise<void> {
        if (!this.checkIndexValidity(index)) return;

        const cell = this.cells[index];
        const oldOutline = cell.outlineColor;
        const oldFill = cell.fillColor;

        await new Promise<void>((resolve) => {
            gsap.to(this, {
                duration: duration,
                onUpdate: () => {
                    this.setOutlineColor(context, index, outlineColor, true);
                    this.setFillColor(context, index, fillColor, true);
                },
                onComplete: () => {
                    // Set the outline and fill color back to normal when finished
                    this.setOutlineColor(context, index, oldOutline, true);
                    this.setFillColor(context, index, oldFill, true);
                    cell.drawCell(context, false);
                    resolve();
                }
            });
        });
    }

    // Traverse through the array and print each element
    // Hightlight and change outline color of the current element
    async print(context: CanvasRenderingContext2D, iterationSpeed: number = 1) {
        await new Promise<void>((resolve) => {
            // Resolve after the timeline animation completes
            const timeline = gsap.timeline({onComplete: () => { resolve() }});
        
            for (let i = 0; i < this.getArrayLength(); i++) {
                timeline.to(this, {
                    duration: iterationSpeed,
                    onStart: () => {
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
                    opacity: this.opacity,
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

            cell1.fillColor = "white";
            cell2.fillColor = "white";
            cell1.drawCell(context, false);
            cell2.drawCell(context, false);
        }
    }

    // Clear the array
    clear(context: CanvasRenderingContext2D) {
        const extraHeight = 18; // Covers index number (3 offset + 12 font + buffer)
        context.clearRect(this.x - 1, this.y - 1, (this.cellWidth * this.arrayLength) + 2, this.cellHeight + extraHeight);
    }
}