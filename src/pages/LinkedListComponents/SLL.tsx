import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./SLLNode";

// Singly linked list class
export class LinkedList {
    protected headPtr: LinkedListNode | null;
    protected tailPtr: LinkedListNode | null;
    protected numElements: number;
    protected staging: LinkedListNode[] = [];

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        this.x = x;
        this.y = y;
        this.nodeWidth = nodeWidth;
        this.nodeHeight = nodeHeight;
        this.opacity = opacity;
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }

    // Preload the SLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        // Initialize currNode to null, as SLL is empty
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            // Loading in the first node
            if (currNode === null) {
                this.headPtr = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currNode = this.headPtr;
            }
            // Loading in the following nodes
            else {
                const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currNode.next = newNode;    // Set currNode next to newNode then redraw
                currNode = currNode.next;
            }

            this.tailPtr = currNode;    // Update the tail pointer to the last node
            this.numElements++; // Increment number of elements
        }

        this.render(context);
    }

    // Draw the SLL
    draw(context: CanvasRenderingContext2D) {
        const nodes: LinkedListNode[] = [];
        let curr = this.headPtr;
        while (curr) { nodes.push(curr); curr = curr.next; }

        // Draw nodes
        for (const n of nodes) n.drawNode(context, false);
        for (const s of this.staging) s.drawNode(context, false);

        // Draw pointers
        for (const n of nodes) n.drawPointer(context);
        for (const s of this.staging) s.drawPointer(context);
    }

    protected render(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.draw(context);
    }

    protected shiftNodes(nodes: LinkedListNode[], dx: number, duration = 1) {
        return nodes.map(node =>
            new Promise<void>(resolve => {
                gsap.to(node, { x: node.x + dx, duration, onComplete: resolve });
            })
        );
    }

    // Runs promises while gsap.ticker repeatedly calls render()
    protected async withRenderLoop(context: CanvasRenderingContext2D, promises: Promise<void>[] ) {
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

    // Method to higlight a specific node for a short duration then set it back to normal afterwards
    protected async highlightNode(context: CanvasRenderingContext2D, node: LinkedListNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
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
    
    // Return true if the SLL is empty
    isEmpty() {
        return this.numElements === 0;
    }

    // Return the size of the SLL
    getSize() {
        return this.numElements;
    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number) {
        // Error if the index is not valid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal
            for (let i = 0; i < index; i++) {
                await this.highlightNode(context, currNode!);
                currNode = currNode!.next;
            }

            // Highlight node at index
            await this.highlightNode(context, currNode!);
            return currNode!.data;
        }
    }

    // Search through the SLL for the given data argument, and return the index where it is found, or if not, -1
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

    // Traverse through SLL and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
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

    // Insert at the end of the SLL
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        let newNode: LinkedListNode;

        // Empty SLL case
        if (this.headPtr === null) {
            newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;

            await this.withRenderLoop(context, [
                newNode.fadeToNodeOpacity(1, fadeIntime)
            ]);
        }
        else {
            newNode = new LinkedListNode(this.tailPtr!.x + this.nodeWidth * 2, this.tailPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.tailPtr!.next = newNode;    // Update currNode.next to newNode then redraw

            await this.withRenderLoop(context, [
                this.tailPtr!.fadeToPointerOpacity(1, fadeIntime),
                newNode.fadeToNodeOpacity(1, fadeIntime)
            ]);

            this.tailPtr = newNode; // Update the tail pointer to the new node
        }

        this.numElements++; // Increment number of elements
    }

    // Insert to the head of the SLL
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
        let tempPtr = this.headPtr; // This pointer will be used to help move the SLL forward

        if (this.headPtr === null) {
            const newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);

            this.headPtr = newNode;
            this.tailPtr = newNode;
            this.numElements = 1;

            await this.withRenderLoop(context, [
                newNode.fadeToPointerOpacity(1, fadeIntime),
                newNode.fadeToNodeOpacity(1, fadeIntime)
            ]);

            this.render(context);
            return;
        }

        // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        const newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        newNode.next = this.headPtr;    // Set newNode.next to the head
        this.headPtr = newNode; // Update the head to point to the new node

        await this.withRenderTimeline(context, (tl) => {
            // Animate the movement of the following nodes
            for (const n of movingNodes) {
                tl.to(n, { x: n.x + this.nodeWidth * 2, duration: 1 }, 0); // all shift together
            }

            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
            tl.to(newNode, { pointerOpacity: 1, duration: fadeIntime });
        });

        this.numElements++; // Increment the number of elements
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1) {
        // Error if the insertion index is not valid
        if (index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        // Insertions at the head can be taken care of with prepend
        else if (index === 0) {
            await this.prepend(context, newData, fadeIntime);
        }
        else {
            let currNode = this.headPtr!;

            // Highlight nodes to show traversal, stop right before the index of insertion
            for (let i = 0; i < index - 1; i++){
                await this.highlightNode(context, currNode);
                currNode = currNode.next!;
            }
            
            await this.highlightNode(context, currNode);    // Hightlight node at index - 1

            // Insertions in the middle of the SLL
            if (currNode.next) {
                const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
                newNode.next = currNode.next;
                
                const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
                let tempPtr: LinkedListNode | null = currNode.next;  // This pointer will be used to help move nodes following the new node forward
                
                // Add the nodes to movingNodes
                while (tempPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next;
                }

                this.staging.push(newNode);

                await this.withRenderTimeline(context, (tl) => {
                    // Animate the movement of the following nodes
                    for (const n of movingNodes) {
                        tl.to(n, { x: n.x + this.nodeWidth * 2, duration: 1 }, 0); // all shift together
                    }

                    // fade in new node
                    tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                    tl.to(newNode, { pointerOpacity: 1, duration: fadeIntime }, "<");

                    // Update currNode next pointer to newNode
                    tl.to(currNode, { pointerOpacity: 0, duration: fadeIntime });
                    tl.call(() => { currNode.next = newNode; });
                    tl.to(currNode, { pointerOpacity: 1, duration: fadeIntime });

                    // move new node up
                    tl.to(newNode, { y: this.y, duration: fadeIntime });
                });
                
                this.staging = this.staging.filter(n => n !== newNode);
                this.numElements++; // Increment number of elements
            }
            else {
                // Insertions at the end can use the appending animation
                await this.append(context, newData, fadeIntime);
            }
        }

        return true;    // Insertion was successful
    }

    // Remove the head node, and return its data
    async shift(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // Error if SLL is empty
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot remove first element");
            return null;
        }
        else {
            const firstNode = this.headPtr;
            this.staging.push(firstNode);
            this.headPtr = firstNode.next;  // Update the head to the node after firstNode next (or null if there isn't one)

            // If head became null, this means that the linked list will be empty after the removal
            // Tail must be set to null as well
            if (this.headPtr === null) {
                this.tailPtr = null;
            }

            const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
            let tempPtr = this.headPtr; // This pointer will be used to help move the remaining nodes back
            
            // Add the nodes to movingNodes
            while (tempPtr) {
                movingNodes.push(tempPtr);
                tempPtr = tempPtr.next;
            }

            await this.withRenderTimeline(context, (tl) => {
                tl.to(firstNode, { pointerOpacity: 0, duration: fadeOutTime });
                tl.call(() => {firstNode.next = null})
                tl.to(firstNode, { nodeOpacity: 0, duration: fadeOutTime });
            });

            this.staging = this.staging.filter(n => n !== firstNode);

            // Animate the movement of the following nodes
            await this.withRenderLoop(context, this.shiftNodes(movingNodes, this.nodeWidth * -2, 1));

            this.numElements--; // Decrement number of elements
            return firstNode.data;  // Return the removed nodes data
        }
    }

    // Remove from the end of the SLL and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // Error if linked list is empty
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot pop from it");
            return null;
        }
        else {
            let lastNode = this.tailPtr;

            // If the linked list becomes empty after this removal, both head and tail pointers should be null
            // This will happen when there is only one node, and that is the one being removed
            if (this.headPtr.next === null) {
                let lastNode = this.headPtr;
                this.staging.push(lastNode);
                this.headPtr = null;
                this.tailPtr = null;

                await this.withRenderLoop(context, [
                    lastNode.fadeToNodeOpacity(0, fadeOutTime)
                ]);

                this.staging = this.staging.filter(n => n !== lastNode);
            }
            else {
                let currNode = this.headPtr;

                // Highlight nodes to show traversal, iteration stops right before the last node
                while (currNode.next != this.tailPtr) {
                    await this.highlightNode(context, currNode);
                    currNode = currNode.next!;
                }
                
                await this.highlightNode(context, currNode);
                lastNode = this.tailPtr!;
                this.staging.push(lastNode);

                await this.withRenderTimeline(context, (tl) => {
                    tl.to(currNode, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => {
                        currNode.next = null;   // Set currNode.next to null then redraw
                        this.tailPtr = currNode;    // Update the tail pointer
                    })
                    tl.to(lastNode, { nodeOpacity: 0, duration: fadeOutTime });
                });

                this.staging = this.staging.filter(n => n !== lastNode);
            }

            this.numElements--; // Decrement the number of elements
            return lastNode!.data;  // Return the removed nodes data
        }
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, fadeOutTime: number = 1) {
        // Error if index of deletion is invalid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        // Deletions at the head are taken care of using shift
        else if (index === 0) {
            await this.shift(context, fadeOutTime);
        }
        else {
            let currNode = this.headPtr!;

            // Highlight nodes to show traversal, stop right before the index of deletion
            for (let i = 0; i < index - 1; i++) {
                await this.highlightNode(context, currNode);
                currNode = currNode.next!;
            }
            
            await this.highlightNode(context, currNode);
            
            const deleteNode = currNode.next!;

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                await this.withRenderTimeline(context, (tl) => {
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacity: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.renderNextOverride = tempPtr; });
                    tl.to(currNode, { pointerOpacity: 1, duration: fadeOutTime});

                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});

                    tl.call(() => {
                        currNode.next = tempPtr;
                        currNode.renderNextOverride = null;
                        deleteNode.next = null;
                    });
                });

                const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving

                // Add the nodes to movingNodes
                while (tempPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next;
                }

                // Animate the movement of the following nodes
                await this.withRenderLoop(context, this.shiftNodes(movingNodes, this.nodeWidth * -2, 1));
            }
            // Deletions from the end of the SLL
            else {
                this.staging.push(deleteNode);
                await this.withRenderTimeline(context, (tl) => {
                    tl.to(currNode, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => {
                        currNode.next = null;   // Set currNode.next to null then redraw
                        this.tailPtr = currNode;    // Update the tail pointer
                    })
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode)
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Deletes based on the element value, as opposed to index like removeAt
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1) {
        if (this.headPtr === null) {
            return false;
        }
        else if (this.headPtr.data === data) {
            await this.highlightNode(context, this.headPtr, 500, "black", "lightgreen");
            await this.shift(context, fadeOutTime);
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            while(currNode.next != null) {
                if (currNode.next.data === data) {
                    await this.highlightNode(context, currNode);
                    await this.highlightNode(context, currNode.next, 500, "black", "lightgreen");
                    break;
                }

                await this.highlightNode(context, currNode);
                currNode = currNode.next;
            }

            // Data was not found
            if (currNode.next === null) {
                await this.highlightNode(context, currNode);
                return false;
            }

            const deleteNode = currNode.next;

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                await this.withRenderTimeline(context, (tl) => {
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacity: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.renderNextOverride = tempPtr; });
                    tl.to(currNode, { pointerOpacity: 1, duration: fadeOutTime});

                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});

                    tl.call(() => {
                        currNode.next = tempPtr;
                        currNode.renderNextOverride = null;
                        deleteNode.next = null;
                    });
                });

                const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving

                // Add the nodes to movingNodes
                while (tempPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next;
                }

                // Animate the movement of the following nodes
                await this.withRenderLoop(context, this.shiftNodes(movingNodes, this.nodeWidth * -2, 1));
            }
            // Deletions from the end of the SLL
            else {
                this.staging.push(deleteNode);
                await this.withRenderTimeline(context, (tl) => {
                    tl.to(currNode, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => {
                        currNode.next = null;   // Set currNode.next to null then redraw
                        this.tailPtr = currNode;    // Update the tail pointer
                    })
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode)
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Clear the SLL and set head and tail to null
    // Also set each next pointer to null
    async clearAll(context: CanvasRenderingContext2D, fadeOutTime = 1) {
        const nodes: LinkedListNode[] = [];
        let curr = this.headPtr;

        while (curr) {
            nodes.push(curr);
            curr = curr.next;
        }

        if (nodes.length === 0) {
            return;
        }

        for (const n of nodes){
            n.renderNextOverride = null;
        }

        const animations: Promise<void>[] = [];
        for (const n of nodes) {
            animations.push(n.fadeToNodeOpacity(0, fadeOutTime));
            animations.push(n.fadeToPointerOpacity(0, fadeOutTime));
        }

        await this.withRenderLoop(context, animations);

        for (const n of nodes) {
            n.next = null;
        }

        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
        this.staging = [];
        this.render(context);
    }
}