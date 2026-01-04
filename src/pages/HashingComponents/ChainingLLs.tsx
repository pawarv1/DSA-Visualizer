import { ChainingLinkedListNode } from './ChainingLLNodes';
import gsap from 'gsap';

// Helper SLL for hashset
// Does not explicitly inherit from Linked List in SLL.tsx, as that linked list implementation is too complex for this application
// However the methods are implemented the same or similarly

export class HashSetSLL {
    protected headPtr: ChainingLinkedListNode | null = null;
    protected staging: ChainingLinkedListNode[] = [];

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.opacity = opacity;
    }

    protected collectNodes(): ChainingLinkedListNode[] {
        const nodes: ChainingLinkedListNode[] = [];
        const seen = new Set<ChainingLinkedListNode>();
        let curr = this.headPtr;

        while (curr && !seen.has(curr)) {
            seen.add(curr);
            nodes.push(curr);
            curr = curr.next;
        }
        return nodes;
    }
    
    private collectFrom(start: ChainingLinkedListNode | null): ChainingLinkedListNode[] {
        const nodes: ChainingLinkedListNode[] = [];
        const seen = new Set<ChainingLinkedListNode>();
        let curr = start;

        while (curr && !seen.has(curr)) {
            seen.add(curr);
            nodes.push(curr);
            curr = curr.next;
        }
        return nodes;
    }

    protected shiftNodesTL(tl: gsap.core.Timeline, nodes: ChainingLinkedListNode[], dx: number, duration: number, at: gsap.Position = 0) {
        for (const n of nodes) {
            tl.to(n, { x: n.x + dx, duration }, at);
        }
    }

    moveLLTo(x: number, y: number) {
        const dx = x - this.x;
        const dy = y - this.y;

        this.x = x;
        this.y = y;

        const nodes = this.collectNodes();
        for (const n of nodes) {
            n.x += dx;
            n.y += dy;
        }
    }

    // Runs promises while gsap.ticker repeatedly calls render()
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

    private timelinePromise(build: (tl: gsap.core.Timeline) => void) {
        return new Promise<void>((resolve) => {
            const tl = gsap.timeline({ onComplete: resolve });
            build(tl);
        });
    }

    protected async withRenderTimeline(renderAll: () => void, build: (tl: gsap.core.Timeline) => void) {
        await this.withRenderLoop(renderAll, [this.timelinePromise(build)]);
    }

    // Method to higlight a specific node for a short duration then set it back to normal afterwards
    protected async highlightNode(renderAll: () => void, node: ChainingLinkedListNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
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

    draw(context: CanvasRenderingContext2D, opacity: number = this.opacity) {
        const nodes = this.collectNodes();

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

    isEmpty() {
        return this.headPtr === null;
    }

    getHead() {
        return this.headPtr;
    }

    prependRaw(newKey: number) {
        const newNode = new ChainingLinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newKey, 1, 1);

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
            const newNode = new ChainingLinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newKey, 0, 0);
            this.headPtr = newNode;

            await this.withRenderTimeline(renderAll, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, duration: fadeIntime });
            });
            return;
        }

        const newNode = new ChainingLinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newKey, 0, 0);
        this.staging.push(newNode);
        await this.withRenderTimeline(renderAll, (tl) => {
            const movingNodes = this.collectNodes();
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

            // fade in new node
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });

            // Update newNode next pointer
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
                    const movingNodes = this.collectNodes();
                    this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            while(currNode.next != null) {
                if (currNode.next.key === key) {
                    await this.highlightNode(renderAll, currNode);
                    await this.highlightNode(renderAll, currNode.next, 500, "black", "lightgreen");
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
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});

                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await this.withRenderTimeline(renderAll, (tl) => {
                    const movingNodes = this.collectFrom(nextNode);
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

/* MAKE KEY VALUE NODE WHICH INHERITS FOR SLL NODE AND ONLY MODIFIES CONTENT STRING */

/*
export class HashMapSLL extends HashSetSLL {
    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = null;
    }

    async search(context: CanvasRenderingContext2D, key: number) {
        let currNode = this.headPtr;

        while (currNode) {
            await this.highlightNode(context, currNode);
            
            // Key was found
            if (currNode.data[0] === key) {
                await this.highlightNode(context, currNode, 1000, "black", "lightgreen");
                return true;
            }

            currNode = currNode.next;
        }

        // Key was not found
        return false;
    }

    async remove(context: CanvasRenderingContext2D, key: number, fadeOutTime: number = 1) {
        const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
        let tempPtr = this.headPtr; // This pointer will be used to help move the remaining nodes back

        if (this.headPtr === null) {
            return false;
        }

        if (this.headPtr.data[0] === key) {
            await this.highlightNode(context, this.headPtr, 500, "black", "lightgreen");
            const firstNode = this.headPtr;
            this.headPtr = firstNode.next;  // Update the head to the node after firstNode next (or null if there isn't one)
            firstNode.next = null;  // Ensure the deleted nodes pointers are set to null as well
            // Fade out the removed first node
            await firstNode.fadeOutNode(context, fadeOutTime);
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            while(currNode.next != null) {
                if (currNode.next.data[0] === key) {
                    await this.highlightNode(context, currNode);
                    await this.highlightNode(context, currNode.next, 500, "black", "lightgreen");
                    break;
                }

                await this.highlightNode(context, currNode);
                currNode = currNode.next;
            }

            // Key was not found
            if (currNode.next === null) {
                await this.highlightNode(context, currNode);
                return false;
            }
            
            const deleteNode = currNode.next;
            await currNode.fadeOutPointer(context, fadeOutTime);
            currNode.next = deleteNode.next;
            tempPtr = deleteNode.next;
            await currNode.fadeInPointer(context, fadeOutTime);
            
            if (currNode.next) {
                deleteNode.next = null;
                await deleteNode.fadeOutNode(context, fadeOutTime, () => {
                    deleteNode.drawNode(context);
                    currNode.drawNode(context); // Redraw currNode, as part of its next pointer arrow would otherwise be cleared by the fade out
                });
            }
            else {
                // Delete node is at the end
                currNode.drawNode(context); // Redraw currNode after its pointer is updated to null
                await deleteNode.fadeOutNode(context, fadeOutTime);
            }            
        }

         // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
        await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
        return true;    // Removal was successful
    }
}
*/