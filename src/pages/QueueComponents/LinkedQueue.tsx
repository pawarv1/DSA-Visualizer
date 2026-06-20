import { LinkedList } from "../LinkedListComponents/SLL";

export class LinkedQueue<T> {
    protected queue: LinkedList<T>;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        this.queue = new LinkedList(x, y, nodeWidth, nodeHeight, opacity);
    }

    draw(context: CanvasRenderingContext2D) {
        this.queue.draw(context);
    }

    async enqueue(context: CanvasRenderingContext2D, newElement: T) {
        await this.queue.append(context, newElement);
    }

    async dequeue(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.warn("Queue Underflow");
            return;
        }

        return await this.queue.shift(context);
    }

    async getFront(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }

        return await this.queue.getHead(context);
    }

    async getRear(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.log("Queue is empty");
            return;
        }

        return await this.queue.getTail(context);
    }

    isEmpty() {
        return this.queue.getNumElements() === 0;
    }

    getNumElements() {
        return this.queue.getNumElements();
    }

    async clear(context: CanvasRenderingContext2D) {
        await this.queue.clearAll(context);
    }
}