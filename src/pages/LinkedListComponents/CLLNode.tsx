import { Arrow, Line, Rectangle } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual CLL nodes
export class CircularLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacity: number;
    next: CircularLLNode | null;
    outlineColor: string;
    fillColor: string;
    private clearAreaCoordinates: Rectangle[];  // Covers the region where the node and the next pointer is drawn

    // By default a node next pointer points to itself
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacity: number = 1, next: CircularLLNode = this, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacity = pointerOpacity;
        this.next = next;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
        this.clearAreaCoordinates = [];
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

    // May need adjusting
    drawPointer(context: CanvasRenderingContext2D) {
        if (this.next) {
            if (this.next.x <= this.x) {
                const pointerSegments = [
                    // Line 1
                    new Line(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.pointerOpacity),
                    // Line 2
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.pointerOpacity),
                    // Line 3
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.next.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.pointerOpacity),
                    // Line 4
                    new Line(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.next.x - this.nodeWidth / 2, this.y + this.nodeHeight/2, this.pointerOpacity),
                    // Arrow 1
                    new Arrow(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight/2, this.next.x - 4, this.y + this.nodeHeight/2, this.pointerOpacity)
                ];

                // Draw each of the graphics in pointerSegments
                pointerSegments.forEach(segment => {
                    segment.draw(context);
                });
                
                // May need adjusting
                this.clearAreaCoordinates = [
                    // This clears the region with the node, Line 1 and Line 2
                    new Rectangle(this.x - 1, this.y - 1, this.nodeWidth * 2, this.nodeHeight + 2),
                    // This clears the region with Line 3
                    new Rectangle(this.next.x - this.nodeWidth/2 - 2, this.y + this.nodeHeight + 1, (this.x + this.nodeWidth * 1.5) - (this.next.x - this.nodeWidth/2) + 4, this.nodeHeight),
                    // This clears the region with Line 4 and Arrow 1
                    new Rectangle(this.next.x - this.nodeWidth/2 - 4, this.y - 1, this.nodeWidth / 2, this.nodeHeight + 2)
                ];
            }
            else {
                const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 4, this.next.y + this.next.nodeHeight/2, this.pointerOpacity);
                pointerArrow.draw(context);

                this.clearAreaCoordinates = [
                    // This clears the region where the node and pointerArrow are drawn
                    new Rectangle(this.x - 1, this.y - 1, this.nodeWidth * 2, this.nodeHeight + 2)
                ];
            }
        }
        else {
            // Represent a null pointer with a slash through the pointer section of the node
            const nullSlash = new Line(this.x + (this.nodeWidth * 2 / 3), this.y, this.x + this.nodeWidth, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);

            this.clearAreaCoordinates = [
                // This clears the region where the node is drawn
                new Rectangle(this.x - 1, this.y - 1, this.nodeWidth + 2, this.nodeHeight + 2)
            ];
        }
    }

    drawNode(context: CanvasRenderingContext2D, useAreaCoordinates: boolean = true, redrawPointer: boolean = true) {
        this.clearNode(context, useAreaCoordinates);
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

    // May need fixing / adjusting
    clearNode(context: CanvasRenderingContext2D, useAreaCoordinates: boolean = true) {
        // Clearing the regions where both the node and the pointer is drawn
        if (useAreaCoordinates) {
            this.clearAreaCoordinates.forEach(Rectangle => {
                context.clearRect(Rectangle.getX(), Rectangle.getY(), Rectangle.getWidth(), Rectangle.getHeight());
            });
        }
        // Clear only the node
        else {
            context.clearRect(this.x - 1, this.y - 1, this.nodeWidth + 2, this.nodeHeight + 2);
        }
    }
}
