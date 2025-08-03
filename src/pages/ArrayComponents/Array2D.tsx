import gsap, { timeline } from 'gsap';
import { ArrayCell } from './ArrayCell';
import { useParams } from 'react-router-dom';

// 2D Array Class
export class Array2D {
    cells: ArrayCell[][];

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
            this.cells[currRow][currCol] = new ArrayCell(this.x + currCol * this.cellWidth, this.y + currRow * this.cellHeight, i, this.cellWidth, this.cellHeight, contents[i], this.opacity, "black", "white");
        }
    }
    
    // For debugging
    print() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                console.log(`${i},${j}`);
                console.log(this.cells[i][j].content);
            }
        }
    }

    draw(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cell = this.cells[i][j];
                cell.opacity = this.opacity;
                cell.drawCell(context, false);
            }
        }
    }
}