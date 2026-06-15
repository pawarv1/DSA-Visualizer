import { ArrayCell } from "../ArrayComponents/ArrayCell";
import { Arrow } from "../GeneralAnimating/GeneralAnimationGraphics";

export interface ChainDrawable {
  isEmpty(): boolean;
  draw(ctx: CanvasRenderingContext2D, opacity?: number): void;
  moveLLTo(x: number, y: number): void;
}

class BucketArrayCell<TChain extends ChainDrawable> extends ArrayCell {
    private pointerArrow: Arrow;
    content: TChain;

    constructor(x: number, y: number, cellWidth: number, cellHeight: number, content: TChain, opacity: number = 1, outlineColor: string = 'black', fillColor: string = 'white') {
        super(x, y, cellWidth, cellHeight, content, opacity, outlineColor, fillColor);
        this.pointerArrow = new Arrow(0,0,0,0,opacity);
        this.content = content;
    }

    // Draw the cell
    drawCell(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.fillColor;
        context.fillRect(this.x, this.y, this.cellWidth, this.cellHeight);
        context.strokeStyle = this.outlineColor;
        context.strokeRect(this.x, this.y, this.cellWidth, this.cellHeight);

        if (!this.content.isEmpty()) {
            this.pointerArrow.setStartX(this.x + this.cellWidth / 2);
            this.pointerArrow.setStartY(this.y + this.cellHeight / 2);
            this.pointerArrow.setEndX(this.x + this.cellWidth * 7/4 - 4);
            this.pointerArrow.setEndY(this.y + this.cellHeight / 2);
            this.pointerArrow.setOpacity(this.opacity);
            this.pointerArrow.draw(context);
        }
        context.restore();
    }
}

export class ChainBucketArray<TChain extends ChainDrawable> {
    protected cells: BucketArrayCell<TChain>[];

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected readonly arraySize: number, protected opacity: number = 1, private makeChain: (x: number, y: number, w: number, h: number, opacity: number) => TChain) {
        this.cells = [];

        for (let i = 0; i < this.arraySize; i++) {
            const chainX = this.x + (this.cellWidth * 7) / 4;
            const chainY = this.y + this.cellHeight * (i + 1 / 8);
            const chain = this.makeChain(chainX, chainY, (this.cellWidth * 3) / 4, (this.cellHeight * 3) / 4, this.opacity);
            this.cells.push(
                new BucketArrayCell<TChain>(this.x, this.y + i * this.cellHeight, this.cellWidth, this.cellHeight, chain, this.opacity)
            );
        }
    }

    getLength() {
        return this.arraySize;
    }

    protected checkIndexValidity(index: number) {
        if (index < 0 || index >= this.arraySize) {
            throw new RangeError(`Index ${index} out of bounds (0..${this.arraySize - 1})`);
        }
    }

    async highlightCell(renderAll: () => void, index: number, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
        this.checkIndexValidity(index);
        const cell = this.cells[index];
        const oldOutline = cell.outlineColor;
        const oldFill = cell.fillColor;
        cell.outlineColor = outlineColor;
        cell.fillColor = fillColor;
        renderAll();
        await new Promise<void>((resolve) => setTimeout(resolve, duration));
        cell.outlineColor = oldOutline;
        cell.fillColor = oldFill;
        renderAll();
    }

    draw(context: CanvasRenderingContext2D, drawIndex: boolean = true) {
        context.save();
        let fontSize = Math.min(12, Math.floor(this.cellWidth / 4));
        if (drawIndex) {
            context.globalAlpha = this.opacity;
            context.fillStyle = 'black';
            context.font = `${fontSize}px Arial`;
            context.textAlign = 'center';
            context.textBaseline = 'top';
        }

        for (let i = 0; i < this.arraySize; i++) {
            const cell = this.cells[i];
            cell.opacity = this.opacity;
            cell.drawCell(context);

            if (drawIndex) {
                context.fillText(i.toString(), this.x - 10, this.y + (this.cellHeight * i) + this.cellHeight * 2/3);
            }

            cell.content.draw(context, this.opacity);
        }
        context.restore();
    }

    getChainAt(index: number): TChain {
        this.checkIndexValidity(index);
        return this.cells[index].content;
    }

    clear(context: CanvasRenderingContext2D) {
        const pad = 8;
        const left = 0;
        const top = this.y - pad;
        const right = context.canvas.width;
        const height = this.cellHeight * this.arraySize + pad * 2 + this.cellWidth * 4; // chain space
        context.clearRect(left, top, right, height);
    }

    adjustPosition(x: number, y: number) {
        this.x = x;
        this.y = y;

        for (let i = 0; i < this.arraySize; i++) {
            const cell = this.cells[i];
            cell.x = x;
            cell.y = this.y + i * this.cellHeight;
            let curr = cell.content;
            curr.moveLLTo(this.x + this.cellWidth * 7/4, this.y + this.cellHeight * (i + 1/8));
        }
    }
}