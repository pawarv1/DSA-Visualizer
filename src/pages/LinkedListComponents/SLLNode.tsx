import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual SLL nodes
export class SLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacityNext: number;
    next: SLLNode | null;
    isSentinel: boolean;
    outlineColor: string;
    fillColor: string;

    // Constructor sets next to null by default
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacityNext: number = 1, isSentinel: boolean = false, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacityNext = pointerOpacityNext;
        this.next = null;
        this.isSentinel = isSentinel;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
    }

    // Adjust font size to fit within the node data section
    adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16;
        context.font = `${fontSize}px Arial`;
        const text = String(this.data);
        let textWidth = context.measureText(text).width;

        // Reduce the font size until the text fits within the node width
        while (textWidth > (this.nodeWidth * 2/3) - 10 && fontSize > 1) {
            fontSize--;
            context.font = `${fontSize}px Arial`;
            textWidth = context.measureText(text).width;
        }
        return context.font;
    }

    // Function for drawing the next pointer
    drawPointers(context: CanvasRenderingContext2D) {
        if (this.next) {
            const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 2, this.next.y + this.next.nodeHeight/2, this.pointerOpacityNext);
            pointerArrow.draw(context);
        } else {
            // Represent a null pointer with a slash through the pointer section of the node
            // To avoid drawing bugs, the opacity of the line will be the same as the nodes opacity
            const nullSlash = new Line(this.x + (this.nodeWidth * 2 / 3), this.y, this.x + this.nodeWidth, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
        }
    }

    drawNode(context: CanvasRenderingContext2D, redrawPointer: boolean = true) {
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
        if (!this.isSentinel) {
            context.fillText(this.data, this.x + this.nodeWidth / 3, this.y + this.nodeHeight / 2);
        }
        if (redrawPointer) {
            this.drawPointers(context);
        }
        context.restore();
    }
}