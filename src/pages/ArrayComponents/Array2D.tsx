import gsap from 'gsap';
import { ArrayCell } from './ArrayCell';

// 2D Array Class
export class Array2D<T> {
    private cells: ArrayCell<T | null>[][];

    constructor(private x: number, private y: number, private cellWidth: number, private cellHeight: number, private rows: number, private columns: number, contents: T[], private opacity: number = 1) {
        // Cannot make a 2D array if its shape is invalid
        const capacity = rows * columns;

        if (contents.length > capacity) {
            console.error(
                `Too many elements (${contents.length}) for a ${rows}x${columns} array (${capacity} cells)`
            );
            this.cells = [];
            return;
        }

        // Allocate an array of the row length
        this.cells = new Array(rows);

        // At each row allocate an array of the column length
        for (let i = 0; i < rows; i++) {
            this.cells[i] = new Array(columns);
        }

        // Calculate each row and column from the 1D input array
        for (let i = 0; i < rows * columns; i++) {
            const currRow = Math.floor(i / columns);
            const currCol = i % columns;
            this.cells[currRow][currCol] = new ArrayCell<T | null>(this.x + currCol * this.cellWidth, this.y + currRow * this.cellHeight, this.cellWidth, this.cellHeight, contents[i] ?? null, this.opacity);
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
            
            // Print the column index on the top of the 2d array
            for (let c = 0; c < this.columns; c++) {
                context.fillText(c.toString(), this.x + (this.cellWidth * c) + this.cellWidth / 2, this.y - 14);
            }
            // Print the row index to the left of the 2d array
            for (let r = 0; r < this.rows; r++) {
                context.fillText(r.toString(), this.x - 10, this.y + (this.cellHeight * r) + this.cellHeight * 2/3);
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

    // Returns false if either index is out of bounds
    checkIndexValidity(rowIndex: number, columnIndex: number) {
        if ((rowIndex < 0 || rowIndex >= this.rows) || (columnIndex < 0 || columnIndex >= this.columns)) {
            console.error(`[${rowIndex}, ${columnIndex}] is out of bounds`);
            return false;
        }
        return true;
    }

    // Set the element at the given indexes
    setElementAt(context: CanvasRenderingContext2D, rowIndex: number, columnIndex: number, newElement: T) {
        if (this.checkIndexValidity(rowIndex, columnIndex)) {
            this.cells[rowIndex][columnIndex].content = newElement;
            this.cells[rowIndex][columnIndex].drawCell(context, false);
        }
    }

    // Can change opacity of an individual cell or all the cells
    setOpacity(context: CanvasRenderingContext2D, index: "all" | [number, number], opacity: number, redraw: boolean = true) {
        // All the cells
        if (index === "all") {
            this.opacity = opacity;
            if (redraw) {
                this.draw(context);
            }
        }
        // Individual cell
        else {
            if (this.checkIndexValidity(index[0], index[1])) {
                this.cells[index[0]][index[1]].opacity = opacity;

                if (redraw) {
                    this.cells[index[0]][index[1]].drawCell(context, false);
                }
            }
        }
    }

    // Change outline color of an individual cell
    setOutlineColor(context: CanvasRenderingContext2D, rowIndex: number, columnIndex: number, outlineColor: string, redraw: boolean = true) {
        if (this.checkIndexValidity(rowIndex, columnIndex)) {
            this.cells[rowIndex][columnIndex].outlineColor = outlineColor;

            if (redraw) {
                this.cells[rowIndex][columnIndex].drawCell(context, false);
            }
        }
    }

    // Change fill color of an individual cell
    setFillColor(context: CanvasRenderingContext2D, rowIndex: number, columnIndex: number, fillColor: string, redraw: boolean = true) {
        if (this.checkIndexValidity(rowIndex, columnIndex)) {
            this.cells[rowIndex][columnIndex].fillColor = fillColor;

            if (redraw) {
                this.cells[rowIndex][columnIndex].drawCell(context, false);
            }
        }
    }

    // Get the row size of the array
    getArrayLength(): number {
        return this.cells.length;
    }

    // Get the column size of the array
    getArrayLengthAtRow(rowIndex: number): number | undefined {
        if (rowIndex < 0 || rowIndex >= this.rows) {
            console.error(`${rowIndex} is out of bounds`);
            return undefined;
        }
        return this.cells[rowIndex].length;
    }

    // Return the element at the given indexes
    getElementAt(rowIndex: number, columnIndex: number): T | null | undefined {
        if (this.checkIndexValidity(rowIndex, columnIndex)) {
            return this.cells[rowIndex][columnIndex].content;
        }
    }

    // Traverse through the array and print each element
    // Hightlight and change outline color of the current element
    async print(context: CanvasRenderingContext2D, iterationSpeed: number = 1) {
        await new Promise<void>((resolve) => {
            // Resolve after the timeline animation completes
            const timeline = gsap.timeline({onComplete: () => { resolve() }});
        
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    const oldOutline = this.cells[i][j].outlineColor;
                    const oldFill = this.cells[i][j].fillColor;

                    timeline.to(this, {
                        duration: iterationSpeed,
                        onStart: () => {
                            this.setOutlineColor(context, i, j, "red");
                            this.setFillColor(context, i, j, "yellow");
                            console.log(this.getElementAt(i, j));
                        },
                        onComplete: () => {
                            // Set the outline and fill color back to normal when finished
                            this.setOutlineColor(context, i, j, oldOutline);
                            this.setFillColor(context, i, j, oldFill);
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
            const oldFill1 = cell1.fillColor;
            const oldFill2 = cell2.fillColor;
            cell1.fillColor = "yellow";
            cell2.fillColor = "yellow";
            
            // Fade out both cells
            const fadeOut = () => new Promise<void>((resolve) => {
                gsap.to([cell1, cell2], {
                    opacity: 0,
                    duration: 1,
                    onUpdate: () => {
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
                    opacity: this.opacity,
                    duration: 1,
                    onUpdate: () => {
                        cell1.drawCell(context, false);
                        cell2.drawCell(context, false);
                    },
                    onComplete: () => resolve()
                });
            });

            await fadeOut();
            swapContent();
            await fadeIn();

            cell1.fillColor = oldFill1;
            cell2.fillColor = oldFill2;
            cell1.drawCell(context, false);
            cell2.drawCell(context, false);
        }
    }

    // Clear the array
    clear(context: CanvasRenderingContext2D) {
        // Need to clear more space to account for index numbers
        context.clearRect(this.x - 15, this.y - 15, (this.cellWidth * this.columns) + 16, (this.cellHeight * this.rows) + 16);
    }
}