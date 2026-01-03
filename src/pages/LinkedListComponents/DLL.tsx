import gsap, { context, set, timeline } from "gsap";
import { DLLNode } from "./DLLNode";

// Doubly linked list class
export class DoublyLinkedList {
    protected headPtr: DLLNode | null = null;
    protected tailPtr: DLLNode | null = null;
    protected numElements: number = 0;
    protected staging: DLLNode[] = [];

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.opacity = opacity;
    }

    /*HELPERS*/
    protected render(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.draw(context);
    }

    protected collectNodes(): DLLNode[] {
        const nodes: DLLNode[] = [];
        let curr = this.headPtr;
        const cap = this.numElements > 0 ? this.numElements + 10 : 50;

        while (curr && nodes.length < cap) {
            nodes.push(curr);
            curr = curr.next;
        }
        return nodes;
    }

    private collectFrom(start: DLLNode | null): DLLNode[] {
        const nodes: DLLNode[] = [];
        let curr = start;
        const cap = this.numElements > 0 ? this.numElements + 10 : 50;

        while (curr && nodes.length < cap) {
            nodes.push(curr);
            curr = curr.next;
        }
        return nodes;
    }

    protected async withRenderLoop(context: CanvasRenderingContext2D, promises: Promise<void>[]) {
        let active = true;
        const loop = () => { if (active) this.render(context); };

        gsap.ticker.add(loop);
        try {
            await Promise.all(promises);
        } finally {
            active = false;
            gsap.ticker.remove(loop);
            this.render(context);
        }
    }

    private timelinePromise(build: (tl: gsap.core.Timeline) => void) {
        return new Promise<void>((resolve) => {
            const tl = gsap.timeline({ onComplete: resolve });
            build(tl);
        });
    }
    protected async withRenderTimeline(context: CanvasRenderingContext2D, build: (tl: gsap.core.Timeline) => void) {
        await this.withRenderLoop(context, [this.timelinePromise(build)]);
    }

    protected shiftNodesTL(tl: gsap.core.Timeline, nodes: DLLNode[], dx: number, duration: number, at: gsap.Position = 0) {
        for (const n of nodes) {
            tl.to(n, { x: n.x + dx, duration }, at);
        }
    }

    protected async highlightNode(context: CanvasRenderingContext2D, node: DLLNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
        const oldOutline = node.outlineColor;
        const oldFill = node.fillColor;

        node.outlineColor = outlineColor;
        node.fillColor = fillColor;
        this.render(context);

        await new Promise<void>(resolve => setTimeout(resolve, duration));

        node.outlineColor = oldOutline;
        node.fillColor = oldFill;
        this.render(context);
    }

    // Preload the DLL without gsap animating
    loadDLL(context: CanvasRenderingContext2D, nodeData: any[]) {
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            // Loading in the first node
            if (currNode === null) {
                this.headPtr = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                currNode = this.headPtr;
            }
            // Loading in the following nodes
            else {
                const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                currNode.next = newNode;
                newNode.prev = currNode;
                currNode = currNode.next;
            }

            this.tailPtr = currNode;    // Update tailPtr
            this.numElements++; // Increment number of elements
        }

        this.render(context);
    }

    // Draw the DLL
    draw(context: CanvasRenderingContext2D) {
        const nodes = this.collectNodes();
        const staged = this.staging.filter(s => !nodes.includes(s));

        for (const n of nodes) n.drawNode(context, false);
        for (const s of staged) s.drawNode(context, false);

        for (const n of nodes) n.drawPointers(context);
        for (const s of staged) s.drawPointers(context);

    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number) {
        // Error if the index is not valid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr!;

            // Traversal is more / as efficient from the head than tail
            if (index <= Math.floor((this.numElements - 1) / 2)) {

                // Highlight nodes to show traversal
                for (let i = 0; i < index; i++) {
                    await this.highlightNode(context, currNode!);
                    currNode = currNode.next!;
                }
                await this.highlightNode(context, currNode);
            }
            // Traversal is more efficient from the tail than head
            else {
                currNode = this.tailPtr!;

                // Highlight nodes to show traversal
                for (let i = this.numElements - 1; i > index; i--){
                    await this.highlightNode(context, currNode);
                    currNode = currNode.prev!;
                }
                await this.highlightNode(context, currNode);
            }

            return currNode.data;
        }
    }

    // Search through the DLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        let currNode = this.headPtr;
        let index = 0;

        while (currNode) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            
            // Data was found
            if (currNode.data === data) {
                await this.highlightNode(context, currNode, 1000, "black", "lightgreen");
                return index;
            }

            currNode = currNode.next;
            index++;
        }

        // Data was not found
        return -1;
    }

    // Traverse forward through the DLL and print the nodes index and data
    async traverseForward(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;
        let index = 0;

        while (currNode) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.next;
            index++;
        }
    }

    // Traverse backwards from tail to head and print nodes index and data
    async traverseBackward(context: CanvasRenderingContext2D) {
        let currNode = this.tailPtr;
        let index = this.numElements - 1;

        while (currNode) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.prev;
            index--;
        }
    }
    
    // Insert at the end of the DLL
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        let newNode: DLLNode;

        // Empty DLL case
        if (this.headPtr === null) {
            newNode = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
            this.headPtr = newNode;

            await this.withRenderTimeline(context, (tl) => {
                // fade in new node
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, pointerOpacityPrev: 1, duration: fadeIntime });
            });
        }
        else {
            newNode = new DLLNode(this.tailPtr!.x + this.nodeWidth * 2, this.tailPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
            
            this.staging.push(newNode);
            await this.withRenderTimeline(context, (tl) => {
                // fade in new node
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                
                // Update tailPtr next pointer
                tl.to(this.tailPtr, { pointerOpacityNext: 0, duration: 0});
                tl.call(() => {this.tailPtr!.next = newNode});
                tl.to(this.tailPtr, { pointerOpacityNext: 1, duration: fadeIntime});
                
                // Update newNode prev pointer
                tl.call(() => {newNode.prev = this.tailPtr});
                tl.to(newNode, { pointerOpacityPrev: 1, duration: fadeIntime});
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        this.tailPtr = newNode;
        this.numElements++; // Increment number of elements
    }

    // Insert to the head of the DLL
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        const newNode = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);

        if (this.headPtr === null) {
            this.tailPtr = newNode;
            
            await this.withRenderTimeline(context, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, pointerOpacityPrev: 1, duration: fadeIntime });
            });
        }
        else {
            this.staging.push(newNode);

            await this.withRenderTimeline(context, (tl) => {
                const movingNodes = this.collectNodes();
                this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

                // fade in new node
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });

                // Update headPtr prev pointer
                tl.to(this.headPtr, { pointerOpacityPrev: 0, duration: 0});
                tl.call(() => {this.headPtr!.prev = newNode});
                tl.to(this.headPtr, { pointerOpacityPrev: 1, duration: fadeIntime });

                // Update newNode next pointer
                tl.call(() => {newNode.next = this.headPtr})
                tl.to(newNode, {pointerOpacityNext: 1, duration: fadeIntime });
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        this.headPtr = newNode;
        this.numElements++; // Increment the number of elements
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1) {
        // Error if the insertion index is not valid
        if(index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }

        // Inserting to the head can be taken care of with prepend
        if (index === 0) {
            await this.prepend(context, newData, fadeIntime);
            return true;    // Insertion was successful
        }

        // Inserting to the tail can be taken care of with append
        if (index === this.numElements) {
            await this.append(context, newData, fadeIntime);
            return true;    // Insertion was successful
        }

        let currNode = this.headPtr!;

        // Traversal is more / as efficient from head than tail
        if (index <= Math.floor(this.numElements / 2)) {
            // Highlight nodes to show traversal, stop right before the index of insertion
            for (let i = 0; i < index - 1; i++){
                await this.highlightNode(context, currNode);
                currNode = currNode.next!;
            }
            await this.highlightNode(context, currNode);
        }
        // Traversal is more efficient from tail than head
        else {
            currNode = this.tailPtr!;

            // Highlight nodes to show traversal, stop right before the index of insertion
            for (let i = this.numElements - 1; i > index - 1; i--){
                await this.highlightNode(context, currNode);
                currNode = currNode.prev!;
            }
            await this.highlightNode(context, currNode);
        }

        const nextNode = currNode.next!;  // Save the next node after the current node using this pointer
        const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
        const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
        newNode.next = nextNode;    // Set newNode.next to nextNode
        newNode.prev = currNode;    // Set newNode.prev to currNode

        this.staging.push(newNode);

        await this.withRenderTimeline(context, (tl) => {
            const movingNodes = this.collectFrom(nextNode);
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

            // fade in new node, and update its pointers
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
            tl.call(() => {newNode.next = nextNode});
            tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime });
            tl.call(() => {newNode.prev = currNode});
            tl.to(newNode, { pointerOpacityPrev: 1, duration: fadeIntime });

            // Update currNode next pointer
            tl.to(currNode, { pointerOpacityNext: 0, duration: fadeIntime });
            tl.call(() => {currNode.next = newNode});
            tl.to(currNode, { pointerOpacityNext: 1, duration: fadeIntime });

            // Update nextNode prev pointer
            tl.to(nextNode, { pointerOpacityPrev: 0, duration: fadeIntime });
            tl.call(() => {nextNode.prev = newNode});
            tl.to(nextNode, { pointerOpacityPrev: 1, duration: fadeIntime });

            // Move the new node up to the same height
            tl.to(newNode, { y: this.y, duration: fadeIntime });
        });
        this.staging = this.staging.filter(n => n !== newNode);
        

        this.numElements++; // Increment number of elements   
        return true;    // Insertion was successful
    }

    // Remove the head node, and return its data
    async shift(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // Error if DLL is empty
        if (this.headPtr === null) {
            console.error("DLL is empty, cannot remove first element");
            return null;
        }
        else {
            const firstNode = this.headPtr;
            this.headPtr = firstNode.next;   // Update the head to the node after firstNode next (or null if there isn't one)

            // If head became null, this means that the linked list will be empty after the removal
            // Tail must be set to null as well
            if (this.headPtr === null) {
                this.tailPtr = null;
            }

            this.staging.push(firstNode);
            await this.withRenderTimeline(context, (tl) => {
                if (this.headPtr) {
                    tl.to(this.headPtr, {pointerOpacityPrev: 0, duration: fadeOutTime });
                    tl.call(() => {this.headPtr!.prev = null});
                }

                // Set firstNode next pointer to null, then fade it out
                tl.to(firstNode, {pointerOpacityNext: 0, duration: fadeOutTime});
                tl.call(() => {firstNode.next = null});
                tl.to(firstNode, {nodeOpacity: 0, duration: fadeOutTime});
            });
            this.staging = this.staging.filter(n => n !== firstNode);

            await this.withRenderTimeline(context, (tl) => {
                const movingNodes = this.collectNodes();
                this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });

            this.numElements--; // Decrement the number of elements

            // Return the removed nodes data
            return firstNode.data;
        }
    }

    // Remove from the end of the DLL and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // Error if linked list is empty
        if (this.headPtr === null) {
            console.error("DLL is empty, cannot pop from it");
            return null;
        }
        else {

            // If the linked list becomes empty after this removal, both head and tail pointers should become null
            // This will happen when there is only one node, and that is the one being removed
            if (this.headPtr.next === null) {
                let lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;

                this.staging.push(lastNode);
                await this.withRenderTimeline(context, (tl) => {
                    tl.to(lastNode, {nodeOpacity: 0, duration: fadeOutTime});
                });
                this.staging = this.staging.filter(n => n !== lastNode);

                this.numElements--; // Decrement the number of elements

                // Return the removed nodes data
                return lastNode!.data;
            }

            let lastNode = this.tailPtr;
            this.tailPtr = this.tailPtr!.prev;

            this.staging.push(lastNode!);
            await this.withRenderTimeline(context, (tl) => {
                // Fade out the new tailPtr next node then set it to null
                tl.to(this.tailPtr, {pointerOpacityNext: 0, duration: fadeOutTime});
                tl.call(() => {this.tailPtr!.next = null})

                // Set lastNode prev pointer to null, then fade it out
                tl.to(lastNode, {pointerOpacityPrev: 0, duration: fadeOutTime});
                tl.call(() => {lastNode!.prev = null});
                tl.to(lastNode, {nodeOpacity: 0, duration: fadeOutTime});
                
            });
            this.staging = this.staging.filter(n => n !== lastNode);

            this.numElements--; // Decrement the number of elements

            // Return the removed nodes data
            return lastNode!.data;
        }
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, fadeOutTime: number = 1) {
        // Error if index of deletion is invalid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            // Removing from the head can be taken care of with shift
            if (index === 0) {
                await this.shift(context, fadeOutTime);
                return true;    // Deletion was successful
            }

            // Removing from the tail can be taken care of with pop
            if (index === this.numElements - 1) {
                await this.pop(context, fadeOutTime);
                return true;    // Deletion was successful
            }

            let deleteNode = this.headPtr!;

            // Traversal is more / as efficient from head than tail
            if (index <= Math.floor((this.numElements - 1) / 2)) {

                // Highlight nodes to show traversal
                for (let i = 0; i < index; i++) {
                    await this.highlightNode(context, deleteNode);
                    deleteNode = deleteNode.next!;
                }
                await this.highlightNode(context, deleteNode);
            }
            // Traversal is more efficient from tail than head
            else {
                deleteNode = this.tailPtr!;

                // Highlight nodes to show traversal
                for (let i = this.numElements - 1; i > index; i--) {
                    await this.highlightNode(context, deleteNode);
                    deleteNode = deleteNode.prev!;
                }
                await this.highlightNode(context, deleteNode);
            }

            const prevNode = deleteNode.prev!;
            const nextNode = deleteNode.next!;

            this.staging.push(deleteNode);
            await this.withRenderTimeline(context, (tl) => {
                tl.to(prevNode, { pointerOpacityNext: 0, duration: fadeOutTime }, 0);
                tl.call(() => { prevNode.next = nextNode; });
                tl.to(prevNode, { pointerOpacityNext: 1, duration: fadeOutTime });

                tl.to(nextNode, { pointerOpacityPrev: 0, duration: fadeOutTime });
                tl.call(() => { nextNode.prev = prevNode; });
                tl.to(nextNode, { pointerOpacityPrev: 1, duration: fadeOutTime });

                tl.call(() => {
                    deleteNode.prev = null;
                    deleteNode.next = null;
                });

                tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
            });
            this.staging = this.staging.filter(n => n !== deleteNode);

            await this.withRenderTimeline(context, (tl) => {
                const movingNodes = this.collectFrom(nextNode);
                this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });
            this.numElements--; // Decrement the number of elements
            return true;    // Deletion was successful
        }
    }

    // Deletes based on the element value, as opposed to index like removeAt
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1) {
        // Pointer for the node that will be deleted, initialized to the head
        let deleteNode = this.headPtr;

        while (deleteNode != null) {
            if (deleteNode.data === data) {
                await this.highlightNode(context, deleteNode);
                await this.highlightNode(context, deleteNode, 500, "black", "lightgreen");
                break;
            }
            await this.highlightNode(context, deleteNode);
            deleteNode = deleteNode.next;
        }

        // Data was not found
        if (deleteNode === null) {
            return false;
        }

        // Removing from the head can be taken care of with shift
        if (deleteNode === this.headPtr) {
            await this.shift(context, fadeOutTime);
            return true;    // Deletion was successful
        }

        // Removing from the tail can be taken care of with pop
        if (deleteNode === this.tailPtr) {
            await this.pop(context, fadeOutTime);
            return true;    // Deletion was successful
        }
        const prevNode = deleteNode.prev!;
        const nextNode = deleteNode.next!;

        this.staging.push(deleteNode);

        await this.withRenderTimeline(context, (tl) => {
            tl.to(prevNode, { pointerOpacityNext: 0, duration: fadeOutTime }, 0);
            tl.call(() => { prevNode.next = nextNode; });
            tl.to(prevNode, { pointerOpacityNext: 1, duration: fadeOutTime });

            tl.to(nextNode, { pointerOpacityPrev: 0, duration: fadeOutTime });
            tl.call(() => { nextNode.prev = prevNode; });
            tl.to(nextNode, { pointerOpacityPrev: 1, duration: fadeOutTime });

            tl.call(() => {
                deleteNode.prev = null;
                deleteNode.next = null;
            });

            tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
        });
        this.staging = this.staging.filter(n => n !== deleteNode);

        await this.withRenderTimeline(context, (tl) => {
            const movingNodes = this.collectFrom(nextNode);
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
        });

        this.numElements--; // Decrement the number of elements
        return true;    // Deletion was successful
    }

    // Clear the DLL and set head and tail to null
    // Also set each next and prev pointer to null
    async clearAll(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        if (!this.headPtr) return;

        const nodes = this.collectNodes();
        if (nodes.length === 0) {
            return;
        }

        for (const n of nodes) this.staging.push(n);

        const fades: Promise<void>[] = nodes.map(n =>
            new Promise<void>(resolve => {
            gsap.to(n, {
                nodeOpacity: 0,
                pointerOpacityNext: 0,
                pointerOpacityPrev: 0,
                duration: fadeOutTime,
                onComplete: resolve
            });
            })
        );

        await this.withRenderLoop(context, fades);

        for (const n of nodes) {
            n.next = null;
            n.prev = null;
        }

        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;

        this.staging = this.staging.filter(n => !nodes.includes(n));
        this.render(context);
    }
}