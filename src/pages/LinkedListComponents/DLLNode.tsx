import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual DLL nodes
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
    }

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

    // Draws the next and the prev pointers
    drawPointers(context: CanvasRenderingContext2D) {
        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "black";

        if (this.next) {
            const pointerArrowNext = new Arrow(this.x + this.nodeWidth - 4, this.y + this.nodeHeight/4, this.next.x - 2, this.next.y + this.next.nodeHeight/4, this.pointerOpacityNext);
            pointerArrowNext.draw(context);
        } else {
            // Represent a null pointer with a slash through the pointer section of the node
            // To avoid certain bugs, the opacity of the line will be the same as the nodes opacity
            const nullSlash = new Line(this.x + this.nodeWidth * 3 / 4, this.y, this.x + this.nodeWidth, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
        }

        if (this.prev) {
            const pointerArrowPrev = new Arrow(this.x + 4, this.y + this.nodeHeight * 3 / 4, this.prev.x + this.prev.nodeWidth + 2, this.prev.y + this.prev.nodeHeight * 3 / 4, this.pointerOpacityPrev);
            pointerArrowPrev.draw(context);
        } else {
            // Represent a null pointer with a slash through the pointer section of the node
            // To avoid certain bugs, the opacity of the line will be the same as the nodes opacity
            const nullSlash = new Line(this.x, this.y, this.x + this.nodeWidth / 4, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
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

    // May have to adjust 
    clearNode(context: CanvasRenderingContext2D) { 
        context.clearRect(this.x + this.nodeWidth, this.y, this.nodeWidth - 1, this.nodeHeight / 2 - 1);
        context.clearRect(this.x - this.nodeWidth + 1, this.y + this.nodeHeight / 2 + 1, this.nodeWidth, this.nodeHeight / 2);
        context.clearRect(this.x - 2, this.y - 2, this.nodeWidth + 3, this.nodeHeight + 3);
    }
}