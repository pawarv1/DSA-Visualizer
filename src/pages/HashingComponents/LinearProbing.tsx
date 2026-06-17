import gsap from "gsap";
import { OABucketArray } from "./OABucketArray";

export class LPHashTable {
    protected buckets: OABucketArray;
    protected size: number = 0;
    protected isRehashing = false;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number = 8, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.capacity = capacity;
        this.opacity = opacity;
        this.buckets = new OABucketArray(x, y, cellWidth, cellHeight, capacity, opacity);
    }

    protected renderAll = (context: CanvasRenderingContext2D, clearWholeCanvas: boolean = false) => {
        if (clearWholeCanvas) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
        else {
            this.buckets.clear(context);
        }
        this.buckets.draw(context);
    };

    draw(context: CanvasRenderingContext2D) {
        this.renderAll(context);
    }

    // Helper for getting hashing index, handles negative keys as well
    protected indexFor(key: number) {
        return ((key % this.capacity) + this.capacity) % this.capacity;
    }

    // Resize the hash table when it becomes too full
    protected async rehash(context: CanvasRenderingContext2D, newCapacity: number, fadeTime: number = 1): Promise<boolean> {
        if (this.isRehashing) return false;
        this.isRehashing = true;

        try {
            const oldBuckets = this.buckets;
            const oldBucketsLen = oldBuckets.getArrayLength();

            // Create the new hash table
            this.capacity = newCapacity;
            this.buckets = new OABucketArray(this.x, this.y + (this.cellHeight * (oldBucketsLen + 1)), this.cellWidth, this.cellHeight, newCapacity, 0);            
            this.size = 0;

            // Fade in the new hash table
            await new Promise<void>((resolve) => {
                gsap.to(this.buckets, {
                    opacity: 1,
                    duration: fadeTime,
                    onUpdate: () => this.renderAll(context),
                    onComplete: () => {
                        this.renderAll(context);
                        resolve();
                    }
                });
            });

            // Insert all the elements into the new hash table
            for (let i = 0; i < oldBucketsLen; i++) {
                await oldBuckets.highlightCellFor(context, i);
                if (oldBuckets.getStateAt(i) == "F") {
                    await this.add(context, oldBuckets.getElementAt(i));
                }
            }

            // Fade out the old hash table
            await new Promise<void>((resolve) => {
                gsap.to(oldBuckets, {
                    opacity: 0,
                    duration: fadeTime,
                    onUpdate: () => { 
                        this.renderAll(context, true);
                        oldBuckets.draw(context);
                    },
                    onComplete: () => {
                        this.renderAll(context);
                        resolve();
                    }
                });
            });

            // Move new hash table up
            await new Promise<void>((resolve) => {
                gsap.to(this.buckets, {
                    x: this.x,
                    y: this.y,
                    duration: fadeTime,
                    onUpdate: () => { 
                        this.renderAll(context, true);
                        this.buckets.draw(context);
                    },
                    onComplete: () => {
                        this.renderAll(context);
                        resolve();
                    }
                });
            });
        }
        finally {
            this.isRehashing = false;
        }
        return true;
    }

    async add(context: CanvasRenderingContext2D, key: number, fadeTime: number = 1): Promise<boolean> {
        if (!this.isRehashing && this.size / this.capacity >= 0.5) {
            await this.rehash(context, this.capacity * 2, fadeTime);
        }

        let startIndex = this.indexFor(key);
        let currIndex = startIndex;
        let currState = this.buckets.getStateAt(currIndex);
        let firstTombstone = -1;

        await this.buckets.highlightCellFor(context, currIndex);
        while(currState != "E") {

            if (currState == "F" && this.buckets.getElementAt(currIndex) == key) {
                await this.buckets.highlightCellFor(context, currIndex, 1, "black", "red" );
                return false;
            }
            if (currState == "T" && firstTombstone == -1) {
                firstTombstone = currIndex;
            }

            currIndex = (currIndex + 1) % this.capacity;
            currState = this.buckets.getStateAt(currIndex);
            await this.buckets.highlightCellFor(context, currIndex);

            if (currIndex == startIndex) {
                break;
            }
        }

        // In case the hash table is somehow still full
        if (currIndex === startIndex && firstTombstone === -1 && currState !== "E") {
            if (this.isRehashing) return false;

            await this.rehash(context, this.capacity * 2, fadeTime);
            return await this.add(context, key, fadeTime);
        }

        let insertIndex = currIndex;
        
        if (firstTombstone != -1) {
            insertIndex = firstTombstone;
        }

        this.buckets.fillCell(context, insertIndex, key);
        this.size++;
        return true;
    }

    async contains(context: CanvasRenderingContext2D, key: number) {
        let startIndex = this.indexFor(key);
        let currIndex = startIndex;
        let currState = this.buckets.getStateAt(currIndex);

        await this.buckets.highlightCellFor(context, currIndex);
        while (currState != "E") {

            if (currState == "F" && this.buckets.getElementAt(currIndex) == key) {
                await this.buckets.highlightCellFor(context, currIndex, 1, "black", "lightgreen" );
                return true;
            }

            currIndex = (currIndex + 1) % this.capacity;
            currState = this.buckets.getStateAt(currIndex);
            await this.buckets.highlightCellFor(context, currIndex);

            if (currIndex == startIndex) {
                await this.buckets.highlightCellFor(context, currIndex, 1, "black", "red" );
                return false;
            }
        }
        await this.buckets.highlightCellFor(context, currIndex, 1, "black", "red" );
        return false;
    }

    async remove(context: CanvasRenderingContext2D, key: number) {
        let startIndex = this.indexFor(key);
        let currIndex = startIndex;
        let currState = this.buckets.getStateAt(currIndex);

        while(currState != "E") {
            await this.buckets.highlightCellFor(context, currIndex);

            if (currState == "F" && this.buckets.getElementAt(currIndex) == key) {
                await this.buckets.highlightCellFor(context, currIndex, 1, "black", "lightgreen" );
                this.buckets.tombstoneCell(context, currIndex);
                this.size--;
                return true;                
            }

            currIndex = (currIndex + 1) % this.capacity;
            currState = this.buckets.getStateAt(currIndex);

            if (currIndex == startIndex) {
                await this.buckets.highlightCellFor(context, currIndex, 1, "black", "red" );
                return false;
            }
        }
        await this.buckets.highlightCellFor(context, currIndex, 1, "black", "red" );
        return false;
    }
}