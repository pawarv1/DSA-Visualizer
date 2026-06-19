import gsap from "gsap";
import { OABucketArray } from "./OABucketArray";

function is_prime(n: number) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    
    let i = 5;

    while (i * i <= n) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
        i += 6
    }
    return true;
}

function next_prime(n: number) {
    if (n <= 2) return 2;

    let candidate = 0;

    if (n % 2 == 1) {
        candidate = n;
    }
    else {
        candidate = n + 1
    }

    while(!is_prime(candidate)) {
        candidate += 2;
    }

    return candidate
}

export class QPHashTable {
    protected buckets: OABucketArray;
    protected size: number = 0;
    protected isRehashing = false;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number = 8, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.capacity = next_prime(capacity);
        this.opacity = opacity;
        this.buckets = new OABucketArray(x, y, cellWidth, cellHeight, this.capacity, opacity);
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
                    const currElement = oldBuckets.getElementAt(i);
                    if (typeof(currElement) == "number") {
                        await this.add(context, currElement);
                    }
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
            await this.rehash(context, next_prime(this.capacity * 2), fadeTime);
        }

        let h = this.indexFor(key);
        let i = h;
        let state = this.buckets.getStateAt(i);
        let firstTombstone = -1;

        for (let j = 0; j < this.capacity; j++) {
            i = (h + j*j) % this.capacity;

            state = this.buckets.getStateAt(i);
            await this.buckets.highlightCellFor(context, i);

            if (state == "E") {
                let insertIndex = i;

                if (firstTombstone != -1) {
                    insertIndex = firstTombstone;
                }

                this.buckets.fillCell(context, insertIndex, key);
                this.size++;
                return true;
            }
            
            if (state == "F" && this.buckets.getElementAt(i) == key) {
                await this.buckets.highlightCellFor(context, i, 1, "black", "red");
                return false;
            }

            if (state == "T" && firstTombstone == -1) {
                firstTombstone = i;
            }
        }

        // In case the hash table is somehow still full
        if (firstTombstone == -1) {
            if (this.isRehashing) return false;

            await this.rehash(context, next_prime(this.capacity * 2), fadeTime);
            return await this.add(context, key, fadeTime);
        }

        let insertIndex = i;
        
        if (firstTombstone != -1) {
            insertIndex = firstTombstone;
        }

        this.buckets.fillCell(context, insertIndex, key);
        this.size++;
        return true;
    }

    async contains(context: CanvasRenderingContext2D, key: number) {
        let h = this.indexFor(key);
        let i = h;
        let state = this.buckets.getStateAt(i);

        for (let j = 0; j < this.capacity; j++) {
            i = (h + j*j) % this.capacity;
            state = this.buckets.getStateAt(i);
            await this.buckets.highlightCellFor(context, i);

            if (state == "E") {
                await this.buckets.highlightCellFor(context, i, 1, "black", "red");
                return false;
            }

            if (state == "F" && this.buckets.getElementAt(i) == key) {
                await this.buckets.highlightCellFor(context, i, 1, "black", "lightgreen");
                return true;
            }
        }
        await this.buckets.highlightCellFor(context, i, 1, "black", "red");
        return false;
    }

    async remove(context: CanvasRenderingContext2D, key: number) {
        let h = this.indexFor(key);
        let i = h;
        let state = this.buckets.getStateAt(i);

        for (let j = 0; j < this.capacity; j++) {
            i = (h + j*j) % this.capacity;
            state = this.buckets.getStateAt(i);
            await this.buckets.highlightCellFor(context, i);

            if (state == "E") {
                await this.buckets.highlightCellFor(context, i, 1, "black", "red");
                return false;
            }
            
            if (state == "F" && this.buckets.getElementAt(i) == key) {
                await this.buckets.highlightCellFor(context, i, 1, "black", "lightgreen");
                this.buckets.tombstoneCell(context, i);
                this.size--;
                return true;
            }
        }

        await this.buckets.highlightCellFor(context, i, 1, "black", "red");
        return false;
    }
}
