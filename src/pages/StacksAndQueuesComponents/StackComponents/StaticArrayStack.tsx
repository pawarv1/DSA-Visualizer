import { StaticArray } from "../../ArrayComponents/StaticArray";

export class StaticArrayStack {
    protected size: number = 0;
    protected stack: StaticArray;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.capacity = this.capacity
        this.opacity = opacity;
        this.stack = new StaticArray(this.x, this.y, this.cellWidth, this.cellHeight, [], this.opacity);
    }
}