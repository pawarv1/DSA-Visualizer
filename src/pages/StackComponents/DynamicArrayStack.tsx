import { DynamicArray } from "../ArrayComponents/DynamicArray";

export class DynamicArrayStack<T> {
    protected stack: DynamicArray<T | null>;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number, protected opacity: number = 1, protected drawIndex: boolean = true) {
        this.stack = new DynamicArray(x, y, cellWidth, cellHeight, [], capacity, opacity, drawIndex);
    }

    draw(context: CanvasRenderingContext2D) {
        this.stack.draw(context);
    }

    async push(context: CanvasRenderingContext2D, newElement: T) {
        this.draw(context);
        await this.stack.append(context, newElement);
    }

    async pop(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.warn("Stack Underflow");
            return;
        }

        this.draw(context);
        await this.stack.highlightCellFor(context, this.stack.getNumElements() - 1, highlightDuration);
        return await this.stack.pop(context);
    }

    async peek(context: CanvasRenderingContext2D, highlightDuration: number = 1) {
        if (this.isEmpty()) {
            console.log("Stack is empty");
            return;
        }

        this.draw(context);
        await this.stack.highlightCellFor(context, this.stack.getNumElements() - 1, highlightDuration);
        return this.stack.getElementAt(this.stack.getNumElements() - 1);
    }

    isEmpty() {
        return this.stack.getNumElements() === 0;
    }

    getSize() {
        return this.stack.getNumElements();
    }

    clear(context: CanvasRenderingContext2D) {
        this.stack.clear(context);
    }
}