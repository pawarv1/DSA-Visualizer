import gsap from 'gsap';
import { ArrayCell } from '../ArrayComponents/ArrayCell';

class OABucketArrayCell extends ArrayCell {
    // State variable can be Empty ("E"), Full ("F"), or Tombstone ("T")
    state: string = "E";

    constructor(x: number, y: number, cellWidth: number, cellHeight: number, content: any, opacity: number = 1, outlineColor: string = 'black', fillColor: string = 'white') {
        super(x, y, cellWidth, cellHeight, content, opacity, outlineColor, fillColor);
    }

    // Adjust font size to fit within the cell
    protected adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16;

        context.save();
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        while (fontSize > 1) {
            const font = `${fontSize}px Arial`;
            context.font = font;
            const textWidth = context.measureText(String(this.content)).width;
            if (textWidth <= this.cellWidth - 10) {
                context.restore();
                return font;
            }
            fontSize--;
        }

        context.restore();
        return `1px Arial`;
    }

    // Draw the cell
    drawCell(context: CanvasRenderingContext2D, clearExtra: boolean = true) {
        const displayContent = this.state === "T" ? "🪦" : this.content;
        const displayFillColor = this.state === "T" ? "#f0f0f0": this.fillColor;
        this.clear(context, clearExtra);
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = displayFillColor;
        context.fillRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = this.adjustFontSize(context);
        context.fillText(displayContent, this.x + this.cellWidth / 2, this.y + this.cellHeight / 2);
        context.restore();
    }

    clear(context: CanvasRenderingContext2D, extraHeightNeeded: boolean = true) {
        // Clear extra space to remove index numbers (if they are drawn)
        if (extraHeightNeeded) {
            // Have to add extra height to account for index numbers below the cells
            const extraHeight = 18; // 3px offset + ~12px font + 3px buffer
            context.clearRect(this.x - 1, this.y - 1, this.cellWidth + 2, this.cellHeight + extraHeight);
        }
        // Just clear the array cell
        else {
            context.clearRect(this.x - 1, this.y - 1, this.cellWidth + 2, this.cellHeight + 2);
        }
    }
}

export class OABucketArray {
    protected arraySize: number;
    protected cells: OABucketArrayCell[];

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, size: number, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.arraySize = size;
        this.opacity = opacity;
        this.cells = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.cells.push(new OABucketArrayCell(this.x, this.y + i * this.cellHeight, this.cellWidth, this.cellHeight, "", this.opacity));
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
            const cell = this.cells[i];
            cell.x = this.x;
            cell.y = this.y + i * this.cellHeight;
            cell.opacity = this.opacity;
            cell.drawCell(context, false);
            if (drawIndex) {
                // Print index to the left of the array
                context.fillText(i.toString(), this.x - 10, this.y + (this.cellHeight * i) + this.cellHeight * 2/3);
            }
        }
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

    // Insert a key into the cell
    fillCell(context: CanvasRenderingContext2D, index: number, newElement: any) {
        if (this.checkIndexValidity(index)) {
            this.cells[index].state = "F";
            this.cells[index].content = newElement;
            // Set clearExtra to false so index numbers are not cleared if they are used
            this.cells[index].drawCell(context, false);
        }
    }

    // Make the cell empty
    emptyCell(context: CanvasRenderingContext2D, index: number) {
        if (this.checkIndexValidity(index)) {
            this.cells[index].state = "E";
            this.cells[index].content = "";
            // Set clearExtra to false so index numbers are not cleared if they are used
            this.cells[index].drawCell(context, false);
        }
    }

    // Make the cell a tombstone
    tombstoneCell(context: CanvasRenderingContext2D, index: number) {
        if (this.checkIndexValidity(index)) {
            this.cells[index].state = "T";
            this.cells[index].content = "";
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

    getStateAt(index: number) {
        if (this.checkIndexValidity(index)) {
            return this.cells[index].state;
        }
    }

    // Change the fill and outline color of a cell for a duration of time, before it reverts back to the original colors
    async highlightCellFor(context: CanvasRenderingContext2D, index: number, duration: number = 1, outlineColor = "red", fillColor = "yellow"): Promise<void> {
        if (!this.checkIndexValidity(index)) return;

        const cell = this.cells[index];
        const oldOutline = cell.outlineColor;
        const oldFill = cell.fillColor;

        /*
        this.setOutlineColor(context, index, outlineColor, false);
        this.setFillColor(context, index, fillColor, false);
        cell.drawCell(context, false);
        */

        await new Promise<void>((resolve) => {
            /*
            gsap.delayedCall(duration, () => {
                this.setOutlineColor(context, index, oldOutline, false);
                this.setFillColor(context, index, oldFill, false);
                cell.drawCell(context, false);
                resolve();
            });
            */

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
    
    // Clear the array
    clear(context: CanvasRenderingContext2D) {
        // Need to clear more space to account for index numbers
        context.clearRect(this.x - 15, this.y - 1, this.cellWidth + 16, (this.cellHeight * this.arraySize) + 2);
    }
}
