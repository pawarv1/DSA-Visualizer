import { Arrow, Line, Rectangle } from "../GeneralAnimating/GeneralAnimationGraphics";

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
    outlineColor: string;
    fillColor: string;
    private clearAreaCoordinates1: Rectangle[]; // Covers the region where next pointer is drawn
    private clearAreaCoordinates2: Rectangle[]; // Covers the region where prev pointer is drawn

    // By default a node next and prev pointers points to itself
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacityNext: number = 1, pointerOpacityPrev: number = 1, next: CircularDLLNode = this, prev: CircularDLLNode = this, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacityNext = pointerOpacityNext;
        this.pointerOpacityPrev = pointerOpacityPrev;
        this.next = next;
        this.prev = prev;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
        this.clearAreaCoordinates1 = [];
        this.clearAreaCoordinates2 = [];
    }

    // Adjust font size to fit within the node
    adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16; // Initial font size
        context.font = `${fontSize}px Arial`;
        let textWidth = context.measureText(this.data).width;

        // Reduce the font size until the text fits within the node width
        while (textWidth > (this.nodeWidth / 2) - 10 && fontSize > 1) { // Leave some padding
            fontSize--;
            context.font = `${fontSize}px Arial`;
            textWidth = context.measureText(this.data).width;
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

                // May need adjusting
                this.clearAreaCoordinates1 = [
                    // This clears the region with Line 1 and 2
                    new Rectangle(this.x + this.nodeWidth + 1, this.y - 1, this.nodeWidth - 2, this.nodeHeight / 2),
                    // This clear the region with Line 3
                    new Rectangle(this.next.x - this.nodeWidth/2 - 2, this.y - this.nodeHeight, (this.x + this.nodeWidth * 1.5) - (this.next.x - this.nodeWidth/2) + 4, this.nodeHeight - 1),
                    // This clears the regions with Line 4 and Arrow 1
                    new Rectangle(this.next.x - this.nodeWidth/2 - 4, this.y - 1, this.nodeWidth / 2, this.nodeHeight / 2)
                ];
            }
            else {
                const pointerArrowNext = new Arrow(this.x + this.nodeWidth - 4, this.y + this.nodeHeight/4, this.next.x - 4, this.next.y + this.nodeHeight/4, this.pointerOpacityNext);
                pointerArrowNext.draw(context);

                // May need adjusting
                this.clearAreaCoordinates1 = [
                    // This clears the region with pointerArrowNext
                    new Rectangle(this.x + this.nodeWidth, this.y, this.nodeWidth - 1, this.nodeHeight / 2 - 1)
                ];
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

                // May need adjusting
                this.clearAreaCoordinates2 = [
                    // This clears the region with Line 5 and Line 6
                    new Rectangle(this.x - this.nodeWidth * 3/4 + 8, this.y + this.nodeHeight / 2 + 1, this.nodeWidth, this.nodeHeight / 2),
                    // This clears the region with Line 7
                    new Rectangle(this.x - this.nodeWidth * 3/4 + 8, this.y + this.nodeHeight + 1, (this.prev.x + this.nodeWidth * 3/2 + 1) - (this.x - this.nodeWidth/2) + 4, this.nodeHeight / 2),
                    // This clears the region with Line 8 and Arrow 2
                    new Rectangle(this.prev.x + this.nodeWidth + 1, this.y + this.nodeHeight / 2 + 1, (this.prev.x + this.nodeWidth * 3/2) - (this.prev.x + this.nodeWidth) + 1, this.nodeHeight / 2)
                ];
            }
            else {
                const pointerArrowPrev = new Arrow(this.x + 4, this.y + this.nodeHeight * 3 / 4, this.prev.x + this.nodeWidth + 4, this.prev.y + this.nodeHeight * 3 / 4, this.pointerOpacityPrev);
                pointerArrowPrev.draw(context);

                // May need adjusting
                this.clearAreaCoordinates2 = [
                    // This clears the region with pointerArrowPrev
                    new Rectangle(this.x - this.nodeWidth + 4, this.y + this.nodeHeight / 2 + 1, this.nodeWidth, this.nodeHeight / 2)
                ];
            }
        }
        else {
            // Represent a null pointer with a slash through the pointer section of the node
            const nullSlash = new Line(this.x, this.y, this.x + this.nodeWidth / 4, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
        }
    }

    drawNode(context: CanvasRenderingContext2D, useAreaCoordinates: boolean = true, redrawPointer: boolean = true) {
        this.clearNode(context, useAreaCoordinates);
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
        context.fillText(this.data, this.x + this.nodeWidth / 2, this.y + this.nodeHeight / 2);
        if (redrawPointer) {
            this.drawPointers(context);
        }
        context.restore();
    }

    clearNode(context: CanvasRenderingContext2D, useAreaCoordinates: boolean = true) {
        // Clearing the regions where the pointers are drawn
        if (useAreaCoordinates) {
            this.clearAreaCoordinates1.forEach(Rectangle => {
                context.clearRect(Rectangle.getX(), Rectangle.getY(), Rectangle.getWidth(), Rectangle.getHeight());
            });
            this.clearAreaCoordinates2.forEach(Rectangle => {
                context.clearRect(Rectangle.getX(), Rectangle.getY(), Rectangle.getWidth(), Rectangle.getHeight());
            });
        }

        // Clear the node
        context.clearRect(this.x - 1, this.y - 1, this.nodeWidth + 2, this.nodeHeight + 2);
    }
}
