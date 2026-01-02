import gsap from "gsap";
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
    renderNextOverride: CircularLLNode | null = null;

    // By default a node next pointer points to itself
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacity: number = 1, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacity = pointerOpacity;
        this.next = this;
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

    // May need adjusting
    drawPointer(context: CanvasRenderingContext2D) {
        const target = this.renderNextOverride ?? this.next;

        if (target) {
            if (target.x <= this.x) {
                const pointerSegments = [
                    // Line 1
                    new Line(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.pointerOpacity),
                    // Line 2
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight/2, this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, this.pointerOpacity),
                    // Line 3
                    new Line(this.x + this.nodeWidth * 3/2, this.y + this.nodeHeight * 3/2, target.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, this.pointerOpacity),
                    // Line 4
                    new Line(target.x - this.nodeWidth/2, this.y + this.nodeHeight * 3/2, target.x - this.nodeWidth / 2, this.y + this.nodeHeight/2, this.pointerOpacity),
                    // Arrow 1
                    new Arrow(target.x - this.nodeWidth/2, this.y + this.nodeHeight/2, target.x - 4, this.y + this.nodeHeight/2, this.pointerOpacity)
                ];

                // Draw each of the graphics in pointerSegments
                pointerSegments.forEach(segment => {
                    segment.draw(context);
                });
            }
            else {
                const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, target.x - 4, target.y + target.nodeHeight/2, this.pointerOpacity);
                pointerArrow.draw(context);
            }
        }
        else {
            // Represent a null pointer with a slash through the pointer section of the node
            const nullSlash = new Line(this.x + (this.nodeWidth * 2 / 3), this.y, this.x + this.nodeWidth, this.y + this.nodeHeight, this.nodeOpacity);
            nullSlash.draw(context);
        }
    }

    fadeToNodeOpacity(opacity: number, duration: number) {
        return new Promise<void>(resolve => {
            gsap.to(this, { nodeOpacity: opacity, duration, onComplete: resolve });
        });
    }

    fadeToPointerOpacity(opacity: number, duration: number) {
        return new Promise<void>(resolve => {
            gsap.to(this, { pointerOpacity: opacity, duration, onComplete: resolve });
        });
    }

    moveTo(x: number, y: number, duration: number) {
        return new Promise<void>(resolve => {
            gsap.to(this, { x, y, duration, onComplete: resolve });
        });
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
        context.fillText(this.data, this.x + this.nodeWidth / 3, this.y + this.nodeHeight / 2);
        if (redrawPointer) {
            this.drawPointer(context);
        }
        context.restore();
    }
}
