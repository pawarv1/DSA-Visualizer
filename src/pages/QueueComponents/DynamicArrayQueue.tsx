import gsap from 'gsap';
import { DynamicArrayCell } from '../ArrayComponents/ArrayCell';
import { StaticArray } from '../ArrayComponents/StaticArray';

export class DynamicArrayQueue<T> extends StaticArray<T> {
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
    
    getNumElements(): number {
        return this.numElements;
    }

    isEmpty(): boolean {
        return this.numElements === 0;
    }

    // Resize animations when the dynamic array must expand or shrink
    private async resize(context: CanvasRenderingContext2D, newCapacity: number) {
        // Do nothing
        if (newCapacity === this.arrayLength) {
            return;
        }

        let newQueue = new DynamicArrayQueue<T>(this.x, this.y + 2 * this.cellHeight, this.cellWidth, this.cellHeight, newCapacity, 0, this.drawIndex);
        this.draw(context);

        // Fade in the new queue
        await new Promise<void>((resolve) => {
            gsap.to(newQueue, {
                opacity: this.opacity,
                duration: 1,
                onUpdate: () => {
                    newQueue.draw(context);
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
                const destination = newQueue.cells[i];

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

        // Fade out the old queue
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

        // Move the new queue to the old location
        await new Promise<void>((resolve) => {
            gsap.to(newQueue.cells, {
                y: this.y,
                duration: 1,
                onUpdate: () => {
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    newQueue.draw(context);
                },
                onComplete: resolve
            });
        });

        this.cells = newQueue.cells;
        this.arrayLength = newCapacity;
        this.opacity = newQueue.opacity;
        this.front = 0;
        this.rear = this.numElements;
    }

    // Helper method to help with adding to an empty dynamic array
    private ensureInitialCapacity(): void {
        if (this.arrayLength === 0) {
            this.cells.push(new DynamicArrayCell<T | null>(this.x, this.y, 0, this.cellWidth, this.cellHeight, null, this.opacity));
            this.arrayLength = 1;
        }
    }

    async enqueue(context: CanvasRenderingContext2D, newElement: T, highlightDuration: number = 1) {
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

    async dequeue(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.warn("Queue Underflow");
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

    async getFront(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }

        this.draw(context);
        await this.highlightCellFor(context, this.front, highlightDuration);
        return this.getElementAt(this.front);
    }

    async getRear(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }

        this.draw(context);
        const actualRear = (this.rear - 1 + this.arrayLength) % this.arrayLength;
        await this.highlightCellFor(context, actualRear, highlightDuration);
        return this.getElementAt(actualRear);
    }
}