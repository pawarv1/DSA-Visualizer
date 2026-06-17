import { LinkedList } from "../../LinkedListComponents/SLL";

export class LinkedStack {
    protected stack: LinkedList;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        this.stack = new LinkedList(this.x, this.y, this.nodeWidth, this.nodeHeight, this.opacity);
    }

    draw(context: CanvasRenderingContext2D) {
        this.stack.draw(context);
    }

    async push(context: CanvasRenderingContext2D, newElement: any) {
        await this.stack.prepend(context, newElement);
    }

    async pop(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.warn("Stack Underflow");
            return;
        }

        return await this.stack.shift(context);
    }

    async peek(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.log("Stack is empty");
            return;
        }

        return await this.stack.getAt(context, 0);
    }

    isEmpty() {
        return this.stack.getNumElements() === 0;
    }

    getSize() {
        return this.stack.getNumElements();
    }

    clear(context: CanvasRenderingContext2D) {
        this.stack.clearAll(context);
    }
}