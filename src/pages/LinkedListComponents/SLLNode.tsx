import gsap from "gsap";
import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual SLL nodes
export class LinkedListNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    data: any;
    nodeOpacity: number;
    pointerOpacity: number;
    next: LinkedListNode | null;
    outlineColor: string;
    fillColor: string;
    renderNextOverride: LinkedListNode | null = null;

    // Constructor sets next to null by default
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, data: any, nodeOpacity: number = 1, pointerOpacity: number = 1, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacity = pointerOpacity;
        this.next = null;
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
            textWidth = context.measureText(this.data).width;
        }
        return context.font;
    }

    // Function for drawing the next pointer
    drawPointer(context: CanvasRenderingContext2D) {
        const target = this.renderNextOverride ?? this.next;

        if (target) {
            // Represent the next pointer with an arrow
            const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, target.x - 2, target.y + target.nodeHeight/2, this.pointerOpacity);
            pointerArrow.draw(context);
        } else {
            // Represent a null pointer with a slash through the pointer section of the node
            // To avoid certain bugs, the opacity of the line will be the same as the nodes opacity
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