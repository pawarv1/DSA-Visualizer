import gsap from 'gsap';
import { DynamicArrayCell } from './ArrayCell';
import { StaticArray } from './StaticArray';

// Dynamic Array Class, inherits from array class
export class DynamicArray<T> extends StaticArray<T> {
    protected numElements: number;
    protected arrayLength: number;
    protected cells: DynamicArrayCell<T | null>[];

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, contents: T[] = [], initialCapacity: number = contents.length, protected opacity: number = 1, protected drawIndex: boolean = true) {
        super(x, y, cellWidth, cellHeight, contents, initialCapacity, opacity, drawIndex);
        this.arrayLength = Math.max(initialCapacity, contents.length);
        this.cells = [];
        this.numElements = contents.length;
        
        for (let i = 0; i < contents.length; i++) {
            this.cells.push(new DynamicArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, contents[i], this.opacity));
        }

        for (let i = contents.length; i < this.arrayLength; i++) {
            this.cells.push(new DynamicArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, null, this.opacity));
        }
    }

    draw(context: CanvasRenderingContext2D) {
        this.cells.forEach(cell => {
            cell.opacity = this.opacity;
            cell.drawCell(context, this.drawIndex);
        });
    }

    // Clear the dynamic array
    clear(context: CanvasRenderingContext2D) {
        // Add extra height to clear the index numbers below the array cells
        const extraHeight = 18;
        context.clearRect(this.x - 1, this.y - 1, (this.cellWidth * this.arrayLength) + 2, this.cellHeight + extraHeight);
    }

    // Ensure that it can insert at the given index, allowing for insertions at the end of the array
    // TODO May make access of this method protected after testing
    checkInsertIndex(index: number) {
        if (index < 0 || index > this.numElements) {
            console.error(`Insert index ${index} is out of bounds (valid range: 0 to ${this.numElements})`);
            return false;
        }
        return true;
    }

    // Ensure that there is an element at the given index
    checkIndexValidity(index: number): boolean {
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds (valid range: 0 to ${this.numElements - 1})`);
            return false;
        }
        return true;
    }
    
    // Return number of elements in the array, as opposed to its length
    getNumElements(): number {
        return this.numElements;
    }

    // Returns true if there are no elements in the array
    isEmpty(): boolean {
        return this.numElements === 0;
    }

    // Search for an element in the dynamic array and return the index of where it was found, or -1 if it was not found
    async search (context: CanvasRenderingContext2D, element: T, iterationSpeed: number = 1): Promise<number> {
        let index = -1;
    
        for (let i = 0; i < this.numElements; i++) {
            const oldOutline = this.cells[i].outlineColor;
            const oldFill = this.cells[i].fillColor;

            await new Promise<void>((resolve) => {
                gsap.to(this, {
                    duration: iterationSpeed,
                    onStart: () => {
                        this.setOutlineColor(context, i, "red");
                        this.setFillColor(context, i, "yellow");
                        
                        // Element was found
                        if (this.cells[i].content === element) {
                            index = i;
                            this.setOutlineColor(context, i, "black");
                            this.setFillColor(context, i, "lightgreen");
                        }
                    },
                    onComplete: () => {
                        // Reset outline and fill color when finished
                        this.setOutlineColor(context, i, oldOutline);
                        this.setFillColor(context, i, oldFill);
                        resolve();
                    }
                });
            });

            // Break out of the loop if the element was found
            if (index !== -1) {
                break;
            }
        }

        return index;
    }

    // Resize animations when the dynamic array must expand or shrink
    private async resize(context: CanvasRenderingContext2D, newCapacity: number) {
        // Do nothing
        if (newCapacity === this.arrayLength) {
            return;
        }

        let newArr = new DynamicArray<T>(this.x, this.y + 2 * this.cellHeight, this.cellWidth, this.cellHeight, [], newCapacity, 0, this.drawIndex);

        this.draw(context);

        // Fade in the new array
        await new Promise<void>((resolve) => {
            gsap.to(newArr, {
                opacity: this.opacity,
                duration: 1,
                onUpdate: () => {
                    newArr.draw(context);
                },
                onComplete: () => {
                    resolve();
                }
            });
        });

        const copyElement = (index: number) => new Promise<void>((resolve) => {
            const source = this.cells[index];
            const destination = newArr.cells[index];
            const timeline = gsap.timeline();
            
            // Highlight source cell
            timeline.to(source, {
                outlineColor: "red",
                fillColor: "yellow",
                duration: 1,
                onUpdate: () => {
                    source.drawCell(context, this.drawIndex);
                }
            });

            // Highlight destination cell
            timeline.to(destination, {
                outlineColor: "red",
                fillColor: "yellow",
                duration: 1,
                onUpdate: () => {
                    destination.drawCell(context, this.drawIndex);
                }
            });

            // Object to help with moving the element between array cells
            const heightTracker = {currHeight: source.y + source.cellHeight + 2};
            const displayContent = (source.content === null)? "": String(source.content);
          
            // Slide the element from the source to the destination cell
            timeline.to(heightTracker, {
                currHeight: destination.y + destination.cellHeight / 2,
                duration: 1,
                onStart: () => {
                    context.save();
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.font = source.font;
                },
                onUpdate: () => {
                    context.clearRect(source.x - 1, source.y + source.cellHeight + 2,  destination.cellWidth + 2, destination.y - (source.y + source.cellHeight + 1));
                    source.drawCell(context, this.drawIndex);
                    destination.drawCell(context, this.drawIndex);
                    context.fillText(displayContent, source.x + source.cellWidth / 2, heightTracker.currHeight);
                },
                onComplete: () => {
                    context.restore();
                    source.outlineColor = "black";
                    source.fillColor = "white";
                    source.drawCell(context, this.drawIndex);
                    destination.outlineColor = "black";
                    destination.fillColor = "white";
                    destination.content = source.content;
                    destination.drawCell(context, this.drawIndex);
                    resolve()
                }
            });
        });

        // Copy all the elements
        for (let i = 0; i < this.numElements; i++) {
            await copyElement(i);
        }

        // Fade out the old array
        await new Promise<void>((resolve) => {
            gsap.to(this, {
                opacity: 0,
                duration: 1,
                onUpdate: () => {
                    this.draw(context);
                },
                onComplete: resolve
            });
        });

        // Move the new array to the old location
        await new Promise<void>((resolve) => {
            gsap.to(newArr.cells, {
                y: this.y,
                duration: 1,
                onUpdate: () => {
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    newArr.draw(context);
                },
                onComplete: resolve
            });
        });

        // Make the old array the same as the new array
        this.cells = newArr.cells;
        this.arrayLength = newCapacity;
        this.opacity = newArr.opacity;
    }

    // Helper method to help with adding to an empty dynamic array
    private ensureInitialCapacity(): void {
        if (this.arrayLength === 0) {
            this.cells.push(new DynamicArrayCell<T | null>(this.x, this.y, 0, this.cellWidth, this.cellHeight, null, this.opacity));
            this.arrayLength = 1;
        }
    }

    // Add element to the end of the array
    async append(context: CanvasRenderingContext2D, element: T) {
        this.ensureInitialCapacity();

        // Check if an expansion is necessary, if so double the array arrayLength
        if (this.numElements >= this.arrayLength) {
            await this.resize(context, this.arrayLength * 2);
        }
        else {
            // Add delay into the animation, may add in a variable for time
            await new Promise<void>((resolve) => {
                setTimeout(() => {resolve()}, 1000);
            });
        }
        
        this.cells[this.numElements].content = element;
        this.cells[this.numElements].drawCell(context, this.drawIndex);
        this.numElements++;
    }

    // Insert an element at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, element: T) {
        if (this.checkInsertIndex(index)) {
            this.ensureInitialCapacity();
            let shiftHappened = false;

            // Check if an expansion is necessary, if so double the array arrayLength
            if (this.numElements >= this.arrayLength) {
                await this.resize(context, this.arrayLength * 2);
            }

            for (let i = this.numElements; i > index; i--) {
                // Shift following elements forward one index
                this.cells[i].content = this.cells[i - 1].content;
                this.cells[i - 1].content = null;
                this.cells[i - 1].drawCell(context, this.drawIndex);
                this.cells[i].drawCell(context, this.drawIndex);
                shiftHappened = true;
                // Add delay into the animation, may add in a variable for time
                await new Promise<void>((resolve) => setTimeout(resolve, 1000));
            }

            this.numElements++;

            // Only add delay if there was not a shift, as that also has delay
            // This keeps timings slightly more consistent
            await new Promise<void>((resolve) => {
                const delay = (shiftHappened)? 0: 1000;
                setTimeout(() => {
                    this.cells[index].content = element;
                    this.cells[index].drawCell(context, this.drawIndex);
                    resolve();
                }, delay);
            });
        }
    }

    // Remove element at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number) {
        if (this.checkIndexValidity(index)) {

            await new Promise<void>((resolve) => {
                setTimeout(() => {resolve()}, 1000);
            });

            this.cells[index].content = null;
            this.cells[index].drawCell(context, this.drawIndex);

            for (let i = index; i < this.numElements - 1; i++) {
                // Add delay into the animation, may add in a variable for time
                await new Promise<void>((resolve) => {
                    setTimeout(() => {resolve()}, 1000);
                });
                // Shift following elements one index back
                this.cells[i].content = this.cells[i + 1].content;
                this.cells[i + 1].content = null;
                this.cells[i].drawCell(context, this.drawIndex)
                this.cells[i + 1].drawCell(context, this.drawIndex);
            }

            this.numElements--;

            // Check if a shrink is necessary, if so halve the array arrayLength
            if (this.numElements > 0 && this.numElements <= this.arrayLength / 4) {
                await this.resize(context, Math.floor(this.arrayLength / 2));
            }
        }
    }

    // Remove and return the element at the end of the array
    async pop(context: CanvasRenderingContext2D): Promise<T | null | undefined> {
        if (this.numElements <= 0) {
            console.warn("Cannot pop from empty array");
            return undefined;
        }
        else {
            await new Promise<void>((resolve) => {
                setTimeout(() => {resolve()}, 1000);
            });

            this.numElements--;
            const lastElement = this.cells[this.numElements].content;
            this.cells[this.numElements].content = null;
            this.cells[this.numElements].drawCell(context, this.drawIndex);

            // Check if a shrink is necessary if so halve the array arrayLength
            if (this.numElements > 0 && this.numElements <= this.arrayLength / 4) {
                await this.resize(context, Math.floor(this.arrayLength / 2));
            }
            
            return lastElement;
        }
    }

    // Shrink arrayLength to array size
    async shrinkToFit(context: CanvasRenderingContext2D) {
        await this.resize(context, Math.max(1, this.numElements));
    }

    // Remove the elements in the array, set size to 0, arrayLength stays the same
    clearAll(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.arrayLength; i++) {
            this.cells[i].content = null;
        }
        this.numElements = 0;
        this.draw(context);
    }
}