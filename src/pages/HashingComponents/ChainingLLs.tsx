import { HSChainingLLNode, HMChainingLLNode } from './ChainingLLNodes';
import gsap from 'gsap';

export type ChainNode<T> = {x: number;y: number;key: any;next: T | null;nodeOpacity: number;pointerOpacityNext: number;outlineColor: string;fillColor: string;
    drawNode(ctx: CanvasRenderingContext2D, redrawPointer?: boolean): void;
    drawPointers(ctx: CanvasRenderingContext2D): void;
};

export abstract class BaseChainingSLL<TNode extends ChainNode<TNode>> {
    protected headPtr: TNode | null = null;
    protected staging: TNode[] = [];

    constructor(protected x: number, protected y: number,protected nodeWidth: number, protected nodeHeight: number,protected opacity: number = 1) {}

    protected abstract makeNode(...args: any[]): TNode;

    getHead() {
        return this.headPtr;
    }

    isEmpty() {
        return this.headPtr === null;
    }

    protected collectNodes(start: TNode | null, end?: TNode | null): TNode[] {
        const nodes: TNode[] = [];
        const seen = new Set<TNode>();
        let curr = start;

        while (curr && !seen.has(curr)) {
            seen.add(curr);
            nodes.push(curr);

            if (curr === end) {
                break;
            }

            curr = curr.next;
        }
        return nodes;
    }

    protected shiftNodesTL(tl: gsap.core.Timeline, nodes: TNode[], dx: number, duration: number, at: gsap.Position = 0) {
        for (const n of nodes) {
            tl.to(n, { x: n.x + dx, duration }, at);
        }
    }

    moveLLTo(x: number, y: number) {
        const dx = x - this.x;
        const dy = y - this.y;
        this.x = x;
        this.y = y;

        const nodes = this.collectNodes(this.headPtr);
        for (const n of nodes) {
            n.x += dx;
            n.y += dy;
        }
    }

    protected async withRenderLoop(renderAll: () => void, promises: Promise<void>[] ) {
        let active = true;
        const loop = () => { if (active) renderAll(); };

        gsap.ticker.add(loop);
        try {
            await Promise.all(promises);
        } finally {
            active = false;
            gsap.ticker.remove(loop);
            renderAll();
        }
    }

    protected timelinePromise(build: (tl: gsap.core.Timeline) => void) {
        return new Promise<void>((resolve) => {
            const tl = gsap.timeline({ onComplete: resolve });
            build(tl);
        });
    }

    protected async withRenderTimeline(renderAll: () => void, build: (tl: gsap.core.Timeline) => void) {
        await this.withRenderLoop(renderAll, [this.timelinePromise(build)]);
    }

    protected async highlightNode(renderAll: () => void, node: TNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
        const oldOutline = node.outlineColor;
        const oldFill = node.fillColor;
        node.outlineColor = outlineColor;
        node.fillColor = fillColor;
        renderAll();
        await new Promise<void>(resolve => setTimeout(resolve, duration));
        node.outlineColor = oldOutline;
        node.fillColor = oldFill;
        renderAll();
    }
}


// Helper SLL for hashset
// Does not explicitly inherit from Linked List in SLL.tsx, as that linked list implementation is too complex for this application
export class HashSetSLL extends BaseChainingSLL<HSChainingLLNode>{
    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
    }
    protected makeNode(key: any, nodeOpacity = 1, pointerOpacity = 1) {
        return new HSChainingLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, key, nodeOpacity, pointerOpacity);
    }
   
    draw(context: CanvasRenderingContext2D, opacity: number = this.opacity) {
        const nodes = this.collectNodes(this.headPtr);

        // Draw nodes
        for (const n of nodes) {
            n.nodeOpacity = opacity;
            n.drawNode(context, false);
        }
        for (const s of this.staging) s.drawNode(context, false);

        // Draw pointers
        for (const n of nodes) {
            n.pointerOpacityNext = opacity;
            n.drawPointers(context);
        }
        for (const s of this.staging) s.drawPointers(context);
    }

    async getNodeWithKey(renderAll: () => void, key: number) {
        let currNode = this.headPtr;

        while (currNode) {
            await this.highlightNode(renderAll, currNode);
            
            // Key was found
            if (currNode.key === key) {
                await this.highlightNode(renderAll, currNode, 1000, "black", "lightgreen");
                break;
            }

            currNode = currNode.next;
        }

        return currNode;
    }

    async search(renderAll: () => void, key: number) {
        let currNode = this.headPtr;

        while (currNode) {
            await this.highlightNode(renderAll, currNode);
            
            // Key was found
            if (currNode.key === key) {
                await this.highlightNode(renderAll, currNode, 1000, "black", "lightgreen");
                return true;
            }

            currNode = currNode.next;
        }

        // Key was not found
        return false;
    }

    // Prepend without gsap animation, used for rehashing
    prependRaw(newKey: number) {
        const newNode = this.makeNode(newKey, 1, 1);

        let curr = this.headPtr;
        while (curr) {
            curr.x += this.nodeWidth * 2;
            curr = curr.next;
        }

        newNode.next = this.headPtr;
        this.headPtr = newNode;
    }

    async prepend(renderAll: () => void, newKey: number, fadeIntime: number = 1) {
        if (this.headPtr === null) {
            const newNode = this.makeNode(newKey, 0, 0);
            this.headPtr = newNode;

            await this.withRenderTimeline(renderAll, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, duration: fadeIntime });
            });
            return;
        }
        const newNode = this.makeNode(newKey, 0, 0);
        this.staging.push(newNode);

        await this.withRenderTimeline(renderAll, (tl) => {
            const movingNodes = this.collectNodes(this.headPtr);
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
            tl.call(() => {newNode.next = this.headPtr})
            tl.to(newNode, {pointerOpacityNext: 1, duration: fadeIntime });
        });
        this.staging = this.staging.filter(n => n !== newNode);
        this.headPtr = newNode;
    }

    async remove(renderAll: () => void, key: number, fadeOutTime: number = 1) {
        if (this.headPtr === null) {
            return false;
        }

        if (this.headPtr.key === key) {
            const firstNode = this.headPtr;
            await this.highlightNode(renderAll, firstNode, 1000, "black", "lightgreen");
            this.headPtr = firstNode.next;
            this.staging.push(firstNode);

            await this.withRenderTimeline(renderAll, (tl) => {
                tl.to(firstNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                tl.call(() => {firstNode.next = null})
                tl.to(firstNode, { nodeOpacity: 0, duration: fadeOutTime });
            });
            this.staging = this.staging.filter(n => n !== firstNode);

            // Animate the movement of the following nodes
            await this.withRenderTimeline(renderAll, (tl) => {
                const movingNodes = this.collectNodes(this.headPtr);
                this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            while(currNode.next != null) {
                if (currNode.next.key === key) {
                    await this.highlightNode(renderAll, currNode);
                    await this.highlightNode(renderAll, currNode.next, 1000, "black", "lightgreen");
                    break;
                }

                await this.highlightNode(renderAll, currNode);
                currNode = currNode.next;
            }

            // Data was not found
            if (currNode.next === null) {
                await this.highlightNode(renderAll, currNode);
                return false;
            }

            const deleteNode = currNode.next;
            this.staging.push(deleteNode);

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                const nextNode = deleteNode.next;

                await this.withRenderTimeline(renderAll, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});
                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await this.withRenderTimeline(renderAll, (tl) => {
                    const movingNodes = this.collectNodes(nextNode);
                    this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
            }
            // Deletions from the end of the SLL
            else {
                await this.withRenderTimeline(renderAll, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => {currNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode);
            }   
        }
        return true;    // Removal was successful
    }
}

// Helper SLL for hashset
// Does not explicitly inherit from Linked List in SLL.tsx, as that linked list implementation is too complex for this application
export class HashMapSLL extends BaseChainingSLL<HMChainingLLNode> {
    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
    }

    protected makeNode(key: any, value: number, nodeOpacity = 1, pointerOpacity = 1) {
        return new HMChainingLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, key, value, nodeOpacity, pointerOpacity);
    }

    draw(context: CanvasRenderingContext2D, opacity: number = this.opacity) {
        const nodes = this.collectNodes(this.headPtr);

        // Draw nodes
        for (const n of nodes) {
            n.nodeOpacity = opacity;
            n.drawNode(context, false);
        }
        for (const s of this.staging) s.drawNode(context, false);

        // Draw pointers
        for (const n of nodes) {
            n.pointerOpacityNext = opacity;
            n.drawPointers(context);
        }
        for (const s of this.staging) s.drawPointers(context);
    }

    async getNodeWithKey(renderAll: () => void, key: number) {
        let currNode = this.headPtr;

        while (currNode) {
            await this.highlightNode(renderAll, currNode);
            
            // Key was found
            if (currNode.key === key) {
                await this.highlightNode(renderAll, currNode, 1000, "black", "lightgreen");
                break;
            }

            currNode = currNode.next;
        }

        return currNode;
    }

    async search(renderAll: () => void, key: number) {
        let currNode = this.headPtr;

        while (currNode) {
            await this.highlightNode(renderAll, currNode);
            
            // Key was found
            if (currNode.key === key) {
                await this.highlightNode(renderAll, currNode, 1000, "black", "lightgreen");
                return true;
            }

            currNode = currNode.next;
        }

        // Key was not found
        return false;
    }

    updateKeyValuePair(updateNode: HMChainingLLNode | null, newValue: number) {
        if (updateNode === null) {
            return;
        }
        updateNode.value = newValue;
    }

    // Prepend without gsap animation, used for rehashing
    prependRawPair(newKey: number, newValue: number) {
        const newNode = this.makeNode(newKey, newValue, 1, 1);

        let curr = this.headPtr;
        while (curr) {
            curr.x += this.nodeWidth * 2;
            curr = curr.next;
        }

        newNode.next = this.headPtr;
        this.headPtr = newNode;
    }

    async prependPair(renderAll: () => void, newKey: number, newValue: number, fadeIntime: number = 1) {
        if (this.headPtr === null) {
            const newNode = this.makeNode(newKey, newValue, 0, 0);
            this.headPtr = newNode;

            await this.withRenderTimeline(renderAll, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, duration: fadeIntime });
            });
            return;
        }
        const newNode = this.makeNode(newKey, newValue, 0, 0);
        this.staging.push(newNode);

        await this.withRenderTimeline(renderAll, (tl) => {
            const movingNodes = this.collectNodes(this.headPtr);
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
            tl.call(() => {newNode.next = this.headPtr})
            tl.to(newNode, {pointerOpacityNext: 1, duration: fadeIntime });
        });
        this.staging = this.staging.filter(n => n !== newNode);
        this.headPtr = newNode;
    }

    async remove(renderAll: () => void, key: number, fadeOutTime: number = 1) {
        if (this.headPtr === null) {
            return false;
        }

        if (this.headPtr.key === key) {
            const firstNode = this.headPtr;
            await this.highlightNode(renderAll, firstNode, 1000, "black", "lightgreen");
            this.headPtr = firstNode.next;
            this.staging.push(firstNode);

            await this.withRenderTimeline(renderAll, (tl) => {
                tl.to(firstNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                tl.call(() => {firstNode.next = null})
                tl.to(firstNode, { nodeOpacity: 0, duration: fadeOutTime });
            });
            this.staging = this.staging.filter(n => n !== firstNode);

            // Animate the movement of the following nodes
            await this.withRenderTimeline(renderAll, (tl) => {
                const movingNodes = this.collectNodes(this.headPtr);
                this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            while(currNode.next != null) {
                if (currNode.next.key === key) {
                    await this.highlightNode(renderAll, currNode);
                    await this.highlightNode(renderAll, currNode.next, 1000, "black", "lightgreen");
                    break;
                }

                await this.highlightNode(renderAll, currNode);
                currNode = currNode.next;
            }

            // Data was not found
            if (currNode.next === null) {
                await this.highlightNode(renderAll, currNode);
                return false;
            }
            const deleteNode = currNode.next;
            this.staging.push(deleteNode);

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                const nextNode = deleteNode.next;

                await this.withRenderTimeline(renderAll, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});
                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await this.withRenderTimeline(renderAll, (tl) => {
                    const movingNodes = this.collectNodes(nextNode);
                    this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
            }
            // Deletions from the end of the SLL
            else {
                await this.withRenderTimeline(renderAll, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => {currNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode);
            }   
        }
        return true;    // Removal was successful
    }
}