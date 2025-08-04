import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual SLL nodes
export class LinkedListNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacity: number;
    outlineColor: string;
    fillColor: string;
    next: LinkedListNode | null;

    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, next: LinkedListNode | null = null, nodeOpacity: number = 1, pointerOpacity: number = 1, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.next = next;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacity = pointerOpacity;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
    }

    // Adjust font size to fit within the node data section
    adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16; // Initial font size
        context.font = `${fontSize}px Arial`;
        let textWidth = context.measureText(this.data).width;

        // Reduce the font size until the text fits within the node width
        while (textWidth > (this.nodeWidth * 2/3) - 10 && fontSize > 1) { // Leave some padding
            fontSize--;
            context.font = `${fontSize}px Arial`;
            textWidth = context.measureText(this.data).width;
        }
        return context.font;
    }

    // Function for drawing the next pointer
    drawPointer(context: CanvasRenderingContext2D) {
        if (this.next) {
            // Represent the next pointer (if it is not null) with an arrow
            const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 2, this.next.y + this.next.nodeHeight/2, this.pointerOpacity);
            pointerArrow.draw(context);
        } else {
            // Represent a null pointer with a slash through the pointer section of the node
            // To avoid certain bugs, the opacity of the line will be the same as the nodes opacity
            const nullSlash = new Line(this.x + (this.nodeWidth * 2 / 3), this.y, this.x + this.nodeWidth, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
        }
    }

    drawNode(context: CanvasRenderingContext2D, redrawPointer: boolean = true) {
        this.clearNode(context);
        context.save();
        context.globalAlpha = this.nodeOpacity;
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.nodeWidth * 2/3, this.nodeHeight);
        context.strokeRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const font = this.adjustFontSize(context);
        context.font = font;
        context.fillText(this.data, this.x + this.nodeWidth / 3, this.y + this.nodeHeight / 2);
        if (redrawPointer) {
            this.drawPointer(context);
        }
        context.restore();
    }

    clearNode(context: CanvasRenderingContext2D) { 
        context.clearRect(this.x - 1, this.y - 1, this.nodeWidth * 2, this.nodeHeight + 2);
    }
}
