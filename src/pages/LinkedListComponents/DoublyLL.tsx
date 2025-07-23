import gsap, { context, set, timeline } from "gsap";
import { Arrow, Text } from "../GeneralAnimating/GeneralAnimationGraphics";

export class DoublyLinkedListNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacity: number;
    outlineColor: string;
    fillColor: string;
    next: DoublyLinkedListNode | null;
    prev: DoublyLinkedListNode | null;
    pointerArrowNext: Arrow | null;
    pointerArrowPrev: Arrow | null;

    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacity: number = 1, outlineColor: string = "black", fillColor: string = "white", next: DoublyLinkedListNode | null = null, prev: DoublyLinkedListNode | null = null) {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacity = pointerOpacity;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
        this.next = next;
        this.prev = prev;
        this.pointerArrowNext = null;
        this.pointerArrowPrev = null;
    }

    static type = "LinkedListNode"

    // Adjust font size to fit within the node
    adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16; // Initial font size
        context.font = `${fontSize}px Arial`;
        let textWidth = context.measureText(this.data).width;

        // Reduce the font size until the text fits within the node width
        while (textWidth > (this.nodeWidth * 1/2) - 10 && fontSize > 1) { // Leave some padding
            fontSize--;
            context.font = `${fontSize}px Arial`;
            textWidth = context.measureText(this.data).width;
        }
        return context.font;
    }

    drawPointers(context: CanvasRenderingContext2D) {
        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "black";

        if (this.next) {
            //this.pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 2, this.next.y + this.next.nodeHeight/2, this.pointerOpacity);
            //this.pointerArrow.draw(context);
        } else {
            const ptrX = this.x + (this.nodeWidth * 3 / 4);
            const ptrY = this.y;
            const ptrWidth = this.nodeWidth / 4;
            const ptrHeight = this.nodeHeight;
            context.font = "10px Arial";
            context.fillStyle = "red";
            context.fillText("null", ptrX + ptrWidth / 2, ptrY + ptrHeight / 2);
        }

        if (this.prev) {
            //this.pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 2, this.next.y + this.next.nodeHeight/2, this.pointerOpacity);
            //this.pointerArrow.draw(context);
        } else {
            const ptrX = this.x;
            const ptrY = this.y;
            const ptrWidth = this.nodeWidth / 4;
            const ptrHeight = this.nodeHeight;
            context.font = "10px Arial";
            context.fillStyle = "red";
            context.fillText("null", ptrX + ptrWidth / 2, ptrY + ptrHeight / 2);
        }

        context.restore();
    }

    drawNode(context: CanvasRenderingContext2D, redrawPointer: boolean = true) {
        this.clearNode(context);
        context.save();
        context.globalAlpha = this.nodeOpacity;
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x + this.nodeWidth / 4, this.y, this.nodeWidth * 1/2, this.nodeHeight);
        context.strokeRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const font = this.adjustFontSize(context);
        context.font = font;
        context.fillText(this.data, this.x + this.nodeWidth / 2, this.y + this.nodeHeight / 2);
        if (redrawPointer) {
            this.drawPointers(context);
        }
        context.restore();
    }

    clearNode(context: CanvasRenderingContext2D) { 
        context.clearRect(this.x - 1, this.y - 1, this.nodeWidth * 2, this.nodeHeight + 2);
    }
}