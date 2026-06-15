import { ChainBucketArray } from "./ChainBucketArray";
import { HMChainingLLNode } from "./ChainingLLNodes";
import { HashMapSLL } from "./ChainingLLs";
import gsap from "gsap";

export class HashMap {
    protected buckets: ChainBucketArray<HashMapSLL>;
    protected size: number = 0;
    protected isRehashing = false;

    constructor(protected x: number, protected y: number, protected cellWidth: number, protected cellHeight: number, protected capacity: number = 8, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.capacity = capacity;
        this.opacity = opacity;
        this.buckets = new ChainBucketArray<HashMapSLL>(
            this.x, this.y, this.cellWidth, this.cellHeight, capacity, this.opacity,
            (cx, cy, w, h, o) => new HashMapSLL(cx, cy, w, h, o)
        );
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

    // Helper for getting hashing index
    protected indexFor(key: number) {
        return ((key % this.capacity) + this.capacity) % this.capacity;
    }

    // Resize the hash table when it becomes too full
    protected async rehash(context: CanvasRenderingContext2D, newCapacity: number, fadeTime: number = 1) {
        if (this.isRehashing) return;
        this.isRehashing = true;

        try {
            const oldBuckets = this.buckets;
            const oldBucketsLen = oldBuckets.getLength();

            // Create the new hash table
            this.capacity = newCapacity;
            this.buckets = new ChainBucketArray<HashMapSLL>(
                this.x, this.y + (this.cellHeight * (oldBucketsLen + 1)), this.cellWidth, this.cellHeight, newCapacity, 0,
                (cx, cy, w, h, o) => new HashMapSLL(cx, cy, w, h, o)
            );

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

            let renderAll = () => this.renderAll(context);

            // Insert all the elements into the new hash table
            for (let i = 0; i < oldBucketsLen; i++) {
                await oldBuckets.highlightCell(renderAll, i);

                let curr = oldBuckets.getChainAt(i).getHead();

                while (curr != null) {
                    await this.add(context, curr.key, curr.value);
                    curr = curr.next;
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

            // Fade out the new hash table, move it up, then fade it back in
            await new Promise<void>((resolve) => {
                gsap.to(this.buckets, {
                    opacity: 0,
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

            this.buckets.adjustPosition(this.x, this.y);

            await new Promise<void>((resolve) => {
                gsap.to(this.buckets, {
                    opacity: 1,
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
    }
        
    async add(context: CanvasRenderingContext2D, key: number, value: number, fadeTime: number = 1) {
        // Need to rehash if the load factor is >= 0.5
        if (!this.isRehashing && this.size / this.capacity >= 0.5) {
            await this.rehash(context, this.capacity * 2, fadeTime);
        }

        const renderAll = () => this.renderAll(context);
        const chain = this.buckets.getChainAt(this.indexFor(key));
         
        if (!this.isRehashing) {

            // See if key is already in the table, only need to check for regular insertions
            let updateNode = await chain.getNodeWithKey(renderAll, key);

            if (updateNode != null) {
                chain.updateKeyValuePair(updateNode, value);
                this.renderAll(context);
                return;
            }
            await chain.prependPair(renderAll, key, value, fadeTime);
        }
        else {
            // Resizing insertions
            chain.prependRawPair(key, value);
            this.renderAll(context);
        }
        
        this.size++;
    }

    async contains(context: CanvasRenderingContext2D, key: number) {
        const renderAll = () => this.renderAll(context);
        const chain = this.buckets.getChainAt(this.indexFor(key));
        return (await chain.search(renderAll, key));
    }

    async remove(context: CanvasRenderingContext2D, key: number, fadeTime: number = 1) {
        const renderAll = () => this.renderAll(context);
        const chain = this.buckets.getChainAt(this.indexFor(key));
        
        if (await chain.remove(renderAll, key, fadeTime)) {
            this.size--;
            return true;
        }
        else {
            return false;
        }
    }
}