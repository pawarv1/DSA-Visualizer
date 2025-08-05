import { Arrow, Line, Rectangle } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual CLL nodes
export class CircularLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    next: CircularLLNode | null;
    nodeOpacity: number;
    pointerOpacity: number;
    outlineColor: string;
    fillColor: string;
    private clearAreaCoordinates: Rectangle[];

    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacity: number = 1, next: CircularLLNode = this, outlineColor: string = "black", fillColor: string = "white") {
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

    drawPointer(context: CanvasRenderingContext2D) {
        if (this.next) {
            if (this.next.x <= this.x) {
                const pointerSegments = [
                    new Line(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.pointerOpacity),
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.pointerOpacity),
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.next.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.pointerOpacity),
                    new Line(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.next.x - this.nodeWidth / 2, this.y + this.nodeHeight/2, this.pointerOpacity),
                    new Arrow(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight/2, this.next.x - 4, this.y + this.nodeHeight/2, this.pointerOpacity)
                ];

                pointerSegments.forEach(segment => {
                    segment.draw(context);
                });
                
                this.clearAreaCoordinates = [
                    new Rectangle(this.x - 1, this.y - 1, this.nodeWidth * 2, this.nodeHeight + 2),
                    new Rectangle(this.next.x - this.nodeWidth/2 - 2, this.y + this.nodeHeight + 1, (this.x + this.nodeWidth * 1.5) - (this.next.x - this.nodeWidth/2) + 4, this.nodeHeight),
                    new Rectangle(this.next.x - this.nodeWidth/2 - 4, this.y - 1, this.nodeWidth / 2, this.nodeHeight + 2)
                ];
            }
            else {
                const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 4, this.next.y + this.next.nodeHeight/2, this.pointerOpacity);
                pointerArrow.draw(context);

                this.clearAreaCoordinates = [
                    new Rectangle(this.x - 1, this.y - 1, this.nodeWidth * 2, this.nodeHeight + 2)
                ];
            }
        }
        else {
            // Represent a null pointer with a slash through the pointer section of the node
            const nullSlash = new Line(this.x + (this.nodeWidth * 2 / 3), this.y, this.x + this.nodeWidth, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);

            this.clearAreaCoordinates = [
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

    // Needs fixing
    clearNode(context: CanvasRenderingContext2D, useAreaCoordinates: boolean = true) {
        // Clearing includes pointers
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
