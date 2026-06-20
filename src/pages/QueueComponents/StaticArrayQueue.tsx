import { StaticArray } from "../ArrayComponents/StaticArray";

export class StaticArrayQueue<T> {
    protected numElements: number = 0;
    protected front: number = 0;
    protected rear: number = 0;
    protected queue: StaticArray<T>;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number, protected opacity: number = 1, protected drawIndex: boolean = true) {
        this.queue = new StaticArray(x, y, cellWidth, cellHeight, [], capacity, opacity, drawIndex);
    }

    draw(context: CanvasRenderingContext2D) {
        this.queue.draw(context);
    }

    async enqueue(context: CanvasRenderingContext2D, newElement: T, highlightDuration: number = 1) {
        if (this.isFull()) {
            console.warn("Queue Overflow");
            return;
        }

        this.draw(context);
        await this.queue.highlightCellFor(context, this.rear, highlightDuration);
        this.queue.setElementAt(context, this.rear, newElement);
        this.rear = (this.rear + 1) % this.capacity;
        this.numElements++;
    }

    async dequeue(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.warn("Queue Underflow");
            return;
        }

        this.draw(context);
        await this.queue.highlightCellFor(context, this.front, highlightDuration);
        const removed_element = this.queue.getElementAt(this.front);
        this.queue.setElementAt(context, this.front, null);
        this.front = (this.front + 1) % this.capacity;
        this.numElements--;
        return removed_element;
    }

    async getFront(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }

        this.draw(context);
        await this.queue.highlightCellFor(context, this.front, highlightDuration);
        return this.queue.getElementAt(this.front);
    }

    async getRear(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }

        this.draw(context);
        const actualRear = (this.rear - 1 + this.capacity) % this.capacity;
        await this.queue.highlightCellFor(context, actualRear, highlightDuration);
        return this.queue.getElementAt(actualRear);
    }

    isFull() {
        return this.numElements === this.capacity;
    }

    isEmpty() {
        return this.numElements === 0;
    }

    getNumElements() {
        return this.numElements;
    }

    clear(context: CanvasRenderingContext2D) {
        this.queue.clear(context);
    }
}