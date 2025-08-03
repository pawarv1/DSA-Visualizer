import gsap, { timeline } from 'gsap';
import { ArrayCell2D } from './ArrayCell';

// Current implementation cannot show index numbers

// 2D Array Class
export class Array2D {
    private cells: ArrayCell2D[][];

    constructor(private x: number, private y: number, private cellWidth: number, private cellHeight: number, private rows: number, private columns: number, contents: any[], private opacity: number = 1) {
        if (rows * columns != contents.length) {
            console.error("INVALID SHAPE");
            this.cells = [];
            return;
        }

        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.rows = rows;
        this.columns = columns;
        this.opacity = opacity;
        this.cells = new Array(rows);

        for (let i = 0; i < rows; i++) {
            this.cells[i] = new Array(columns);
        }

        for (let i = 0; i < contents.length; i++) {
            const currRow = Math.floor(i / columns);
            const currCol = i % columns;
            this.cells[currRow][currCol] = new ArrayCell2D(this.x + currCol * this.cellWidth, this.y + currRow * this.cellHeight, currRow, currCol, this.cellWidth, this.cellHeight, contents[i], this.opacity, "black", "white");
        }
    }

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        if (drawIndex) {
            let fontSize = Math.min(12, Math.floor(this.cellWidth / 4));
            context.save();
            context.globalAlpha = this.opacity;
            context.fillStyle = 'black';
            context.font = `${fontSize}px Arial`;
            context.textAlign = 'center';
            context.textBaseline = 'top';
            
            for (let c = 0; c < this.columns; c++) {
                context.fillText(c.toString(), this.x + (this.cellWidth * c) + this.cellWidth / 2, this.y - 14);
            }
            for (let r = 0; r < this.rows; r++) {
                context.fillText(r.toString(), this.x - 10, this.y + (this.cellHeight * r) + this.cellHeight / 2);
            }
            context.restore();
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cell = this.cells[i][j];
                cell.opacity = this.opacity;
                cell.drawCell(context, false);
            }
        }
    }

    // Throws RangeError if either index is out of bounds
    checkIndexValidity(rowIndex: number, columnIndex: number) {
        if ((rowIndex < 0 || rowIndex >= this.rows) || (columnIndex < 0 || columnIndex >= this.columns)) {
            console.error(`[${rowIndex}, ${columnIndex}] is out of bounds`);
            return false;
        }
        return true;
    }

    // Set the element at the given indexes
    setElementAt(context: CanvasRenderingContext2D, rowIndex: number, columnIndex: number, newElement: any) {
        if (this.checkIndexValidity(rowIndex, columnIndex)) {
            this.cells[rowIndex][columnIndex].content = newElement;
            this.cells[rowIndex][columnIndex].drawCell(context, false);
        }
    }

    // Can change opacity of an individual cell or all the cells
    setOpacity(context: CanvasRenderingContext2D, index: string | [number, number], opacity: number, redraw: boolean = true) {
        if (typeof index === 'string') {
            this.opacity = opacity;
            if (redraw) {
                this.draw(context);
            }
        }
        else {
            if (this.checkIndexValidity(index[0], index[1])) {
                this.cells[index[0]][index[1]].opacity = opacity;

                if (redraw) {
                    this.cells[index[0]][index[1]].drawCell(context, false);
                }
            }
        }
    }

    // Can change outline color of an individual cell
    setOutlineColor(context: CanvasRenderingContext2D, rowIndex: number, columnIndex: number, outlineColor: string, redraw: boolean = true) {
        if (this.checkIndexValidity(rowIndex, columnIndex)) {
            this.cells[rowIndex][columnIndex].outlineColor = outlineColor;

            if (redraw) {
                this.cells[rowIndex][columnIndex].drawCell(context, false);
            }
        }
    }

    // Can change fill color of an individual cell
    setFillColor(context: CanvasRenderingContext2D, rowIndex: number, columnIndex: number, fillColor: string, redraw: boolean = true) {
        if (this.checkIndexValidity(rowIndex, columnIndex)) {
            this.cells[rowIndex][columnIndex].fillColor = fillColor;

            if (redraw) {
                this.cells[rowIndex][columnIndex].drawCell(context, false);
            }
        }
    }

    // Get the row size of the array
    getArraySize() {
        return this.cells.length;
    }

    // Get the column size of the array
    getArraySizeAtRow(rowIndex: number) {
        if (rowIndex < 0 || rowIndex >= this.rows) {
            console.error(`${rowIndex} is out of bounds`);
            return false;
        }
        return this.cells[rowIndex].length;
    }

    // Return the element at the given indexes
    getElementAt(rowIndex: number, columnIndex: number) {
        if (this.checkIndexValidity(rowIndex, columnIndex)) {
            return this.cells[rowIndex][columnIndex].content;
        }
    }

    // For debugging, get rid of later
    printDEBUG() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                console.log(`${i},${j}`);
                console.log(this.cells[i][j].content);
            }
        }
    }

    // Traverse through the array and print each element
    // Hightlight and change outline color of the current element
    async print(context: CanvasRenderingContext2D) {
        await new Promise<void>((resolve) => {
            // Resolve after the timeline animation completes
            const timeline = gsap.timeline({onComplete: () => { resolve() }});
        
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    timeline.to(this, {
                        duration: 1,
                        onUpdate: () => {
                            if (i != 0) {
                                if (j == 0) {
                                    this.setOutlineColor(context, i - 1, this.columns - 1, "black");
                                    this.setFillColor(context, i - 1, this.columns - 1, "white");
                                }
                            }
                            if (j != 0) {
                                this.setOutlineColor(context, i, j - 1, "black");
                                this.setFillColor(context, i, j - 1, "white");
                            }
                            this.setOutlineColor(context, i, j, "red");
                            this.setFillColor(context, i, j, "yellow");
                            console.log(this.getElementAt(i, j));
                        }
                    });
                }
            }
        });
    }

    // Animate the swap of two elements through fading
    async swapElements(context: CanvasRenderingContext2D, rowIndex1: number, columnIndex1: number, rowIndex2: number, columnIndex2: number,) {
        if (this.checkIndexValidity(rowIndex1, columnIndex1) && this.checkIndexValidity(rowIndex2, columnIndex2)) {
            const cell1 = this.cells[rowIndex1][columnIndex1];
            const cell2 = this.cells[rowIndex2][columnIndex2];
            cell1.fillColor = "yellow";
            cell2.fillColor = "yellow";
            
            // Fade out both cells
            const fadeOut = () => new Promise<void>((resolve) => {
                gsap.to([cell1, cell2], {
                    opacity: 0,
                    duration: 1,
                    onUpdate: () => {
                        cell1.clear(context);
                        cell2.clear(context);
                        cell1.drawCell(context, false);
                        cell2.drawCell(context, false);
                    },
                    onComplete: () => resolve()
                });
            });

            // Swap the contents while the two cells are still faded out 
            const swapContent = () => {
                const temp = cell1.content;
                cell1.content = cell2.content;
                cell2.content = temp;
            };

            // Fade the swapped cells back in
            const fadeIn = () => new Promise<void>((resolve) => {
                gsap.to([cell1, cell2], {
                    opacity: 1,
                    duration: 1,
                    onUpdate: () => {
                        cell1.clear(context);
                        cell2.clear(context);
                        cell1.drawCell(context, false);
                        cell2.drawCell(context, false);
                    },
                    onComplete: () => resolve()
                });
            });

            await fadeOut();
            swapContent();
            await fadeIn();
            // Reset the fill color back to what it was without redrawing
            cell1.fillColor = "white";
            cell2.fillColor = "white";
        }
    }

    // Clear the array
    clear(context: CanvasRenderingContext2D) {
        // Need to clear more space to account for index numbers
        context.clearRect(this.x - 15, this.y - 15, (this.cellWidth * this.rows) + 16, (this.cellHeight * this.columns) + 16);
    }
}