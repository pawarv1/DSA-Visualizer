import gsap, { context, set, timeline } from "gsap";
import { Arrow, Text } from "../GeneralAnimating/GeneralAnimationGraphics";

//FIXME need to fix null text rendering

export class DLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacityNext: number;
    pointerOpacityPrev: number;
    outlineColor: string;
    fillColor: string;
    next: DLLNode | null;
    prev: DLLNode | null;
    pointerArrowNext: Arrow | null;
    pointerArrowPrev: Arrow | null;

    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacityNext: number = 1, pointerOpacityPrev: number = 1, outlineColor: string = "black", fillColor: string = "white", next: DLLNode | null = null, prev: DLLNode | null = null) {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacityNext = pointerOpacityNext;
        this.pointerOpacityPrev = pointerOpacityPrev;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
        this.next = next;
        this.prev = prev;
        this.pointerArrowNext = null;
        this.pointerArrowPrev = null;
    }

    static type = "DLLNode"

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
            this.pointerArrowNext = new Arrow(this.x + this.nodeWidth - 4, this.y + this.nodeHeight/4, this.next.x - 2, this.next.y + this.next.nodeHeight/4, this.pointerOpacityNext);
            this.pointerArrowNext.draw(context);
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
            this.pointerArrowPrev = new Arrow(this.x + 4, this.y + this.nodeHeight * 3 / 4, this.prev.x + this.prev.nodeWidth + 2, this.prev.y + this.prev.nodeHeight * 3 / 4, this.pointerOpacityPrev);
            this.pointerArrowPrev.draw(context);
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


export class DoublyLinkedList {
    protected headPtr: DLLNode | null;
    protected tailPtr: DLLNode | null;
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1, protected outlineColor: string = "black", protected fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.opacity = opacity;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }

    loadDLL(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currPtr = null;

        for (let i = 0; i < nodeData.length; i++) {
            if (currPtr === null) {
                this.headPtr = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity, this.outlineColor, this.fillColor);
                this.headPtr.drawNode(context);
                currPtr = this.headPtr;
            }
            else {
                let newNode = new DLLNode(currPtr.x + this.nodeWidth * 2, currPtr.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity, this.outlineColor, this.fillColor);
                currPtr.next = newNode;
                newNode.prev = currPtr;
                currPtr.drawNode(context);
                newNode.drawNode(context);
                currPtr = currPtr.next;
            }

            this.tailPtr = currPtr;
            this.numElements++;
        }
    }

    static type = "DoublyLinkedList";

    draw(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr;

        while(currPtr) {
            currPtr.drawNode(context);
            currPtr = currPtr.next;
        }
    }
}