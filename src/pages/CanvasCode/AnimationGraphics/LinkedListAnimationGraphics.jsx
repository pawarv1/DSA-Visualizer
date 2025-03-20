import { Arrow, Text } from './GeneralAnimationGraphics';


export class LinkedListNode {
    constructor(x, y, nodeWidth, nodeHeight, data, opacity = 1, outlineColor = "black", next = null) {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.data = data;
        this.opacity = opacity;
        this.outlineColor = outlineColor;
        this.next = next;
        this.pointerArrow = new Arrow(this. x + this.nodeWidth * (5/6), this.y + this.nodeHeight / 2, this.nodeWidth * 2 + this.nodeWidth / 6, this.y + this.nodeHeight / 2);
    }

    static type = "LinkedListNode"

    // Adjust font size to fit within the node
    adjustFontSize(context) {
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

    // Draw the node, optionally with highlight
    drawNode(context, highlight = false, outlineHighlight = false, highlightColor = "yellow", outlineHighlightColor = "red") {
        context.save(); // Save current state of the canvas
        this.clear(context);

        if (highlight) {
            context.fillStyle = highlightColor;
            context.fillRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        }
        
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = 'black';
        context.globalAlpha = this.opacity;

        if (outlineHighlight) {
            context.strokeStyle = outlineHighlightColor;
        }
        else {
            context.strokeStyle = this.outlineColor;
        }

        // Adjust font size based on data and node dimensions
        const font = this.adjustFontSize(context);
        context.font = font;

        context.strokeRect(this.x, this.y, this.nodeWidth * 2/3, this.nodeHeight);
        context.strokeRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
        context.fillText(this.data, this.x + this.nodeWidth / 3, this.y + this.nodeHeight / 2);

        this.pointerArrow.draw(context);
        
        if (this.next == null) {
            const text1 = new Text(1 + this.nodeWidth * 2 + this.nodeWidth / 6, this.y + this.y/3, "NULL");
            text1.draw(context);
        }

        context.restore(); // Restore original state
    }

    //Clear probably needs fixing

    clear(context) { 
        context.clearRect(this.x, this.y, this.nodeWidth, this.nodeHeight);
    }
}

/*
export class LinkedList {
    constructor(x, y, nodeWidth, nodeHeight, nodes, opacity = 1, outlineColor = "black") {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.nodes = nodes
        this.opacity = opacity;
        this.outlineColor = outlineColor;
    }

    static type = "LinkedList";


}
*/