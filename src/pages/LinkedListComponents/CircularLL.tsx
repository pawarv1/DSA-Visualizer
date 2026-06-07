import { LinkedList } from "./SLL";
import { CircularLLNode } from "./CLLNode";
import { collectNodes, highlightNode, withRenderTimeline, shiftNodesTL } from "./LLHelpers";

// Circular linked list class, extends LinkedList
export class CircularLinkedList extends LinkedList {
    protected headPtr: CircularLLNode | null = null;
    protected tailPtr: CircularLLNode | null = null;
    protected numElements: number = 0;
    protected staging: CircularLLNode[] = [];
    protected pointersOnTop: boolean = true;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
    }

    // Preload the CLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
        this.staging = [];
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            if (!currNode) {
                // headPtr next pointer points to itself by default, as defined in CircularLLNode constructor
                this.headPtr = new CircularLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currNode = this.headPtr;
            }
            else {
                const newNode = new CircularLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                newNode.next = this.headPtr;    // Set newNode.next to the head node
                currNode.next = newNode;    // Set currNode next pointer to the new node
                currNode = currNode.next;
            }

            this.tailPtr = currNode;    // Update the tail pointer to the last node
            this.numElements++;
        }
        this.render(context);
    }

    // Draw the CLL
    draw(context: CanvasRenderingContext2D) {
        const nodes = collectNodes(this.headPtr, this.tailPtr);
        const staging = this.staging ?? [];

        const seen = new Set<CircularLLNode>();
        const all: CircularLLNode[] = [];
        for (const n of [...nodes, ...staging]) {
            if (!seen.has(n)) { seen.add(n); all.push(n); }
        }

        if (all.length === 0) return;

        if (this.pointersOnTop) {
            for (const n of all) n.drawNode(context, false);
            for (const n of all) n.drawPointers(context);
        } else {
            for (const n of all) n.drawPointers(context);
            for (const n of all) n.drawNode(context, false);
        }
    }

    // Search through the CLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        // Return early if the list is empty
        if (this.headPtr === null) {
            return -1;
        }

        let currNode = this.headPtr;
        let index = 0;

        do {
            // Highlight nodes to show traversal
            await highlightNode(context, currNode, this.render);
            
            // Data was found
            if (currNode.data === data) {
                await highlightNode(context, currNode, this.render, 1000, "black", "lightgreen");
                return index;
            }

            currNode = currNode.next!;
            index++;
        } while (currNode != this.headPtr);

        return -1;
    }

    // Traverse through CLL and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
        // Return early if the list is empty
        if (this.headPtr === null) {
            return;
        }

        let currNode = this.headPtr;
        let index = 0;
        
        do {
            // Highlight nodes to show traversal
            await highlightNode(context, currNode, this.render);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.next!;
            index++;
        }
        while(currNode != this.headPtr);
    }
    
    // Insert at the end of the CLL
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        let newNode: CircularLLNode;

        // Empty CLL case
        if (this.headPtr === null) {
            // newNode next pointer points to itself by default, as defined in CircularLLNode constructor
            newNode = new CircularLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr = newNode;

            await withRenderTimeline(context, this.render, (tl) => {
                // fade in new node
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, duration: fadeIntime });
            });
        }
        else {
            newNode = new CircularLLNode(this.tailPtr!.x + this.nodeWidth * 2, this.tailPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            
            this.staging.push(newNode);
            await withRenderTimeline(context, this.render, (tl) => {
                // fade in new node
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                tl.call(() => {newNode.next = this.headPtr});
                tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime }, "<");

                // Update tailPtr next pointer
                tl.to(this.tailPtr, { pointerOpacityNext: 0, duration: fadeIntime });
                tl.call(() => {this.tailPtr!.next = newNode})
                tl.to(this.tailPtr, { pointerOpacityNext: 1, duration: fadeIntime });
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        this.tailPtr = newNode;
        this.numElements++;
    }

    // Insert to the head of the CLL
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {

        const newNode = new CircularLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);

        // If the CLL was previously empty, tailPtr will also point to the newNode
        if (this.headPtr === null) {
            this.tailPtr = newNode;
            this.staging.push(newNode);
            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, duration: fadeIntime }, 0);
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        else {
            this.staging.push(newNode);
            await withRenderTimeline(context, this.render, (tl) => {
                const movingNodes = collectNodes(this.headPtr, this.tailPtr);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

                // Fade in newNode
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime }, 1);
                tl.call(() => {newNode.next = this.headPtr;});
                tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime }, "<");

                // Update tailPtr next pointer
                tl.to(this.tailPtr!, { pointerOpacityNext: 0, duration: fadeIntime });
                tl.call(() => { this.tailPtr!.next = newNode; }, [], ">");
                tl.to(this.tailPtr!, { pointerOpacityNext: 1, duration: fadeIntime });
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        this.headPtr = newNode; // Update the head to point to the new node
        this.numElements++;
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
                await highlightNode(context, currNode, this.render);
                currNode = currNode.next!;
            }
            await highlightNode(context, currNode, this.render);

            // Insertions in the middle of the CLL
            if (currNode.next != this.headPtr) {
                const nextNode = currNode.next;
                const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new CircularLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
                newNode.next = null;

                this.staging.push(newNode);
                this.pointersOnTop = false;
                await withRenderTimeline(context, this.render, (tl) => {
                    const movingNodes = collectNodes(nextNode, this.tailPtr);
                    shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

                    // fade in new node
                    tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                    tl.call(() => { newNode.next = nextNode; });
                    tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime }, "<");

                    // Update currNode next pointer to newNode
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeIntime });
                    tl.call(() => { currNode.next = newNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeIntime });

                    // move new node up
                    tl.to(newNode, { y: this.y, duration: fadeIntime });
                });
                this.pointersOnTop = true;
                this.staging = this.staging.filter(n => n !== newNode);


                this.numElements++;
            }
            else {
                // Insertions at the end can use the appending animation, using the tail pointer to prevent another full iteration
                await this.append(context, newData, fadeIntime);
            }
        }

        return true;    // Insertion was successful
    }

    // Remove the head node, and return its data
    async shift(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // Error if CLL is empty
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot remove first element");
            return null;
        }
        else {
            const firstNode = this.headPtr;

            // Set head and tail to null if the list will become empty
            if (firstNode.next === firstNode) {
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                this.headPtr = firstNode.next;  // Update the head to the node after firstNode next
            }

            this.staging.push(firstNode);

            // This branch should execute as long as there is at least one node remaining after the deletion, otherwise head (and tail) would be null
            if (this.headPtr) {
                await withRenderTimeline(context, this.render, (tl) => {
                    // Update tailPtr next pointer
                    tl.to(this.tailPtr!, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { this.tailPtr!.next = this.headPtr; }, [], ">");
                    tl.to(this.tailPtr!, { pointerOpacityNext: 1, duration: fadeOutTime });
                });
            }

            // Fade the removed first node out after settting its next pointer to null
            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(firstNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                tl.call(() => { firstNode.next = null }, [], ">");
                tl.to(firstNode, { nodeOpacity: 0, duration: fadeOutTime });
            });

            this.staging = this.staging.filter(n => n !== firstNode);

            await withRenderTimeline(context, this.render, (tl) => {
                const movingNodes = collectNodes(this.headPtr, this.tailPtr);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });

            this.numElements--;
           
            // Return the removed nodes data
            return firstNode.data;
        }
    }

    // Remove from the end of the CLL and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // Error if linked list is empty
        if (!this.headPtr) {
            console.error("Linked List is empty, cannot pop from it");
            return null;
        }
        else {
            let lastNode;

            // Set head and tail to null if the list will become empty
            if (this.headPtr.next === this.headPtr) {
                lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                let currNode = this.headPtr;

                // Highlight nodes to show traversal, stop before last node
                const visited = new Set<CircularLLNode>();
                while (currNode.next !== this.tailPtr) {
                    if (visited.has(currNode)) break;
                    visited.add(currNode);
                    await highlightNode(context, currNode, this.render);
                    currNode = currNode.next!;
                }

                await highlightNode(context, currNode, this.render);
                lastNode = currNode.next!;
                this.tailPtr = currNode;    // Update the tail pointer
            }

            this.staging.push(lastNode);

            // This branch should execute as long as there is at least one node remaining after the deletion, otherwise tail would be null
            if (this.headPtr != null) {
                await withRenderTimeline(context, this.render, (tl) => {
                    // Update tailPtr next pointer
                    tl.to(this.tailPtr!, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { this.tailPtr!.next = this.headPtr; }, [], ">");
                    tl.to(this.tailPtr!, { pointerOpacityNext: 1, duration: fadeOutTime });
                });
            }
            
            // Fade out removed last node after setting its next pointer to null
            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(lastNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                tl.call(() => { lastNode.next = null }, [], ">");
                tl.to(lastNode, { nodeOpacity: 0, duration: fadeOutTime });
            });
            this.staging = this.staging.filter(n => n !== lastNode);

            this.numElements--;

            // Return the removed nodes data
            return lastNode.data;
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
                await highlightNode(context, currNode, this.render);
                currNode = currNode.next!;
            }
            await highlightNode(context, currNode, this.render);

            const deleteNode = currNode.next!;
            this.staging.push(deleteNode);

            // Deletions in the middle of the CLL
            if (deleteNode.next != this.headPtr) {
                const nextNode = deleteNode.next;

                await withRenderTimeline(context, this.render, (tl) => {
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});

                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await withRenderTimeline(context, this.render, (tl) => {
                    const movingNodes = collectNodes(nextNode, this.tailPtr);
                    shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
            }
            // Deletions from the end of the CLL
            else {
                await withRenderTimeline(context, this.render, (tl) => {
                    // Update tailPtr next pointer
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { currNode.next = this.headPtr; }, [], ">");
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime });

                    // Fade out removed last node after setting its next pointer to null
                    tl.to(deleteNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { deleteNode.next = null });
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode)
                this.tailPtr = currNode;
            }

            this.numElements--;
        }

        return true;    // Deletion was successful
    }

    // Deletes based on the element value, as opposed to index like removeAt
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1) {
        if (this.headPtr === null) {
            return false;
        }
        else if (this.headPtr.data === data) {
            await highlightNode(context, this.headPtr, this.render, 500, "black", "lightgreen");
            await this.shift(context, fadeOutTime);
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            while(currNode.next != this.headPtr) {
                if (currNode.next!.data === data) {
                    await highlightNode(context, currNode, this.render);
                    await highlightNode(context, currNode.next!, this.render, 500, "black", "lightgreen");
                    break;
                }
                await highlightNode(context, currNode, this.render);
                currNode = currNode.next!;
            }

            // Data was not found
            if (currNode.next === this.headPtr) {
                await highlightNode(context, currNode, this.render);
                return false;
            }

            const deleteNode = currNode.next!;
            this.staging.push(deleteNode);

            // Deletions in the middle of the CLL
            if (deleteNode.next != this.headPtr) {
                const nextNode = deleteNode.next;

                await withRenderTimeline(context, this.render, (tl) => {
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});

                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await withRenderTimeline(context, this.render, (tl) => {
                    const movingNodes = collectNodes(nextNode, this.tailPtr);
                    shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
            }
            // Deletions from the end of the CLL
            else {
                await withRenderTimeline(context, this.render, (tl) => {
                    // Update tailPtr next pointer
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { currNode.next = this.headPtr; }, [], ">");
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime });

                    // Fade out removed last node after setting its next pointer to null
                    tl.to(deleteNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { deleteNode.next = null });
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode)
                this.tailPtr = currNode;
            }

            this.numElements--;
        }

        return true;    // Deletion was successful
    }
}