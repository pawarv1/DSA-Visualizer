import gsap, { timeline } from 'gsap';
import { ArrayCell, DynamicArrayCell } from './ArrayCell';
import { Array } from './Array';

// Dynamic Array Class, inherits from array class
export class DynamicArray extends Array {
    private capacity: number;
    protected cells: DynamicArrayCell[];

    constructor(x: number, y: number, cellWidth: number, cellHeight: number, contents: any[] = [], opacity: number = 1, initialCapacity: number = contents.length) {
        super(x, y, cellWidth, cellHeight, contents, opacity);
        this.capacity = Math.max(initialCapacity, contents.length);
        this.cells = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.cells.push(new DynamicArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, contents[i], this.opacity, "black", "white"));
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
        context.clearRect(this.x - 1, this.y - 1, (this.cellWidth * this.capacity) + 2, this.cellHeight + extraHeight);
    }

    // Ensure that it can insert at the given index, allowing for insertions at the end of the array
    checkInsertIndex(index: number) {
        if (index < 0 || index > this.arraySize) {
            console.error(`Insert index ${index} is out of bounds (valid range: 0 to ${this.arraySize})`);
            return false;
        }
        return true;
    }


    // Return the capacity of the dynamic array, as opposed to the size
    getCapacity() {
        return this.capacity;
    }

    // Returns true if there are no elements in the array
    isEmpty() {
        return this.arraySize === 0;
    }

    // Search for an element in the dynamic array and return the index of where it was found, or -1 if it was not found
    async search (context: CanvasRenderingContext2D, element: any, iterationSpeed: number = 1) {
        let index = -1;
    
        for (let i = 0; i < this.getArraySize(); i++) {
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
            if (index != -1) {
                break;
            }
        }

        return index;
    }

    // Resize animations when the dynamic array must expand or shrink
    async resize(context: CanvasRenderingContext2D, newCapacity: number) {
        // Do nothing
        if (newCapacity === this.capacity) {
            return;
        }
        // Expand
        if (this.capacity < newCapacity) {
            for (let i = this.capacity; i < newCapacity; i++) {
                this.cells.push(new DynamicArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, "", 0, "black", "white", false));
            }

            const newCells = this.cells.slice(this.capacity);
            await new Promise<void>((resolve) => {
                gsap.to(newCells, {
                    opacity: 1,
                    duration: 1,
                    onUpdate: () => {
                        for (let i = 0; i < newCells.length; i++) {
                            newCells[i].drawCell(context);
                        }
                    },
                    onComplete: () => {
                        this.capacity = newCapacity;
                        resolve();
                    }
                });
            });
        } 
        // Shrink
        else {
            const cellsToRemove = this.cells.slice(newCapacity);

            await new Promise<void>((resolve) => {
                gsap.to(cellsToRemove, {
                    opacity: 0,
                    duration: 1,
                    onUpdate: () => {
                        for (let i = 0; i < cellsToRemove.length; i++) {
                            cellsToRemove[i].drawCell(context);
                        }
                    },
                    onComplete: () => {
                        this.cells.splice(newCapacity);
                        this.capacity = newCapacity;
                        this.draw(context);
                        resolve();
                    }
                });
            });
        }
    }

    // Helper method to help with adding to an empty dynamic array
    private ensureInitialCapacity(): void {
        if (this.capacity === 0) {
            this.cells.push(new DynamicArrayCell(this.x, this.y, 0, this.cellWidth, this.cellHeight, "", this.opacity, "black", "white"));
            this.capacity = 1;
        }
    }

    // Add element to the end of the array
    async append(context: CanvasRenderingContext2D, element: any) {
        this.ensureInitialCapacity();

        // Check if an expansion is necessary, if so double the array capacity
        if (this.arraySize >= this.capacity) {
            await this.resize(context, this.capacity * 2);
        }
        else {
            // Add delay into the animation, may add in a variable for time
            await new Promise<void>((resolve) => {
                setTimeout(() => {resolve()}, 1000);
            });
        }
        
        this.cells[this.arraySize].content = element;
        this.cells[this.arraySize].inUse = true;
        this.cells[this.arraySize].drawCell(context);
        this.arraySize++;
    }

    // Insert an element at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, element: any) {
        if (this.checkInsertIndex(index)) {
            this.ensureInitialCapacity();
            let shiftHappened = false;

            // Check if an expansion is necessary, if so double the array capacity
            if (this.arraySize >= this.capacity) {
                await this.resize(context, this.capacity * 2);
            }

            for (let i = this.arraySize; i > index; i--) {
                // Shift following elements forward one index
                this.cells[i].content = this.cells[i - 1].content;
                this.cells[i].inUse = this.cells[i - 1].inUse;
                this.cells[i - 1].inUse = false;
                this.cells[i - 1].content = "";
                this.cells[i - 1].drawCell(context);
                this.cells[i].drawCell(context);
                shiftHappened = true;
                // Add delay into the animation, may add in a variable for time
                await new Promise<void>((resolve) => {
                    setTimeout((resolve), 1000);
                });
            }

            this.arraySize++;

            // Only add delay if there was not a shift, as that also has delay
            // This keeps timings slightly more consistent
            await new Promise<void>((resolve) => {
                const delay = (shiftHappened)? 0: 1000;
                setTimeout(() => {
                    this.cells[index].content = element;
                    this.cells[index].inUse = true;
                    this.cells[index].drawCell(context);
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

            this.cells[index].content = "";
            this.cells[index].inUse = false;
            this.cells[index].drawCell(context);

            for (let i = index; i < this.arraySize - 1; i++) {
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
                this.cells[i].drawCell(context)
                this.cells[i + 1].drawCell(context);
            }

            this.arraySize--;

            // Check if a shrink is necessary, if so halve the array capacity
            if (this.arraySize > 0 && this.arraySize <= this.capacity / 4) {
                await this.resize(context, Math.floor(this.capacity / 2));
            }
        }
    }

    // Remove and return the element at the end of the array
    async pop(context: CanvasRenderingContext2D) {
        if (this.arraySize <= 0) {
            console.error("Cannot pop from empty array");
            return false;
        }
        else {
            await new Promise<void>((resolve) => {
                setTimeout(() => {resolve()}, 1000);
            });

            this.arraySize--;
            const lastElement = this.cells[this.arraySize].content;
            this.cells[this.arraySize].content = "";
            this.cells[this.arraySize].inUse = false;
            this.cells[this.arraySize].drawCell(context);

            // Check if a shrink is necessary if so halve the array capacity
            if (this.arraySize > 0 && this.arraySize <= this.capacity / 4) {
                await this.resize(context, Math.floor(this.capacity / 2));
            }
            
            return lastElement;
        }
    }

    // Shrink capacity to array size
    async shrinkToFit(context: CanvasRenderingContext2D) {
        await this.resize(context, this.arraySize);
    }

    // Remove the elements in the array, set arraySize to 0, capacity stays the same
    clearAll(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.capacity; i++) {
            this.cells[i].inUse = false;
            this.cells[i].content = "";
        }
        this.arraySize = 0;
        this.draw(context);
    }
}