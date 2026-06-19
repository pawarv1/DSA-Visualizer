// ArrayCell Class, animates individual array cells
export class ArrayCell<T> {
    x: number;
    y: number;
    cellWidth: number;
    cellHeight: number;
    content: T | null;
    opacity: number;
    outlineColor: string;
    fillColor: string;

    constructor(x: number, y: number, cellWidth: number, cellHeight: number, content: T, opacity: number = 1, outlineColor: string = 'black', fillColor: string = 'white') {
        this.x = x; 
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.content = content;
        this.opacity = opacity;
        this.outlineColor = outlineColor;     
        this.fillColor = fillColor;
    }

    // Adjust font size to fit within the cell
    protected adjustFontSize(context: CanvasRenderingContext2D) {
        let fontSize = 16;

        context.save();
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        while (fontSize > 1) {
            const font = `${fontSize}px Arial`;
            context.font = font;
            const textWidth = context.measureText(String(this.content)).width;
            if (textWidth <= this.cellWidth - 10) {
                context.restore();
                return font;
            }
            fontSize--;
        }

        context.restore();
        return `1px Arial`;
    }

    // Draw the cell
    drawCell(context: CanvasRenderingContext2D, clearExtra: boolean = true) {
        const displayContent = (this.content === null)? "": String(this.content);
        this.clear(context, clearExtra);
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = this.adjustFontSize(context);
        context.fillText(displayContent, this.x + this.cellWidth / 2, this.y + this.cellHeight / 2);
        context.restore();
    }

    clear(context: CanvasRenderingContext2D, extraHeightNeeded: boolean = true) {
        // Clear extra space to remove index numbers (if they are drawn)
        if (extraHeightNeeded) {
            // Have to add extra height to account for index numbers below the cells
            const extraHeight = 18; // 3px offset + ~12px font + 3px buffer
            context.clearRect(this.x - 1, this.y - 1, this.cellWidth + 2, this.cellHeight + extraHeight);
        }
        // Just clear the array cell
        else {
            context.clearRect(this.x - 1, this.y - 1, this.cellWidth + 2, this.cellHeight + 2);
        }
    }
}


// ArrayCell for dynamic arrays
export class DynamicArrayCell<T> extends ArrayCell<T> {
    index: number;
    inUse: boolean;
    font: string;

    constructor(x: number, y: number, index: number, cellWidth: number, cellHeight: number, content: T, opacity: number = 1, inUse: boolean = true, outlineColor: string = 'black', fillColor: string = 'white') {
        super(x, y, cellWidth, cellHeight, content, opacity, outlineColor, fillColor);
        this.index = index;
        this.inUse = inUse;
        this.font = '16px Arial';   // Track font for element movement during resizing
    }

    // Displays the index number of the cell
    protected drawIndex(context: CanvasRenderingContext2D) {
        let fontSize = Math.min(12, Math.floor(this.cellWidth / 4));
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = 'black';
        context.font = `${fontSize}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillText(this.index.toString(), this.x + this.cellWidth / 2, this.y + this.cellHeight + 3);
        context.restore();
    }

    // Draw the cell
    drawCell(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        const displayContent = (this.content === null)? "": String(this.content);
        this.clear(context, drawIndex);
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.inUse ? this.fillColor : "#f0f0f0"; // Dim the cell if it is not in use, for dynamic arrays
        context.fillRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        this.font = this.adjustFontSize(context);
        context.font = this.font;
        context.fillText(displayContent, this.x + this.cellWidth / 2, this.y + this.cellHeight / 2);
        context.restore();

        if (drawIndex) {
            this.drawIndex(context);
        }
    }
}