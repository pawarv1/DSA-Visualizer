import { StaticArray } from "../../ArrayComponents/StaticArray";

export class StaticArrayStack {
    protected numElements: number = 0;
    protected stack: StaticArray;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number, protected opacity: number = 1) {
        this.stack = new StaticArray(this.x, this.y, this.cellWidth, this.cellHeight, [], this.capacity, this.opacity);
    }

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        this.stack.draw(context, drawIndex);
    }

    async push(context: CanvasRenderingContext2D, newElement: any, highlightDuration: number = 1) {
        if (this.numElements >= this.capacity) {
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
        this.stack.setElementAt(context, this.numElements, "");
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