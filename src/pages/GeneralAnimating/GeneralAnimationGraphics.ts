/*
This component includes all the classes for the various graphic objects the animations will use
GSAP can be used to modify the object fields
The most basic graphic types are in these classes, and more complex ones can be built from them
Each object has its own draw and clear methods
*/

// Rectangle Class
export class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
    outlineColor: string;

    constructor(x: number, y: number, width: number, height: number, opacity: number = 1, outlineColor: string = 'black') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.opacity = opacity;             //Defaults to 1
        this.outlineColor = outlineColor;   //Defaults to black
    }

    static type = "rectangle";

    draw(context: CanvasRenderingContext2D) {
        context.save(); // Save current state of the canvas
        context.globalAlpha = this.opacity;
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.restore(); // Restore original state
    }

    clear(context: CanvasRenderingContext2D) {
        // Expanding the clearing area slightly to cover anti-aliasing edges
        context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    }
}


// Text Class
export class Text {
    x: number;
    y: number;
    content: string;
    opacity: number;
    font: string;
    color: string;
    textAlign: string;
    textBaseline: string;

    constructor(x: number, y: number, content: string, opacity: number = 1, font: string = '16px Arial', color: string = 'black', textAlign: string = 'start') {
        this.x = x;
        this.y = y;
        this.content = content;
        this.opacity = opacity;     // Defaults to 1
        this.font = font;           // Defaults to 16px Arial
        this.color = color;         // Defaults to black
        this.textAlign = textAlign; // Defaults to start 
        this.textBaseline = 'top';  // Ensures the y-coordinate is the top of the text
    }

    static type = "text";

    draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.opacity;
        context.font = this.font;
        context.fillStyle = this.color;
        context.fillText(this.content, this.x, this.y);
        context.font = '16px Arial'; // Reset font to default
    }

    clear(context: CanvasRenderingContext2D) {
        const metrics = context.measureText(this.content);
        const textWidth = metrics.width;
        const textHeight = parseInt(this.font, 10); // Rough estimate of height based on font size
        context.clearRect(this.x, this.y, textWidth, textHeight);
    }
}


// Circle Class
export class Circle {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    outlineColor: string;

    constructor(x: number, y: number, radius: number, opacity: number = 1, outlineColor: string = 'black') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.opacity = opacity;             // Defaults to 1
        this.outlineColor = outlineColor;   // Defaults to black
    }

    static type = "circle";

    draw(context: CanvasRenderingContext2D) {
        context.save(); // Save current state of the canvas
        context.globalAlpha = this.opacity;
        context.strokeStyle = this.outlineColor;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.stroke();
        context.restore(); // Restore to original state before this function
    }

    clear(context: CanvasRenderingContext2D) {
        // Clear a larger area to ensure no artifacts remain
        context.clearRect(this.x - this.radius - 5, this.y - this.radius - 5, this.radius * 2 + 10, this.radius * 2 + 10);
    }
}


// Line Class
export class Line {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    opacity: number;
    color: string;
    lineWidth: number;

    constructor(startX: number, startY: number, endX: number, endY: number, opacity: number = 1, color: string = 'black', lineWidth: number = 1) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.opacity = opacity;         // Defaults to 1
        this.color = color;             // Defaults to black
        this.lineWidth = lineWidth;     // Defaults to 1
    }

    static type = "line";

    draw(context: CanvasRenderingContext2D) {
        context.save(); // Save current state of the canvas
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.stroke();
        context.restore(); // Restore original state
    }

    clear(context: CanvasRenderingContext2D) {
        // Clear an area slightly larger than the line to ensure all is erased
        let extra = this.lineWidth;
        context.clearRect(Math.min(this.startX, this.endX) - extra, Math.min(this.startY, this.endY) - extra, Math.abs(this.startX - this.endX) + 2 * extra, Math.abs(this.startY - this.endY) + 2 * extra);
    }
}


// Arrow Class
export class Arrow {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    opacity: number;
    color: string;
    lineWidth: number;
    headLength: number;

    constructor(startX: number, startY: number, endX: number, endY: number, opacity: number = 1, color: string = 'black', lineWidth: number = 1, headLength: number = 10) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.opacity = opacity;         // Defaults to 1
        this.color = color;             // Defaults to black
        this.lineWidth = lineWidth;     // Defaults to 1
        this.headLength = headLength;   // Length of the arrow head lines, defaults to 10
    }

    static type = "arrow";

    draw(context: CanvasRenderingContext2D) {
        context.save(); // Save current state of the canvas

        // Set styles for the arrow
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.globalAlpha = this.opacity;

        // Start drawing the line
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.stroke();

        // Calculate the angle of the line
        const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

        // Start drawing the arrow head
        context.beginPath();
        context.moveTo(this.endX, this.endY);
        context.lineTo(this.endX - this.headLength * Math.cos(angle - Math.PI / 6), 
                       this.endY - this.headLength * Math.sin(angle - Math.PI / 6));
        context.lineTo(this.endX - this.headLength * Math.cos(angle + Math.PI / 6), 
                       this.endY - this.headLength * Math.sin(angle + Math.PI / 6));
        context.lineTo(this.endX, this.endY)
        context.closePath();
        context.fill();
        context.restore(); // Restore original state
    }

    clear(context: CanvasRenderingContext2D) {
        // Clear an area slightly larger than the arrow to ensure all is erased
        let extra = this.lineWidth + this.headLength;
        let minX = Math.min(this.startX, this.endX) - extra;
        let minY = Math.min(this.startY, this.endY) - extra;
        let maxX = Math.max(this.startX, this.endX) + extra;
        let maxY = Math.max(this.startY, this.endY) + extra;
        context.clearRect(minX, minY, maxX - minX, maxY - minY);
    }
}