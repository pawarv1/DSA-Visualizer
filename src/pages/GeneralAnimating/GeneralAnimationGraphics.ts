/*
This component includes all the classes for the various graphic objects the animations will use
GSAP can be used to modify the object fields
The most basic graphic types are in these classes, and more complex ones can be built from them
Each object has its own draw
There are also move, fadeIn, and fadeOut methods which use GSAP and can be called by any object
*/

import gsap from 'gsap';

// Function to move any of the following graphic objects on the canvas, using GSAP
const moveObject = (object: any, x: number, y: number, context: CanvasRenderingContext2D, duration: number = 1, animatingCallback: (params: boolean) => void) => {
    gsap.to(object, {
        x: x,
        y: y,
        duration: duration,
        onUpdate: () => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the canvas
            object.draw(context);
        },
        onComplete: () => {
            animatingCallback(false); // Call the callback function when the animation is complete
        }
    });
}

const fadeOutObject = (object: any, context: CanvasRenderingContext2D, duration: number = 1, animatingCallback: (params: boolean) => void) => {
    gsap.to(object, {
        opacity: 0,
        duration: duration,
        onUpdate: () => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the canvas
            object.draw(context);
        },
        onComplete: () => {
            animatingCallback(false); // Call the callback function when the animation is complete
        }
    });
}

const fadeInObject = (object: any, context: CanvasRenderingContext2D, duration: number = 1, animatingCallback: (params: boolean) => void) => {
    gsap.to(object, {
        opacity: 1,
        duration: duration,
        onUpdate: () => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the canvas
            object.draw(context);
        },
        onComplete: () => {
            animatingCallback(false); // Call the callback function when the animation is complete
        },
    });
}

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
        context.globalAlpha = this.opacity;
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

    highlight(context: CanvasRenderingContext2D, highlightColor: string) {
        this.draw(context); // Draw the rectangle first
        context.globalAlpha = this.opacity;
        context.fillStyle = highlightColor;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    move(x: number, y: number, context: CanvasRenderingContext2D, duration: number = 1, animatingCallback: (params: boolean) => void) {
        moveObject(this, x, y, context, duration, animatingCallback);
    }

    fadeOut(context: CanvasRenderingContext2D, duration: number = 1, animatingCallback: (params: boolean) => void) {
        fadeOutObject(this, context, duration, animatingCallback);
    }

    fadeIn(context: CanvasRenderingContext2D, duration: number = 1, animatingCallback: (params: boolean) => void) {
        fadeInObject(this, context, duration, animatingCallback);
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

    constructor(x: number, y: number, radius: number, opacity: number = 1, outlineColor: string = 'black') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.opacity = opacity;             // Defaults to 1
        this.outlineColor = outlineColor;   // Defaults to black
    }

    static type = "circle";

    draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.opacity;
        context.strokeStyle = this.outlineColor;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.stroke();
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
}