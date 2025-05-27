/*
This component includes all the classes for the various graphic objects the animations will use
The most basic graphic types are in these classes, and more complex ones can be built from them
Each object has its own draw method
*/

import gsap from 'gsap';


// Rectangle Class
export class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
    outlineColor: string;
    fillColor: string;

    constructor(x: number, y: number, width: number, height: number, opacity: number = 1, outlineColor: string = 'black', fillColor: string = 'transparent') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.opacity = opacity;             //Defaults to 1
        this.outlineColor = outlineColor;   //Defaults to black
        this.fillColor = fillColor;         //Defaults to transparent
    }

    static type = "rectangle";

    draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.opacity;
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.outlineColor;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
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

    constructor(x: number, y: number, content: string, opacity: number = 1, font: string = '16px Arial', color: string = 'black') {
        this.x = x;
        this.y = y;
        this.content = content;
        this.opacity = opacity;     // Defaults to 1
        this.font = font;           // Defaults to 16px Arial
        this.color = color;         // Defaults to black
    }

    static type = "text";

    draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.opacity;
        context.font = this.font;
        context.fillStyle = this.color;
        context.fillText(this.content, this.x, this.y);
    }
}


// Circle Class
export class Circle {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    outlineColor: string;
    fillColor: string;

    constructor(x: number, y: number, radius: number, opacity: number = 1, outlineColor: string = 'black', fillColor: string = 'transparent') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.opacity = opacity;             // Defaults to 1
        this.outlineColor = outlineColor;   // Defaults to black
        this.fillColor = fillColor;         // Defaults to transparent
    }

    static type = "circle";

    draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.opacity;
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.outlineColor;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        context.closePath();
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
        context.globalAlpha = this.opacity;
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.stroke();
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

        // Set styles for the arrow
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.globalAlpha = this.opacity;

        // Calculate the angle of the line
        const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);

        // Compute the end position of the line just before the arrowhead
        const lineEndX = this.endX - (0.7 * this.headLength) * Math.cos(angle);
        const lineEndY = this.endY - (0.7 * this.headLength) * Math.sin(angle);

        // Draw the shortened line
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(lineEndX, lineEndY);
        context.stroke();

        // Draw the arrowhead
        context.beginPath();
        context.moveTo(this.endX, this.endY);
        context.lineTo(this.endX - this.headLength * Math.cos(angle - Math.PI / 6), 
                       this.endY - this.headLength * Math.sin(angle - Math.PI / 6));
        context.lineTo(this.endX - this.headLength * Math.cos(angle + Math.PI / 6), 
                       this.endY - this.headLength * Math.sin(angle + Math.PI / 6));
        context.lineTo(this.endX, this.endY)
        context.closePath();
        context.fill();
    }
}