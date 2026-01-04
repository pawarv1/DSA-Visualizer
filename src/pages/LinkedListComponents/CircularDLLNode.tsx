import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual CDLL nodes
export class CircularDLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacityNext: number;
    pointerOpacityPrev: number;
    next: CircularDLLNode | null;
    prev: CircularDLLNode | null;
    isSentinel: boolean;
    outlineColor: string;
    fillColor: string;

    // By default a node next and prev pointers points to itself
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacityNext: number = 1, pointerOpacityPrev: number = 1, isSentinel: boolean = false, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacityNext = pointerOpacityNext;
        this.pointerOpacityPrev = pointerOpacityPrev;
        this.next = this;
        this.prev = this;
        this.isSentinel = isSentinel;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
    }

    // Adjust font size to fit within the node
    adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16; // Initial font size
        context.font = `${fontSize}px Arial`;
        const text = String(this.data);
        let textWidth = context.measureText(text).width;

        // Reduce the font size until the text fits within the node width
        while (textWidth > (this.nodeWidth / 2) - 10 && fontSize > 1) { // Leave some padding
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
                const pointerSegmentsNext = [
                    // Line 1
                    new Line(this.x + this.nodeWidth - 4, this.y + this.nodeHeight/4, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/4, this.pointerOpacityNext),
                    // Line 2
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/4, this.x + this.nodeWidth * 3/2, this.y - this.nodeHeight/2, this.pointerOpacityNext),
                    // Line 3
                    new Line(this.x + this.nodeWidth * 3/2, this.y - this.nodeHeight/2, this.next.x - this.nodeWidth/2, this.y - this.nodeHeight/2, this.pointerOpacityNext),
                    // Line 4
                    new Line(this.next.x - this.nodeWidth/2, this.y - this.nodeHeight/2, this.next.x - this.nodeWidth/2, this.y + this.nodeHeight/4, this.pointerOpacityNext),
                    // Arrow 1
                    new Arrow(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight/4, this.next.x - 4, this.y + this.nodeHeight/4, this.pointerOpacityNext)
                ];

                // Draw each of the graphics in pointerSegmentsNext
                pointerSegmentsNext.forEach(segment => {
                    segment.draw(context);
                });
            }
            else {
                const pointerArrowNext = new Arrow(this.x + this.nodeWidth - 4, this.y + this.nodeHeight/4, this.next.x - 4, this.next.y + this.nodeHeight/4, this.pointerOpacityNext);
                pointerArrowNext.draw(context);
            }
        }
        else {
            // Represent a null pointer with a slash through the pointer section of the node
            const nullSlash = new Line(this.x + this.nodeWidth * 3 / 4, this.y, this.x + this.nodeWidth, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
        }
        
        if (this.prev) {
            if (this.prev.x >= this.x) {
                const pointerSegmentsPrev = [
                    // Line 5
                    new Line(this.x + 4, this.y + this.nodeHeight * 3/4, this.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/4, this.pointerOpacityPrev),
                    // Line 6
                    new Line(this.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/4, this.x - this.nodeWidth /2, this.y + this.nodeHeight * 3/2, this.pointerOpacityPrev),
                    // Line 7
                    new Line(this.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.prev.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.pointerOpacityPrev),
                    // Line 8
                    new Line(this.prev.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.prev.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/4, this.pointerOpacityPrev),
                    // Arrow 2
                    new Arrow(this.prev.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/4, this.prev.x + this.nodeWidth + 4, this.y + this.nodeHeight * 3/4, this.pointerOpacityPrev)
                ];

                // Draw each of the graphics in pointerSegmentsPrev
                pointerSegmentsPrev.forEach(segment => {
                    segment.draw(context);
                });
            }
            else {
                const pointerArrowPrev = new Arrow(this.x + 4, this.y + this.nodeHeight * 3 / 4, this.prev.x + this.nodeWidth + 4, this.prev.y + this.nodeHeight * 3 / 4, this.pointerOpacityPrev);
                pointerArrowPrev.draw(context);
            }
        }
        else {
            // Represent a null pointer with a slash through the pointer section of the node
            const nullSlash = new Line(this.x, this.y, this.x + this.nodeWidth / 4, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
        }
    }

    drawNode(context: CanvasRenderingContext2D, redrawPointer: boolean = true) {
        context.save();
        context.globalAlpha = this.nodeOpacity;
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x + this.nodeWidth / 4, this.y, this.nodeWidth / 2, this.nodeHeight);
        context.strokeRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const font = this.adjustFontSize(context);
        context.font = font;
        if (!this.isSentinel) {
            context.fillText(this.data, this.x + this.nodeWidth / 2, this.y + this.nodeHeight / 2);
        }
        if (redrawPointer) {
            this.drawPointers(context);
        }
        context.restore();
    }
}