import { DynamicArray } from "../../ArrayComponents/DynamicArray";

export class DynamicArrayStack<T> {
    protected stack: DynamicArray<T | null>;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number, protected opacity: number = 1) {
        this.stack = new DynamicArray(this.x, this.y, this.cellWidth, this.cellHeight, [], this.capacity, this.opacity);
    }

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        this.stack.draw(context, drawIndex);
    }

    async push(context: CanvasRenderingContext2D, newElement: T, drawIndex: boolean = true) {
        this.draw(context, drawIndex);
        await this.stack.append(context, newElement, drawIndex);
    }

    async pop(context: CanvasRenderingContext2D, highlightDuration: number = 1, drawIndex: boolean = true) {
        if (this.isEmpty()) {
            console.warn("Stack Underflow");
            return;
        }

        this.draw(context, drawIndex);
        await this.stack.highlightCellFor(context, this.stack.getNumElements() - 1, highlightDuration);
        return await this.stack.pop(context, drawIndex);
    }

    async peek(context: CanvasRenderingContext2D, highlightDuration: number = 1, drawIndex: boolean = true) {
        if (this.isEmpty()) {
            console.log("Stack is empty");
            return;
        }

        this.draw(context, drawIndex);
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