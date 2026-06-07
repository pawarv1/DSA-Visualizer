import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";
import { SLLNode } from "./SLLNode";

// Animates individual CLL nodes
export class CircularLLNode extends SLLNode {
    next: CircularLLNode | null;

    // By default a node next pointer points to itself
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacityNext: number = 1, isSentinel: boolean = false, outlineColor: string = "black", fillColor: string = "white") {
        super(x, y, nodeWidth, nodeHeight, data, nodeOpacity, pointerOpacityNext, isSentinel, outlineColor, fillColor)
        this.next = this;
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
}
