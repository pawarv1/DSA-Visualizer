import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual CLL nodes
export class CircularLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    isTailNode: boolean;
    next: CircularLLNode | null;
    nodeOpacity: number;
    pointerOpacity: number;
    outlineColor: string;
    fillColor: string;

    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, isTailNode: boolean, nodeOpacity: number = 1, pointerOpacity: number = 1, next: CircularLLNode = this, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.isTailNode = isTailNode;
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

    drawPointer(context: CanvasRenderingContext2D) {
        if (this.next) {
            if (this.isTailNode) {
                const pointerSegments = [
                    new Line(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.pointerOpacity),
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.pointerOpacity),
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.next.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.pointerOpacity),
                    new Line(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.next.x - this.nodeWidth / 2, this.y + this.nodeHeight/2, this.pointerOpacity),
                    new Arrow(this.next.x - this.nodeWidth/2, this.y + this.nodeHeight/2, this.next.x - 2, this.y + this.nodeHeight/2, this.pointerOpacity)
                ];

                pointerSegments.forEach(segment => {
                    segment.draw(context);
                });
            }
            else {
                const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 2, this.next.y + this.next.nodeHeight/2, this.pointerOpacity);
                pointerArrow.draw(context);
            }
        }
        else {
            // Represent a null pointer with a slash through the pointer section of the node
            const nullSlash = new Line(this.x + (this.nodeWidth * 2 / 3), this.y, this.x + this.nodeWidth, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
        }
    }

    drawNode(context: CanvasRenderingContext2D, clearExtra: boolean = true, redrawPointer: boolean = true) {
        this.clearNode(context, clearExtra);
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
    clearNode(context: CanvasRenderingContext2D, clearExtra: boolean = true) { 
        if (this.isTailNode && this.next) {
            context.clearRect(this.x - 1, this.y, this.nodeWidth * 2, this.nodeHeight + 2);
            context.clearRect(this.next.x - this.nodeWidth/2 - 2, this.y + this.nodeHeight + 1, (this.x + this.nodeWidth * 2) - (this.next.x - this.nodeWidth/2), this.nodeHeight);
            context.clearRect(this.next.x - this.nodeWidth/2 - 2, this.y, this.nodeWidth / 2, this.nodeHeight + 2);
        }
        else if (clearExtra) {
            context.clearRect(this.x - 1, this.y - 1, this.nodeWidth * 2, this.nodeHeight + 2);
        }
        else {
            context.clearRect(this.x - 1, this.y - 1, this.nodeWidth + 2, this.nodeHeight + 2);
        }
    }
}
