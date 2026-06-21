import { DynamicArrayCell } from "../ArrayComponents/ArrayCell";
import { StaticArray } from "../ArrayComponents/StaticArray";
import gsap from "gsap";

export class DynamicArrayDeque<T> extends StaticArray<T> {
    protected numElements: number = 0;
    protected front: number = 0;
    protected rear: number = 0;
    protected cells: DynamicArrayCell<T | null>[];

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, initialCapacity: number, protected opacity: number = 1, protected drawIndex: boolean = true) {
        super(x, y, cellWidth, cellHeight, [], initialCapacity, opacity, drawIndex);
            this.arrayLength = initialCapacity;
            this.cells = [];
            
            for (let i = 0; i < initialCapacity; i++) {
                this.cells.push(new DynamicArrayCell(this.x + i * this.cellWidth, this.y, i, this.cellWidth, this.cellHeight, null, this.opacity));
            }
    }

    draw(context: CanvasRenderingContext2D) {
        this.cells.forEach(cell => {
            cell.opacity = this.opacity;
            cell.drawCell(context, this.drawIndex);
        });
    }

    clear(context: CanvasRenderingContext2D) {
        // Add extra height to clear the index numbers below the array cells
        const extraHeight = 18;
        context.clearRect(this.x - 1, this.y - 1, (this.cellWidth * this.arrayLength) + 2, this.cellHeight + extraHeight);
    }

    isEmpty() {
        return this.numElements === 0;
    }

    getNumElements() {
        return this.numElements;
    }

    private async resize(context: CanvasRenderingContext2D, newCapacity: number) {
        // Do nothing
        if (newCapacity === this.arrayLength) {
            return;
        }

        const newDeque = new DynamicArrayDeque<T>(this.x, this.y + 2 * this.cellHeight, this.cellWidth, this.cellHeight, newCapacity, 0, this.drawIndex);
        this.draw(context);

        // Fade in the new deque
        await new Promise<void>((resolve) => {
            gsap.to(newDeque, {
                opacity: this.opacity,
                duration: 1,
                onUpdate: () => {
                    newDeque.draw(context);
                },
                onComplete: () => {
                    resolve();
                }
            });
        });

         await new Promise<void>((resolve) => {
            // Resolve after the timeline animation completes
            const timeline = gsap.timeline({ onComplete: resolve });
        
            for (let i = 0; i < this.numElements; i++) {
                const source = this.cells[(i + this.front) % this.arrayLength];
                const destination = newDeque.cells[i];

                timeline.to(source, {
                    outlineColor: "red",
                    fillColor: "yellow",
                    duration: 1,
                    onUpdate: () => {
                        source.drawCell(context, this.drawIndex);
                    }
                });

                timeline.to(destination, {
                    outlineColor: "red",
                    fillColor: "yellow",
                    duration: 1,
                    onUpdate: () => {
                        destination.drawCell(context, this.drawIndex);
                    },
                    onComplete: () => {
                        source.outlineColor = "black";
                        source.fillColor = "white";
                        source.drawCell(context, this.drawIndex);
                        destination.outlineColor = "black";
                        destination.fillColor = "white";
                        destination.content = source.content;
                        destination.drawCell(context, this.drawIndex);
                    }
                });
                
            }
        });

        // Fade out the old deque
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

        // Move the new deque to the old location
        await new Promise<void>((resolve) => {
            gsap.to(newDeque.cells, {
                y: this.y,
                duration: 1,
                onUpdate: () => {
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    newDeque.draw(context);
                },
                onComplete: resolve
            });
        });

        this.cells = newDeque.cells;
        this.arrayLength = newCapacity;
        this.opacity = newDeque.opacity;
        this.front = 0;
        this.rear = this.numElements;
    }

    private ensureInitialCapacity(): void {
        if (this.arrayLength === 0) {
            this.cells.push(new DynamicArrayCell<T | null>(this.x, this.y, 0, this.cellWidth, this.cellHeight, null, this.opacity));
            this.arrayLength = 1;
        }
    }

    async insertFront(context: CanvasRenderingContext2D, newElement: T, highlightDuration: number = 1) {
        this.ensureInitialCapacity();

        if (this.numElements >= this.arrayLength) {
            await this.resize(context, this.arrayLength * 2);
        }

        this.draw(context);
        this.front = (this.front - 1 + this.arrayLength) % this.arrayLength;
        await this.highlightCellFor(context, this.front, highlightDuration);
        this.setElementAt(context, this.front, newElement);
        this.numElements++;
    }

    async insertRear(context: CanvasRenderingContext2D, newElement: T, highlightDuration: number = 1) {
        this.ensureInitialCapacity();

        if (this.numElements >= this.arrayLength) {
            await this.resize(context, this.arrayLength * 2);
        }

        this.draw(context);
        await this.highlightCellFor(context, this.rear, highlightDuration);
        this.setElementAt(context, this.rear, newElement);
        this.rear = (this.rear + 1) % this.arrayLength;
        this.numElements++;
    }

    async deleteFront(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.warn("Deque Underflow");
            return;
        }

        this.draw(context);
        await this.highlightCellFor(context, this.front, highlightDuration);
        const removed_element = this.getElementAt(this.front);
        this.setElementAt(context, this.front, null);
        this.front = (this.front + 1) % this.arrayLength;
        this.numElements--;

        if (this.numElements > 0 && this.numElements <= this.arrayLength / 4) {
            await this.resize(context, Math.max(1, Math.floor(this.arrayLength / 2)));
        }

        return removed_element;
    }

    async deleteRear(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.warn("Deque Underflow");
            return;
        }

        this.draw(context);
        this.rear = (this.rear - 1 + this.arrayLength) % this.arrayLength;
        await this.highlightCellFor(context, this.rear, highlightDuration);
        const removed_element = this.getElementAt(this.rear);
        this.setElementAt(context, this.rear, null);
        this.numElements--;

        if (this.numElements > 0 && this.numElements <= this.arrayLength / 4) {
            await this.resize(context, Math.max(1, Math.floor(this.arrayLength / 2)));
        }

        return removed_element;
    }

    async getFront(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Deque is empty");
            return;
        }

        this.draw(context);
        await this.highlightCellFor(context, this.front, highlightDuration);
        return this.getElementAt(this.front);
    }

    async getRear(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Deque is empty");
            return;
        }

        this.draw(context);
        const actualRear = (this.rear - 1 + this.arrayLength) % this.arrayLength;
        await this.highlightCellFor(context, actualRear, highlightDuration);
        return this.getElementAt(actualRear);
    }
}