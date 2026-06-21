import { DoublyLinkedList } from "../LinkedListComponents/DLL";

export class LinkedDeque<T> {
    protected deque: DoublyLinkedList<T>;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        this.deque = new DoublyLinkedList(x, y, nodeWidth, nodeHeight, opacity);
    }

    draw(context: CanvasRenderingContext2D) {
        this.deque.draw(context);
    }

    async insertFront(context: CanvasRenderingContext2D, newElement: T) {
        await this.deque.prepend(context, newElement);
    }    

    async insertRear(context: CanvasRenderingContext2D, newElement: T) {
        await this.deque.append(context, newElement);
    }

    async deleteFront(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.warn("Deque Underflow");
            return;
        }

        return await this.deque.shift(context);
    }

    async deleteRear(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.warn("Deque Underflow");
            return;
        }

        return await this.deque.pop(context);
    }

    async getFront(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.log("Deque is empty");
            return;
        }

        return await this.deque.getHead(context);
    }

    async getRear(context: CanvasRenderingContext2D) {
        if (this.isEmpty()) {
            console.log("Deque is empty");
            return;
        }

        return await this.deque.getTail(context);
    }

    isEmpty() {
        return this.deque.getNumElements() === 0;
    }

    getNumElements() {
        return this.deque.getNumElements();
    }

    async clear(context: CanvasRenderingContext2D) {
        await this.deque.clearAll(context);
    }
}