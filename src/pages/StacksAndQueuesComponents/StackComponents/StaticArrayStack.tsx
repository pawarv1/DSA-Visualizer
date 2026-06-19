import { StaticArray } from "../../ArrayComponents/StaticArray";

export class StaticArrayStack<T> {
    protected numElements: number = 0;
    protected stack: StaticArray<T>;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number, protected opacity: number = 1) {
        this.stack = new StaticArray(this.x, this.y, this.cellWidth, this.cellHeight, [], this.capacity, this.opacity);
    }

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        this.stack.draw(context, drawIndex);
    }

    async push(context: CanvasRenderingContext2D, newElement: T, highlightDuration: number = 1, drawIndex: boolean = true) {
        if (this.numElements >= this.capacity) {
            console.warn("Stack Overflow");
            return;
        }

        this.draw(context, drawIndex);
        await this.stack.highlightCellFor(context, this.numElements, highlightDuration);
        this.stack.setElementAt(context, this.numElements, newElement);
        this.numElements++;
    }

    async pop(context: CanvasRenderingContext2D, highlightDuration: number = 1, drawIndex: boolean = true) {
        if (this.isEmpty()) {
            console.warn("Stack Underflow");
            return;
        }

        this.draw(context, drawIndex);
        this.numElements--;
        await this.stack.highlightCellFor(context, this.numElements, highlightDuration);
        const poppedElement = this.stack.getElementAt(this.numElements);
        this.stack.setElementAt(context, this.numElements, null);
        return poppedElement;
    }

    async peek(context: CanvasRenderingContext2D, highlightDuration: number = 1, drawIndex: boolean = true) {
        if (this.isEmpty()) {
            console.log("Stack is empty");
            return;
        }

        this.draw(context, drawIndex);
        await this.stack.highlightCellFor(context, this.numElements - 1, highlightDuration);
        return this.stack.getElementAt(this.numElements - 1);
    }

    isEmpty() {
        return this.numElements === 0;
    }

    getSize() {
        return this.numElements;
    }

    clear(context: CanvasRenderingContext2D) {
        this.stack.clear(context);
    }
}