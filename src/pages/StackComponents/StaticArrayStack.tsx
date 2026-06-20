import { StaticArray } from "../ArrayComponents/StaticArray";

export class StaticArrayStack<T> {
    protected numElements: number = 0;
    protected stack: StaticArray<T>;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number, protected opacity: number = 1, protected drawIndex: boolean = true) {
        this.stack = new StaticArray(x, y, cellWidth, cellHeight, [], capacity, opacity, drawIndex);
    }

    draw(context: CanvasRenderingContext2D) {
        this.stack.draw(context);
    }

    async push(context: CanvasRenderingContext2D, newElement: T, highlightDuration: number = 1) {
        if (this.isFull()) {
            console.warn("Stack Overflow");
            return;
        }

        this.draw(context);
        await this.stack.highlightCellFor(context, this.numElements, highlightDuration);
        this.stack.setElementAt(context, this.numElements, newElement);
        this.numElements++;
    }

    async pop(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.warn("Stack Underflow");
            return;
        }

        this.draw(context);
        this.numElements--;
        await this.stack.highlightCellFor(context, this.numElements, highlightDuration);
        const poppedElement = this.stack.getElementAt(this.numElements);
        this.stack.setElementAt(context, this.numElements, null);
        return poppedElement;
    }

    async peek(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Stack is empty");
            return;
        }

        this.draw(context);
        await this.stack.highlightCellFor(context, this.numElements - 1, highlightDuration);
        return this.stack.getElementAt(this.numElements - 1);
    }

    isFull() {
        return this.numElements === this.capacity;
    }

    isEmpty() {
        return this.numElements === 0;
    }

    getSize() {
        return this.numElements;
    }

    clearStack(context: CanvasRenderingContext2D) {
        this.stack.clear(context);
    }
}