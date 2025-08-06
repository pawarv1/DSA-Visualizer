import { Arrow, Line, Rectangle } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual CLL nodes
export class CircularDLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    next: CircularDLLNode | null;
    prev: CircularDLLNode | null;
    nodeOpacity: number;
    pointerOpacityNext: number;
    pointerOpacityPrev: number;
    outlineColor: string;
    fillColor: string;
    private clearAreaCoordinates1: Rectangle[];
    private clearAreaCoordinates2: Rectangle[];

    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacityNext: number = 1, pointerOpacityPrev: number = 1, next: CircularDLLNode = this, prev: CircularDLLNode = this, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.next = next;
        this.prev = prev;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacityNext = pointerOpacityNext;
        this.pointerOpacityPrev = pointerOpacityPrev;
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

    // Needs fixing
    drawPointers(context: CanvasRenderingContext2D) {
        if (this.next) {
            if (this.next.x <= this.x) {
                const pointerSegments = [
                    new Line(this.x + this.nodeWidth - 4, this.y + this.nodeHeight/4, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/4, this.pointerOpacityNext),
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/4, this.x + this.nodeWidth * 3/2, this.y - this.nodeHeight/2, this.pointerOpacityNext),
                    new Line(this.x + this.nodeWidth * 3/2, this.y - this.nodeHeight/2, this.next.x - this.nodeWidth/2, this.y - this.nodeHeight/2, this.pointerOpacityNext),
                    new Line(this.next.x - this.nodeWidth/2, this.y - this.nodeHeight/2, this.next.x - this.nodeWidth/2, this.y + this.nodeHeight/4, this.pointerOpacityNext),
                    new Arrow(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight/4, this.next.x - 4, this.y + this.nodeHeight/4, this.pointerOpacityNext)
                ];

                pointerSegments.forEach(segment => {
                    segment.draw(context);
                });

                // May need adjusting
                this.clearAreaCoordinates1 = [
                    // out going line
                    new Rectangle(this.x + this.nodeWidth + 1, this.y - 1, this.nodeWidth, this.nodeHeight / 2),
                    // line from curr to next
                    new Rectangle(this.next.x - this.nodeWidth/2 - 2, this.y - this.nodeHeight, (this.x + this.nodeWidth * 1.5) - (this.next.x - this.nodeWidth/2) + 4, this.nodeHeight - 1),
                    // arrow
                    new Rectangle(this.next.x - this.nodeWidth/2 - 4, this.y - 1, this.nodeWidth / 2, this.nodeHeight / 2)
                ];
            }
            else {
                const pointerArrow = new Arrow(this.x + this.nodeWidth - 4, this.y + this.nodeHeight/4, this.next.x - 4, this.next.y + this.nodeHeight/4, this.pointerOpacityNext);
                pointerArrow.draw(context);

                this.clearAreaCoordinates1 = [
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
                const pointerSegments = [
                    new Line(this.x + 4, this.y + this.nodeHeight * 3/4, this.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/4, this.pointerOpacityPrev),
                    new Line(this.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/4, this.x - this.nodeWidth /2, this.y + this.nodeHeight * 3/2),
                    new Line(this.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.prev.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.pointerOpacityNext),
                    new Line(this.prev.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.prev.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/4, this.pointerOpacityNext),
                    new Arrow(this.prev.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/4, this.prev.x + this.nodeWidth + 4, this.y + this.nodeHeight * 3/4, this.pointerOpacityNext)
                ];

                pointerSegments.forEach(segment => {
                    segment.draw(context);
                });

                this.clearAreaCoordinates2 = [
                    // outgoing line
                    new Rectangle(this.x - this.nodeWidth - 1, this.y + this.nodeHeight / 2 + 1, this.nodeWidth, this.nodeHeight / 2),
                    // line from curr to prev
                    new Rectangle(this.x - this.nodeWidth + 1, this.y + this.nodeHeight + 1, (this.prev.x + this.nodeWidth * 2) - (this.x - this.nodeWidth/2) + 4, this.nodeHeight / 2),
                    // arrow
                    new Rectangle(this.prev.x + this.nodeWidth + 1, this.y + this.nodeHeight / 2 + 1, (this.prev.x + this.nodeWidth * 2) - (this.x - this.nodeWidth/2) + 4, this.nodeHeight / 2)
                ];
            }
            else {
                const pointerArrowPrev = new Arrow(this.x + 4, this.y + this.nodeHeight * 3 / 4, this.prev.x + this.nodeWidth + 2, this.prev.y + this.nodeHeight * 3 / 4, this.pointerOpacityPrev);
                pointerArrowPrev.draw(context);

                this.clearAreaCoordinates2 = [
                    new Rectangle(this.x - this.nodeWidth + 1, this.y + this.nodeHeight / 2 + 1, this.nodeWidth, this.nodeHeight / 2)
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

    // Needs fixing
    clearNode(context: CanvasRenderingContext2D, useAreaCoordinates: boolean = true) {
        // Clearing includes pointers
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
