import gsap from 'gsap';
import { DynamicArrayCell } from './ArrayCell';
import { StaticArray } from './StaticArray';

// Dynamic Array Class, inherits from array class
export class DynamicArray extends StaticArray {
    protected numElements: number;
    protected arrayLength: number;
    protected cells: DynamicArrayCell[];

    constructor(x: number, y: number, cellWidth: number, cellHeight: number, contents: any[] = [], initialCapacity: number = contents.length, opacity: number = 1,) {
        super(x, y, cellWidth, cellHeight, contents, initialCapacity, opacity);
        this.arrayLength = Math.max(initialCapacity, contents.length);
        this.cells = [];
        this.numElements = contents.length;
        
        for (let i = 0; i < contents.length; i++) {
            this.cells.push(new DynamicArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, contents[i], this.opacity));
        }

        for (let i = contents.length; i < this.arrayLength; i++) {
            this.cells.push(new DynamicArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, "", this.opacity, false));
        }
    }

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        this.cells.forEach(cell => {
            cell.opacity = this.opacity;
            cell.drawCell(context, drawIndex);
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
    checkIndexValidity(index: number) {
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds (valid range: 0 to ${this.numElements - 1})`);
            return false;
        }
        return true;
    }
    
    // Return number of elements in the array, as opposed to its length
    getNumElements() {
        return this.numElements;
    }

    // Returns true if there are no elements in the array
    isEmpty() {
        return this.numElements === 0;
    }

    // Search for an element in the dynamic array and return the index of where it was found, or -1 if it was not found
    async search (context: CanvasRenderingContext2D, element: any, iterationSpeed: number = 1) {
        let index = -1;
    
        for (let i = 0; i < this.numElements; i++) {
            await new Promise<void>((resolve) => {
                gsap.to(this, {
                    duration: iterationSpeed,
                    onUpdate: () => {
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
                        this.setOutlineColor(context, i, "black");
                        this.setFillColor(context, i, "white");
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
    private async resize(context: CanvasRenderingContext2D, newCapacity: number, drawIndex: boolean = true) {
        // Do nothing
        if (newCapacity === this.arrayLength) {
            return;
        }

        let newArr = new DynamicArray(this.x, this.y + 2 * this.cellHeight, this.cellWidth, this.cellHeight, [], newCapacity, 0);

        this.draw(context, drawIndex);

        // Fade in the new array
        await new Promise<void>((resolve) => {
            gsap.to(newArr, {
                opacity: this.opacity,
                duration: 1,
                onUpdate: () => {
                    newArr.draw(context, drawIndex);
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

            // Set destination cell inUse, so that it can hightlight properly
            timeline.to(destination, {
                onStart: () => {
                    destination.inUse = true;
                }
            });
            
            // Highlight source cell
            timeline.to(source, {
                outlineColor: "red",
                fillColor: "yellow",
                duration: 1,
                onUpdate: () => {
                    source.drawCell(context, drawIndex);
                }
            });

            // Highlight destination cell
            timeline.to(destination, {
                outlineColor: "red",
                fillColor: "yellow",
                duration: 1,
                onUpdate: () => {
                    destination.drawCell(context, drawIndex);
                }
            });

            // Object to help with moving the element between array cells
            const heightTracker = {currHeight: source.y + source.cellHeight + 2};
          
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
                    source.drawCell(context, drawIndex);
                    destination.drawCell(context, drawIndex);
                    context.fillText(source.content, source.x + source.cellWidth / 2, heightTracker.currHeight);
                },
                onComplete: () => {
                    context.restore();
                    source.outlineColor = "black";
                    source.fillColor = "white";
                    source.drawCell(context, drawIndex)
                    destination.outlineColor = "black";
                    destination.fillColor = "white";
                    destination.content = source.content;
                    destination.drawCell(context, drawIndex);
                    resolve()
                }
            });
        });

        // Copy all the elemnts
        for (let i = 0; i < this.numElements; i++) {
            await copyElement(i);
        }

        // Fade out the old array
        await new Promise<void>((resolve) => {
            gsap.to(this, {
                opacity: 0,
                duration: 1,
                onUpdate: () => {
                    this.draw(context, drawIndex);
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
                    newArr.draw(context, drawIndex);
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
            this.cells.push(new DynamicArrayCell(this.x, this.y, 0, this.cellWidth, this.cellHeight, "", this.opacity));
            this.arrayLength = 1;
        }
    }

    // Add element to the end of the array
    async append(context: CanvasRenderingContext2D, element: any, drawIndex: boolean = true) {
        this.ensureInitialCapacity();

        // Check if an expansion is necessary, if so double the array arrayLength
        if (this.numElements >= this.arrayLength) {
            await this.resize(context, this.arrayLength * 2, drawIndex);
        }
        else {
            // Add delay into the animation, may add in a variable for time
            await new Promise<void>((resolve) => {
                setTimeout(() => {resolve()}, 1000);
            });
        }
        
        this.cells[this.numElements].content = element;
        this.cells[this.numElements].inUse = true;
        this.cells[this.numElements].drawCell(context, drawIndex);
        this.numElements++;
    }

    // Insert an element at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, element: any, drawIndex: boolean = true) {
        if (this.checkInsertIndex(index)) {
            this.ensureInitialCapacity();
            let shiftHappened = false;

            // Check if an expansion is necessary, if so double the array arrayLength
            if (this.numElements >= this.arrayLength) {
                await this.resize(context, this.arrayLength * 2, drawIndex);
            }

            for (let i = this.numElements; i > index; i--) {
                // Shift following elements forward one index
                this.cells[i].content = this.cells[i - 1].content;
                this.cells[i].inUse = this.cells[i - 1].inUse;
                this.cells[i - 1].inUse = false;
                this.cells[i - 1].content = "";
                this.cells[i - 1].drawCell(context, drawIndex);
                this.cells[i].drawCell(context, drawIndex);
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
                    this.cells[index].inUse = true;
                    this.cells[index].drawCell(context, drawIndex);
                    resolve();
                }, delay);
            });
        }
    }

    // Remove element at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, drawIndex: boolean = true) {
        if (this.checkIndexValidity(index)) {

            await new Promise<void>((resolve) => {
                setTimeout(() => {resolve()}, 1000);
            });

            this.cells[index].content = "";
            this.cells[index].inUse = false;
            this.cells[index].drawCell(context, drawIndex);

            for (let i = index; i < this.numElements - 1; i++) {
                // Add delay into the animation, may add in a variable for time
                await new Promise<void>((resolve) => {
                    setTimeout(() => {resolve()}, 1000);
                });
                // Shift following elements one index back
                this.cells[i].content = this.cells[i + 1].content;
                this.cells[i].inUse = this.cells[i + 1].inUse;
                this.cells[i].index = i;
                this.cells[i + 1].content = "";
                this.cells[i + 1].inUse = false;
                this.cells[i].drawCell(context, drawIndex)
                this.cells[i + 1].drawCell(context, drawIndex);
            }

            this.numElements--;

            // Check if a shrink is necessary, if so halve the array arrayLength
            if (this.numElements > 0 && this.numElements <= this.arrayLength / 4) {
                await this.resize(context, Math.floor(this.arrayLength / 2), drawIndex);
            }
        }
    }

    // Remove and return the element at the end of the array
    async pop(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        if (this.numElements <= 0) {
            console.warn("Cannot pop from empty array");
            return false;
        }
        else {
            await new Promise<void>((resolve) => {
                setTimeout(() => {resolve()}, 1000);
            });

            this.numElements--;
            const lastElement = this.cells[this.numElements].content;
            this.cells[this.numElements].content = "";
            this.cells[this.numElements].inUse = false;
            this.cells[this.numElements].drawCell(context, drawIndex);

            // Check if a shrink is necessary if so halve the array arrayLength
            if (this.numElements > 0 && this.numElements <= this.arrayLength / 4) {
                await this.resize(context, Math.floor(this.arrayLength / 2), drawIndex);
            }
            
            return lastElement;
        }
    }

    // Shrink arrayLength to array size
    async shrinkToFit(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        await this.resize(context, this.numElements, drawIndex);
    }

    // Remove the elements in the array, set size to 0, arrayLength stays the same
    clearAll(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        for (let i = 0; i < this.arrayLength; i++) {
            this.cells[i].inUse = false;
            this.cells[i].content = "";
        }
        this.numElements = 0;
        this.draw(context, drawIndex);
    }
}