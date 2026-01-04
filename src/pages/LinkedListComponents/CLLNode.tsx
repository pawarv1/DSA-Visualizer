import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual CLL nodes
export class CircularLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacityNext: number;
    next: CircularLLNode | null;
    outlineColor: string;
    fillColor: string;
    isSentinel: boolean;

    // By default a node next pointer points to itself
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacityNext: number = 1, isSentinel: boolean = false, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacityNext = pointerOpacityNext;
        this.isSentinel = isSentinel;
        this.next = this;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
    }

    // Adjust font size to fit within the node data section
    adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16; // Initial font size
        context.font = `${fontSize}px Arial`;
        const text = String(this.data);
        let textWidth = context.measureText(text).width;

        // Reduce the font size until the text fits within the node width
        while (textWidth > (this.nodeWidth * 2/3) - 10 && fontSize > 1) { // Leave some padding
            fontSize--;
            context.font = `${fontSize}px Arial`;
            textWidth = context.measureText(text).width;
        }
        return context.font;
    }

    // May need adjusting
    drawPointers(context: CanvasRenderingContext2D) {
        if (this.next) {
            if (this.next.x <= this.x) {
                const pointerSegments = [
                    // Line 1
                    new Line(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.pointerOpacityNext),
                    // Line 2
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.pointerOpacityNext),
                    // Line 3
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.next.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.pointerOpacityNext),
                    // Line 4
                    new Line(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.next.x - this.nodeWidth / 2, this.y + this.nodeHeight/2, this.pointerOpacityNext),
                    // Arrow 1
                    new Arrow(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight/2, this.next.x - 4, this.y + this.nodeHeight/2, this.pointerOpacityNext)
                ];

                // Draw each of the graphics in pointerSegments
                pointerSegments.forEach(segment => {
                    segment.draw(context);
                });
            }
            else {
                const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 4, this.next.y + this.next.nodeHeight/2, this.pointerOpacityNext);
                pointerArrow.draw(context);
            }
        }
        else {
            // Represent a null pointer with a slash through the pointer section of the node
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
            context.fillText(String(this.data), this.x + this.nodeWidth / 3, this.y + this.nodeHeight / 2);
        }
        if (redrawPointer) {
            this.drawPointers(context);
        }
        context.restore();
    }
}
