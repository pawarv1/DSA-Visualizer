import { StaticArray } from "../ArrayComponents/StaticArray";

export class StaticArrayDeque<T> {
    protected numElements: number = 0;
    protected front: number = 0;
    protected rear: number = 0;
    protected deque: StaticArray<T>;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number, protected opacity: number = 1, protected drawIndex: boolean = true) {
        this.deque = new StaticArray(x, y, cellWidth, cellHeight, [], capacity, opacity, drawIndex);
    }

    draw(context: CanvasRenderingContext2D) {
        this.deque.draw(context);
    }

    async insertFront(context: CanvasRenderingContext2D, newElement: T, highlightDuration: number = 1) {
        if (this.isFull()) {
            console.warn("Deque Overflow");
            return;
        }

        this.draw(context);
        this.front = (this.front - 1 + this.capacity) % this.capacity;
        await this.deque.highlightCellFor(context, this.front, highlightDuration);
        this.deque.setElementAt(context, this.front, newElement);
        this.numElements++;
    }

    async insertRear(context: CanvasRenderingContext2D, newElement: T, highlightDuration: number = 1) {
        if (this.isFull()) {
            console.warn("Deque Overflow");
            return;
        }

        this.draw(context);
        await this.deque.highlightCellFor(context, this.rear, highlightDuration);
        this.deque.setElementAt(context, this.rear, newElement);
        this.rear = (this.rear + 1) % this.capacity;
        this.numElements++;
    }

    async deleteFront(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.warn("Deque Underflow");
            return;
        }

        this.draw(context);
        await this.deque.highlightCellFor(context, this.front, highlightDuration);
        const removed_element = this.deque.getElementAt(this.front);
        this.deque.setElementAt(context, this.front, null);
        this.front = (this.front + 1) % this.capacity;
        this.numElements--;
        return removed_element;
    }

    async deleteRear(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.warn("Deque Underflow");
            return;
        }

        this.draw(context);
        this.rear = (this.rear - 1 + this.capacity) % this.capacity;
        await this.deque.highlightCellFor(context, this.rear, highlightDuration);
        const removed_element = this.deque.getElementAt(this.rear);
        this.deque.setElementAt(context, this.rear, null);
        this.numElements--;
        return removed_element;
    }

    async getFront(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Deque is empty");
            return;
        }

        this.draw(context);
        await this.deque.highlightCellFor(context, this.front, highlightDuration);
        return this.deque.getElementAt(this.front);
    }

    async getRear(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Deque is empty");
            return;
        }

        this.draw(context);
        const actualRear = (this.rear - 1 + this.capacity) % this.capacity;
        await this.deque.highlightCellFor(context, actualRear, highlightDuration);
        return this.deque.getElementAt(actualRear);
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
        this.deque.clear(context);
    }
}