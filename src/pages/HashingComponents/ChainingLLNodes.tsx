import { Arrow, Line } from "../GeneralAnimating/GeneralAnimationGraphics";

// Animates individual SLL nodes
export class HSChainingLLNode {
    x: number;
    y: number;
    nodeWidth: number;
    nodeHeight: number;
    key: any;
    nodeOpacity: number;
    pointerOpacityNext: number;
    next: HSChainingLLNode | null;
    outlineColor: string;
    fillColor: string;

    // Constructor sets next to null by default
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, key: any, nodeOpacity: number = 1, pointerOpacity: number = 1, outlineColor: string = "black", fillColor: string = "white") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.key = key;
        this.nodeOpacity = nodeOpacity;
        this.pointerOpacityNext = pointerOpacity;
        this.next = null;
        this.outlineColor = outlineColor;
        this.fillColor = fillColor;
    }

    protected getTextLines(): string[] {
        return [String(this.key)];
    }

    protected drawText(context: CanvasRenderingContext2D) {
        const lines = this.getTextLines();
        const maxWidth = this.nodeWidth * 2 / 3 - 10;
        const maxHeight = this.nodeHeight - 8;
        let fontSize = 16;

        while (fontSize > 1) {
            context.font = `${fontSize}px Arial`;

            const widestLine = Math.max(
                ...lines.map(line => context.measureText(line).width)
            );

            const totalHeight = lines.length * fontSize * 1.2;
            if (widestLine <= maxWidth && totalHeight <= maxHeight) break;

            fontSize--;
        }

        context.font = `${fontSize}px Arial`;
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        const lineHeight = fontSize * 1.2;
        const centerX = this.x + this.nodeWidth / 3;
        const centerY = this.y + this.nodeHeight / 2;
        const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, i) => {
            context.fillText(line, centerX, startY + i * lineHeight);
        });
    }

    // Function for drawing the next pointer
    drawPointers(context: CanvasRenderingContext2D) {
        if (this.next) {
            // Represent the next pointer with an arrow
            const pointerArrow = new Arrow(this.x + this.nodeWidth - 8, this.y + this.nodeHeight/2, this.next.x - 2, this.next.y + this.next.nodeHeight/2, this.pointerOpacityNext);
            pointerArrow.draw(context);
        } else {
            // Represent a null pointer with a slash through the pointer section of the node
            // To avoid certain bugs, the opacity of the line will be the same as the nodes opacity
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
        context.strokeRect(this.x, this.y, this.nodeWidth * 2 / 3, this.nodeHeight);
        context.strokeRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        this.drawText(context);
        if (redrawPointer) {
            this.drawPointers(context);
        }
        context.restore();
    }
}

export class HMChainingLLNode extends HSChainingLLNode {
    value: number;
    declare next: HMChainingLLNode | null;
    
    constructor(x: number, y: number, nodeWidth: number, nodeHeight: number, key: any, value: number, nodeOpacity: number = 1, pointerOpacity: number = 1, outlineColor: string = "black", fillColor: string = "white") {
        super(x, y, nodeWidth, nodeHeight, key, nodeOpacity, pointerOpacity, outlineColor, fillColor);
        this.value = value;
        this.next = null;
    }

    protected getTextLines(): string[] {
        return [`K: ${String(this.key)}`, `V: ${String(this.value)}`];
    }
}