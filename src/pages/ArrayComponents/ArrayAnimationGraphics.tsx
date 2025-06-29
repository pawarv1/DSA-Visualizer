import gsap, { timeline } from 'gsap';

// This component includes all the classes for the various array related graphics


export function prefixSum(x: number, y: number, cellWidth: number, cellHeight: number, arr: Array, context: CanvasRenderingContext2D, opacity: number = 1, outlineColor: string = 'black') {
    const elements = new window.Array(arr.getArraySize()).fill("");
    const prefixSumArray = new Array(x, y, cellWidth, cellHeight, elements, opacity, outlineColor);
    prefixSumArray.draw(context);

    let timeline = gsap.timeline();
    let sum = 0;

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


export function postfixSum(x: number, y: number, cellWidth: number, cellHeight: number, arr: Array, context: CanvasRenderingContext2D, opacity: number = 1, outlineColor: string = 'black') {
    const elements = new window.Array(arr.getArraySize()).fill("");
    const postfixSumArray = new Array(x, y, cellWidth, cellHeight, elements, opacity, outlineColor);
    postfixSumArray.draw(context);

    let timeline = gsap.timeline();
    let sum = 0;

    for (let i = arr.getArraySize() - 1; i >= 0; i--) {  
        sum += arr.getElementAt(i);
        elements[i] = sum;
        timeline.to(postfixSumArray, {
            duration: 1,
            onUpdate: () => {
                arr.setFillColor(context, i, "yellow");
                postfixSumArray.setElementAt(context, i, elements[i]);
            }
        });
    }
}

// ArrayCell Class
// Can contain any content, but will only use strings and integers for the purpose of the animations
class ArrayCell {
    x: number;
    y: number;
    index: number;
    cellWidth: number;
    cellHeight: number;
    content: any;
    opacity: number;
    outlineColor: string;
    fillColor: string;
    inUse: boolean;

    constructor(x: number, y: number, index: number, cellWidth: number, cellHeight: number, content: any, opacity: number = 1, outlineColor: string = 'black', fillColor: string = 'white', inUse: boolean = true) {
        this.x = x; 
        this.y = y;
        this.index = index;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.content = content;
        this.opacity = opacity;
        this.outlineColor = outlineColor;     
        this.fillColor = fillColor;   
        this.inUse = inUse;
    }

    static type = "ArrayCell";

    // Adjust font size to fit within the cell
    adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16; // Initial font size
        let font = `${fontSize}px Arial`;
        let textWidth = context.measureText(this.content).width;

        // Reduce the font size until the text fits within the cell width, with some padding
        while (textWidth > this.cellWidth - 10 && fontSize > 1) {
            fontSize--;
            font = `${fontSize}px Arial`;
            textWidth = context.measureText(this.content).width;
        }
        return font;
    }

    drawIndex(context: CanvasRenderingContext2D) {
        let fontSize = Math.min(12, Math.floor(this.cellWidth / 4));
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = 'black';
        context.font = `${fontSize}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(this.index.toString(), this.x + this.cellWidth / 2, this.y + this.cellHeight + 3);
        context.restore();
    }

    // Draw the cell, optionally with highlight
    drawCell(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        this.clear(context);
        context.save(); // Save the context state
        context.globalAlpha = this.opacity;
        context.fillStyle = this.inUse ? this.fillColor : "#f0f0f0"; // or dimmed
        context.fillRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = this.adjustFontSize(context);
        context.fillText(this.content, this.x + this.cellWidth / 2, this.y + this.cellHeight / 2);
        context.restore(); // Reset alpha to default

        if (drawIndex) {
            this.drawIndex(context);
        }
    }

    clear(context: CanvasRenderingContext2D) {
        const extraHeight = 18; // 3px offset + ~12px font + 3px buffer
        context.clearRect(this.x, this.y, this.cellWidth, this.cellHeight + extraHeight);
    }
}


//Array Class
export class Array {
    protected arraySize: number;
    protected cells: ArrayCell[];

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, contents: any[], protected opacity: number = 1, protected outlineColor: string = 'black', protected fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.arraySize = contents.length;
        this.opacity = opacity;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
        this.cells = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.cells.push(new ArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, contents[i], this.opacity, this.outlineColor, this.fillColor));
        }
    }

    static type = "Array";

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        this.cells.forEach(cell => {
            cell.opacity = this.opacity;
            cell.outlineColor = this.outlineColor;
            cell.fillColor = this.fillColor;
            cell.drawCell(context, drawIndex);
        });
    }

    // Throws RangeError if index is out of bounds
    checkIndexValidity(index: number) {
        if (index < 0 || index >= this.arraySize) {
            console.error(`Index ${index} is out of bounds (valid range: 0 to ${this.arraySize - 1})`);
            return false;
        }
        return true;
    }

    setElementAt(context: CanvasRenderingContext2D, index: number, newElement: string) {
        if (this.checkIndexValidity(index)) {
            this.cells[index].content = newElement;
            this.cells[index].drawCell(context);
        }
    }

    setOpacity(context: CanvasRenderingContext2D, index: string | number, opacity: number, redraw: boolean = true) {
        if (typeof index === 'string' && index === "all") {
            this.opacity = opacity;
            if (redraw) {
                this.draw(context);
            }
        }
        else if (typeof index === 'number') {
            if (this.checkIndexValidity(index)) {
                this.cells[index].opacity = opacity;

                if (redraw) {
                    this.cells[index].drawCell(context);
                }
            }
        }
    }

    setOutlineColor(context: CanvasRenderingContext2D, index: string | number, outlineColor: string, redraw: boolean = true) {
        if (typeof index === 'string' && index === "all") {
            this.outlineColor = outlineColor;
            if (redraw) {
                this.draw(context);
            }
        }
        else if (typeof index === 'number') {
            if (this.checkIndexValidity(index)) {
                this.cells[index].outlineColor = outlineColor;

                if (redraw) {
                    this.cells[index].drawCell(context);
                }
            }
        }
    }

    setFillColor(context: CanvasRenderingContext2D, index: string | number, fillColor: string, redraw: boolean = true) {
        if (typeof index === 'string') {
            this.fillColor = fillColor;
            if (redraw) {
                this.draw(context);
            }
        }
        else if (typeof index === 'number') {
            if (this.checkIndexValidity(index)) {
                this.cells[index].fillColor = fillColor;

                if (redraw) {
                    this.cells[index].drawCell(context);
                }
            }
        }
    }

    getArraySize() {
        return this.arraySize;
    }

    getElementAt(index: number) {
        if (this.checkIndexValidity(index)) {
            return this.cells[index].content;
        }
    }
    
    async swapElements(context: CanvasRenderingContext2D, index1: number, index2: number) {
        if (this.checkIndexValidity(index1) && this.checkIndexValidity(index2)) {
            const cell1 = this.cells[index1];
            const cell2 = this.cells[index2];
            cell1.fillColor = "yellow";
            cell2.fillColor = "yellow";
            
            const fadeOut = () => new Promise<void>((resolve) => {
                gsap.to([cell1, cell2], {
                    opacity: 0,
                    duration: 1,
                    onUpdate: () => {
                        cell1.clear(context);
                        cell2.clear(context);
                        cell1.drawCell(context);
                        cell2.drawCell(context);
                    },
                    onComplete: () => resolve()
                });
            });

            const swapContent = () => {
                const temp = cell1.content;
                cell1.content = cell2.content;
                cell2.content = temp;
            };

            const fadeIn = () => new Promise<void>((resolve) => {
                gsap.to([cell1, cell2], {
                    opacity: 1,
                    duration: 1,
                    onUpdate: () => {
                        cell1.clear(context);
                        cell2.clear(context);
                        cell1.drawCell(context);
                        cell2.drawCell(context);
                    },
                    onComplete: () => resolve()
                });
            });

            await fadeOut();
            swapContent();
            await fadeIn();
            cell1.fillColor = this.fillColor;
            cell2.fillColor = this.fillColor;
        }
    }

    clear(context: CanvasRenderingContext2D) {
        const extraHeight = 18; // Covers index number (3 offset + 12 font + buffer)
        context.clearRect(this.x - 1, this.y - 1, (this.cellWidth * this.arraySize) + 2, this.cellHeight + extraHeight);
    }
}


// Dynamic Array Class
export class DynamicArray extends Array {
    private capacity: number;

    constructor(x: number, y: number, cellWidth: number, cellHeight: number, contents: any[] = [], opacity: number = 1, outlineColor: string = 'black', fillColor: string = 'white', initialCapacity: number = contents.length) {
        super(x, y, cellWidth, cellHeight, contents, opacity, outlineColor, fillColor);
        this.capacity = Math.max(initialCapacity, contents.length);
    }

    clear(context: CanvasRenderingContext2D) {
        const extraHeight = 18;
        context.clearRect(this.x - 1, this.y - 1, (this.cellWidth * this.capacity) + 2, this.cellHeight + extraHeight);
    }

    checkInsertIndex(index: number) {
        if (index < 0 || index > this.arraySize) {
            console.error(`Insert index ${index} is out of bounds (valid range: 0 to ${this.arraySize})`);
            return false;
        }
        return true;
    }

    getCapacity() {
        return this.capacity;
    }

    async resize(context: CanvasRenderingContext2D, newCapacity: number) {
        return new Promise<void>((resolve) => {
            if (newCapacity === this.capacity) {
                resolve();
                return;
            }
            if (this.capacity < newCapacity) {
                for (let i = this.capacity; i < newCapacity; i++) {
                    this.cells.push(new ArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, "", this.opacity, this.outlineColor, this.fillColor, false));
                }
            } else {
                this.clear(context);
                this.cells.splice(newCapacity);
            }

            this.capacity = newCapacity;
            this.draw(context);
            resolve();
        });
    }

    private ensureInitialCapacity(): void {
        if (this.capacity === 0) {
            this.cells.push(new ArrayCell(this.x, this.y, 0, this.cellWidth, this.cellHeight, "", this.opacity, this.outlineColor, this.fillColor));
            this.capacity = 1;
        }
    }

    async append(context: CanvasRenderingContext2D, element: any, resizeDelay: number = 0) {
        this.ensureInitialCapacity();

        if (this.arraySize >= this.capacity) {
            await this.resize(context, this.capacity * 2);
        }

        await new Promise<void>((resolve) => {
            gsap.delayedCall(resizeDelay, resolve);
        });
        
        this.cells[this.arraySize].content = element;
        this.cells[this.arraySize].inUse = true;
        this.cells[this.arraySize].drawCell(context);
        this.arraySize++;
    }

    async insertAt(context: CanvasRenderingContext2D, index: number, element: any, resizeDelay: number = 0) {
        if (this.checkInsertIndex(index)) {
            this.ensureInitialCapacity();

            if (this.arraySize >= this.capacity) {
                await this.resize(context, this.capacity * 2);
            }

            await new Promise<void>((resolve) => {
                gsap.delayedCall(resizeDelay, resolve);
            });

            for (let i = this.arraySize; i > index; i--) {
                this.cells[i].content = this.cells[i - 1].content;
                this.cells[i].inUse = this.cells[i - 1].inUse;
            }

            this.cells[index].content = element;
            this.cells[index].inUse = true;
            this.arraySize++;

            for (let i = index; i < this.arraySize; i++) {
                this.cells[i].index = i;
                this.cells[i].drawCell(context);
            }
        }
    }

    async removeAt(context: CanvasRenderingContext2D, index: number, resizeDelay: number = 0) {
        if (this.checkIndexValidity(index)) {

            for (let i = index; i < this.arraySize - 1; i++) {
                this.cells[i].content = this.cells[i + 1].content;
                this.cells[i].inUse = this.cells[i + 1].inUse;
                this.cells[i].index = i;
            }

            this.arraySize--;
            this.cells[this.arraySize].content = "";
            this.cells[this.arraySize].inUse = false;

            if (this.arraySize > 0 && this.arraySize <= this.capacity / 4) {
                await new Promise<void>((resolve) => {
                    gsap.delayedCall(resizeDelay, resolve);
                });
                await this.resize(context, Math.floor(this.capacity / 2));
            }

            this.draw(context);
        }
    }

    // Not strictly necessary but useful
    async pop(context: CanvasRenderingContext2D, resizeDelay: number = 0) {
        if (this.arraySize <= 0) {
            console.error("Cannot pop from empty array");
            return;
        }
        else {
            this.arraySize--;
            let lastElement = this.cells[this.arraySize].content;
            this.cells[this.arraySize].content = "";
            this.cells[this.arraySize].inUse = false;

            if (this.arraySize > 0 && this.arraySize <= this.capacity / 4) {
                await new Promise<void>((resolve) => {
                    gsap.delayedCall(resizeDelay, resolve);
                });
                await this.resize(context, Math.floor(this.capacity / 2));
            }
            
            this.cells[this.arraySize].drawCell(context);
            return lastElement;
        }
    }

    // Not strictly necessary but useful
    shrinkToFit(context: CanvasRenderingContext2D) {
        while (this.capacity > this.arraySize) {
            this.cells.pop();
            this.capacity--;
        }
        this.draw(context);
    }

     // Not strictly necessary but useful
    clearAll(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.capacity; i++) {
            this.cells[i].inUse = false;
            this.cells[i].content = "";
        }
        this.arraySize = 0;
        this.draw(context);
    }
}
