/*
This component includes all the classes for the various graphic objects the animations will use
The most basic graphic types are in these classes, and more complex ones can be built from them
Each object has its own draw method
*/


// Rectangle Class
export class Rectangle {

    constructor(private x: number, private y: number, private width: number, private height: number, private opacity: number = 1, private outlineColor: string = 'black', private fillColor: string = 'white') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.opacity = opacity;             //Defaults to 1
        this.outlineColor = outlineColor;   //Defaults to black
        this.fillColor = fillColor;         //Defaults to white
    }

    static type = "rectangle";

    // These setters/getters will likely not be used but are included for better encapsulation
    setX = (x: number) => { this.x = x }
    setY = (y: number) => { this.y = y }
    setWidth = (width: number) => { this.width = width }
    setHeight = (height: number) => { this.height = height }
    setOpacity = (opacity: number) => { this.opacity = opacity }
    setOutlineColor = (outlineColor: string) => { this.outlineColor = outlineColor }
    setFillColor = (fillColor: string) => { this.fillColor = fillColor };
    getX = () => { return this.x };
    getY = () => { return this.y };
    getWidth = () => { return this.width }
    getHeight = () => { return this.height }
    getOpacity = () => { return this.opacity }
    getOutlineColor = () => { return this.outlineColor }
    getFillColor = () => { return this.fillColor }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.outlineColor;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
}


// Text Class
export class Text {

    constructor(private x: number, private y: number, private content: string, private opacity: number = 1, private font: string = '16px Arial', private color: string = 'black') {
        this.x = x;
        this.y = y;
        this.content = content;
        this.opacity = opacity;     // Defaults to 1
        this.font = font;           // Defaults to 16px Arial
        this.color = color;         // Defaults to black
    }

    static type = "text";

    // These setters/getters will likely not be used but are included for better encapsulation
    setX = (x: number) => { this.x = x }
    setY = (y: number) => { this.y = y }
    setContent = (content: string) => { this.content = content }
    setOpacity = (opacity: number) => { this.opacity = opacity }
    setFont = (font: string) => { this.font = font }
    setColor = (color: string) => { this.color = color }
    getX = () => { return this.x };
    getY = () => { return this.y };
    getContent = () => { return this.content }
    getOpacity = () => { return this.opacity }
    getFont = () => { return this.font }
    getColor = () => { return this.color }

    // Be aware saving and restoring may cause unexpected behavior for text objects
    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.font = this.font;
        context.fillStyle = this.color;
        context.fillText(this.content, this.x, this.y);
        context.restore();
    }
}


// Circle Class
export class Circle {

    constructor(private x: number, private y: number, private radius: number, private opacity: number = 1, private outlineColor: string = 'black', private fillColor: string = 'white') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.opacity = opacity;             // Defaults to 1
        this.outlineColor = outlineColor;   // Defaults to black
        this.fillColor = fillColor;         // Defaults to white
    }

    static type = "circle";

    // These setters/getters will likely not be used but are included for better encapsulation
    setX = (x: number) => { this.x = x }
    setY = (y: number) => { this.y = y }
    setRadius = (radius: number) => { this.radius = radius }
    setOpacity = (opacity: number) => { this.opacity = opacity }
    setOutlineColor = (outlineColor: string) => { this.outlineColor = outlineColor }
    setFillColor = (fillColor: string) => { this.fillColor = fillColor };
    getX = () => { return this.x };
    getY = () => { return this.y };
    getRadius = () => { return this.radius }
    getOpacity = () => { return this.opacity }
    getOutlineColor = () => { return this.outlineColor }
    getFillColor = () => { return this.fillColor }
    
    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.outlineColor;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
        context.closePath();
        context.restore();
    }
}


// Line Class
export class Line {

    constructor(private startX: number, private startY: number, private endX: number, private endY: number, private opacity: number = 1, private color: string = 'black', private lineWidth: number = 1) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.opacity = opacity;         // Defaults to 1
        this.color = color;             // Defaults to black
        this.lineWidth = lineWidth;     // Defaults to 1
    }
 
    static type = "line";

    // These setters/getters will likely not be used but are included for better encapsulation
    setStartX = (startX: number) => { this.startX = startX }
    setStartY = (startY: number) => { this.startY = startY }
    setEndX = (endX: number) => { this.endX = endX }
    setEndY = (endY: number) => { this.endY = endY }
    setOpacity = (opacity: number) => { this.opacity = opacity }
    setColor = (color: string) => { this.color = color }
    setLineWidth = (lineWidth: number) => { this.lineWidth = lineWidth }
    getStartX = () => { return this.startX }
    getStartY = () => { return this.startY }
    getEndX = () => { return this.endX }
    getEndY = () => { return this.endY }
    getLineWidth = () => { return this.lineWidth }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.lineTo(this.endX, this.endY);
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.stroke();
        context.restore();
    }
}


// Arrow Class
export class Arrow {

    constructor(private startX: number, private startY: number, private endX: number, private endY: number, private opacity: number = 1, private color: string = 'black', private lineWidth: number = 1, private headLength: number = 10) {
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

    // These setters/getters will likely not be used but are included for better encapsulation
    setStartX = (startX: number) => { this.startX = startX }
    setStartY = (startY: number) => { this.startY = startY }
    setEndX = (endX: number) => { this.endX = endX }
    setEndY = (endY: number) => { this.endY = endY }
    setOpacity = (opacity: number) => { this.opacity = opacity }
    setColor = (color: string) => { this.color = color }
    setLineWidth = (lineWidth: number) => { this.lineWidth = lineWidth }
    setHeadLength = (headLength: number) => { this.headLength = headLength }
    getStartX = () => { return this.startX }
    getStartY = () => { return this.startY }
    getEndX = () => { return this.endX }
    getEndY = () => { return this.endY }
    getLineWidth = () => { return this.lineWidth }
    getHeadLength = () => { return this.headLength }

    draw(context: CanvasRenderingContext2D) {
        context.save();

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

        context.restore();
    }
}