import { LinkedList } from "./SLL";
import { CircularLLNode } from "./CLLNode";
import gsap, { context, set, timeline } from "gsap";

// Circular linked list class, extends LinkedList
export class CircularLinkedList extends LinkedList {
    protected headPtr: CircularLLNode | null;
    protected tailPtr: CircularLLNode | null;
    protected numElements: number;
    protected staging: CircularLLNode[] = [];

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }

    // Preload the CLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
        this.staging = [];
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            // Loading in the first node
            if (!currNode) {
                // headPtr next pointer points to itself by default, as defined in CircularLLNode constructor
                this.headPtr = new CircularLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currNode = this.headPtr;
            }
            // Loading in following nodes
            else {
                const newNode = new CircularLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                newNode.next = this.headPtr;    // Set newNode.next to the head node
                currNode.next = newNode;    // Set currNode next pointer to the new node
                currNode = currNode.next;
            }

            this.tailPtr = currNode;    // Update the tail pointer to the last node
            this.numElements++; // Increment number of elements
        }
        this.render(context);
    }

    private collectNodes(): CircularLLNode[] {
        const nodes: CircularLLNode[] = [];
        if (!this.headPtr) {
            return nodes;
        }

        const seen = new Set<CircularLLNode>();
        let currNode: CircularLLNode | null = this.headPtr;
        const cap = this.numElements > 0 ? this.numElements + 10 : 50;

        while (currNode&& !seen.has(currNode) && nodes.length < cap) {
            nodes.push(currNode);
            seen.add(currNode);

            const next: CircularLLNode | null = currNode.renderNextOverride ?? currNode.next;
            currNode = next ?? null;
        }
        return nodes;
    }

    // Draw the CLL
    draw(context: CanvasRenderingContext2D) {
        const nodes = this.collectNodes();
        const staged = this.staging.filter(s => !nodes.includes(s));

        //Draw nodes
        for (const n of nodes) n.drawNode(context, false);
        for (const s of staged) s.drawNode(context, false);

        // Draw pointers
        for (const n of nodes) n.drawPointer(context);
        for (const s of staged) s.drawPointer(context);
    }

    // Search through the CLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        // Return early if the list is empty
        if (this.headPtr === null) {
            return -1;
        }

        let currNode = this.headPtr;
        let index = 0;

        // Use do while loop to traverse CLL
        do {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            
            // Data was found
            if (currNode.data === data) {
                await this.highlightNode(context, currNode, 1000, "black", "lightgreen");
                return index;
            }

            currNode = currNode.next!;
            index++;
        } while (currNode != this.headPtr);

        // Data was not found
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

        // Use do while loop to traverse CLL
        do {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
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
            this.tailPtr = newNode;

            await this.withRenderLoop(context, [
                newNode.fadeToPointerOpacity(1, fadeIntime),
                newNode.fadeToNodeOpacity(1, fadeIntime)
            ]);
        }
        else {
            newNode = new CircularLLNode(this.tailPtr!.x + this.nodeWidth * 2, this.tailPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            
            newNode.next = this.headPtr;    // Set newNode.next to the head node
            this.staging.push(newNode);

            await this.withRenderTimeline(context, (tl) => {
                // fade in new node
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                tl.to(newNode, { pointerOpacity: 1, duration: fadeIntime }, "<");

                // Update tailPtr next pointer
                tl.to(this.tailPtr, { pointerOpacity: 0, duration: fadeIntime });
                tl.call(() => {this.tailPtr!.next = newNode})
                tl.to(this.tailPtr, { pointerOpacity: 1, duration: fadeIntime });
                
                // Set tailPtr to newNode
                tl.call(() => {this.tailPtr = newNode});
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }

        this.numElements++; // Increment number of elements
    }

    // Insert to the head of the CLL
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {

        const newNode = new CircularLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);

        // If the CLL was previously empty, tailPtr will also point to the newNode
        if (this.headPtr === null) {
            this.tailPtr = newNode;
            
            this.staging.push(newNode);
            await this.withRenderTimeline(context, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacity: 1, duration: fadeIntime }, 0);
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        else {
            const movingNodes = this.collectNodes();

            newNode.next = this.headPtr;    // Set newNode.next to the head node
            this.staging.push(newNode);
            
            await this.withRenderTimeline(context, (tl) => {
                // Animate the movement of the following nodes
                for (const n of movingNodes) {
                    tl.to(n, { x: n.x + this.nodeWidth * 2, duration: 1 }, 0); // all shift together
                }
                
                // Fade in newNode
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime }, 1);
                tl.to(newNode, { pointerOpacity: 1, duration: fadeIntime }, "<");

                // Update tailPtr next pointer
                tl.to(this.tailPtr!, { pointerOpacity: 0, duration: fadeIntime });
                tl.call(() => { this.tailPtr!.next = newNode; }, [], ">");
                tl.to(this.tailPtr!, { pointerOpacity: 1, duration: fadeIntime });
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }

        this.headPtr = newNode; // Update the head to point to the new node
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
            await this.highlightNode(context, currNode);

            // Insertions in the middle of the CLL
            if (currNode.next != this.headPtr) {
                const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up

                const newNode = new CircularLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
                newNode.next = currNode.next;   // Set newNode.next to currNode.next
                
                const movingNodes: CircularLLNode[] = [];   // This array is used to store the nodes which will be moving
                let tempPtr = currNode.next!;  // This pointer will be used to help move nodes following the new node forward
                
                // Add the nodes to movingNodes
                while (tempPtr != this.headPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
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

            // If firstNode points to itself, then it is the only node in the CLL, and the CLL will be empty after it is removed
            // Head and tail must be set to null
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
                await this.withRenderTimeline(context, (tl) => {
                    // Update tailPtr next pointer
                    tl.to(this.tailPtr!, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => { this.tailPtr!.next = this.headPtr; }, [], ">");
                    tl.to(this.tailPtr!, { pointerOpacity: 1, duration: fadeOutTime });
                });
            }

            // Fade the removed first node out after settting its next pointer to null
            await this.withRenderTimeline(context, (tl) => {
                tl.to(firstNode, { pointerOpacity: 0, duration: fadeOutTime });
                tl.call(() => { firstNode.next = null }, [], ">");
                tl.to(firstNode, { nodeOpacity: 0, duration: fadeOutTime });
            });

            this.staging = this.staging.filter(n => n !== firstNode);

            // Only need to move nodes if there are nodes to move
            if (this.headPtr) {
                const movingNodes: CircularLLNode[] = [];   // This array is used to store the nodes which will be moving
                let tempPtr = this.headPtr; // This pointer will be used to help move the remaining nodes back
                
                // Add the nodes to movingNodes
                do {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
                }
                while(tempPtr != this.headPtr);

                // Animate the movement of the following nodes
                await this.withRenderLoop(context, this.shiftNodes(movingNodes, this.nodeWidth * -2, 1));
            }

            this.numElements--; // Decrement number of elements
           
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

            // If the linked list becomes empty after this removal, both head and tail pointers should be null
            // This will happen when there is only one node, and that is the one being removed
            if (this.headPtr.next === this.headPtr) {
                lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                let currNode = this.headPtr;

                // Highlight nodes to show traversal
                // Iteration stops right before the last node
                while (currNode.next != this.tailPtr) {
                    await this.highlightNode(context, currNode);
                    currNode = currNode.next!;
                }
                await this.highlightNode(context, currNode);

                lastNode = currNode.next!;
                this.tailPtr = currNode;    // Update the tail pointer
            }

            this.staging.push(lastNode);

            // This branch should execute as long as there is at least one node remaining after the deletion, otherwise tail would be null
            if (this.headPtr != null) {
                await this.withRenderTimeline(context, (tl) => {
                    // Update tailPtr next pointer
                    tl.to(this.tailPtr!, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => { this.tailPtr!.next = this.headPtr; }, [], ">");
                    tl.to(this.tailPtr!, { pointerOpacity: 1, duration: fadeOutTime });
                });
            }
            
            // Fade out removed last node after setting its next pointer to null
            await this.withRenderTimeline(context, (tl) => {
                tl.to(lastNode, { pointerOpacity: 0, duration: fadeOutTime });
                tl.call(() => { lastNode.next = null }, [], ">");
                tl.to(lastNode, { nodeOpacity: 0, duration: fadeOutTime });
            });

            this.staging = this.staging.filter(n => n !== lastNode);

            this.numElements--; // Decrement the number of elements

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
                await this.highlightNode(context, currNode);
                currNode = currNode.next!;
            }
            await this.highlightNode(context, currNode);

            const deleteNode = currNode.next!;
            this.staging.push(deleteNode);

            // Deletions in the middle of the CLL
            if (deleteNode.next != this.headPtr) {
                let tempPtr = deleteNode.next!;  // This pointer will be used to move the nodes following the removed node back

                await this.withRenderTimeline(context, (tl) => {
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacity: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.renderNextOverride = tempPtr; });
                    tl.to(currNode, { pointerOpacity: 1, duration: fadeOutTime});

                    tl.to(deleteNode, { pointerOpacity: 0, duration: fadeOutTime});
                    tl.call(() => { deleteNode.next = null; }); 
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});

                    tl.call(() => {
                        currNode.next = tempPtr;
                        currNode.renderNextOverride = null;
                    });
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                const movingNodes: CircularLLNode[] = [];   // This array is used to store the nodes which will be moving

                // Add the nodes to movingNodes
                while (tempPtr != this.headPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
                }

                // Animate the movement of the following nodes
                await this.withRenderLoop(context, this.shiftNodes(movingNodes, this.nodeWidth * -2, 1));
            }
            // Deletions from the end of the CLL
            else {
                // Update tailPtr
                this.tailPtr = currNode;

                await this.withRenderTimeline(context, (tl) => {
                    // Update tailPtr next pointer
                    tl.to(this.tailPtr!, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => { this.tailPtr!.next = this.headPtr; }, [], ">");
                    tl.to(this.tailPtr!, { pointerOpacity: 1, duration: fadeOutTime });

                    // Fade out removed last node after setting its next pointer to null
                    tl.to(deleteNode, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => { deleteNode.next = null });
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
            while(currNode.next != this.headPtr) {
                if (currNode.next!.data === data) {
                    await this.highlightNode(context, currNode);
                    await this.highlightNode(context, currNode.next!, 500, "black", "lightgreen");
                    break;
                }
                await this.highlightNode(context, currNode);
                currNode = currNode.next!;
            }

            // Data was not found
            if (currNode.next === this.headPtr) {
                await this.highlightNode(context, currNode);
                return false;
            }

            const deleteNode = currNode.next!;
            this.staging.push(deleteNode);

            // Deletions in the middle of the CLL
            if (deleteNode.next != this.headPtr) {
                let tempPtr = deleteNode.next!;  // This pointer will be used to move the nodes following the removed node back

                await this.withRenderTimeline(context, (tl) => {
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacity: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.renderNextOverride = tempPtr; });
                    tl.to(currNode, { pointerOpacity: 1, duration: fadeOutTime});

                    tl.to(deleteNode, { pointerOpacity: 0, duration: fadeOutTime});
                    tl.call(() => { deleteNode.next = null; }); 
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});

                    tl.call(() => {
                        currNode.next = tempPtr;
                        currNode.renderNextOverride = null;
                    });
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                const movingNodes: CircularLLNode[] = [];   // This array is used to store the nodes which will be moving

                // Add the nodes to movingNodes
                while (tempPtr != this.headPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
                }

                // Animate the movement of the following nodes
                await this.withRenderLoop(context, this.shiftNodes(movingNodes, this.nodeWidth * -2, 1));
            }
            // Deletions from the end of the CLL
            else {
                // Update tailPtr
                this.tailPtr = currNode;

                await this.withRenderTimeline(context, (tl) => {
                    // Update tailPtr next pointer
                    tl.to(this.tailPtr!, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => { this.tailPtr!.next = this.headPtr; }, [], ">");
                    tl.to(this.tailPtr!, { pointerOpacity: 1, duration: fadeOutTime });

                    // Fade out removed last node after setting its next pointer to null
                    tl.to(deleteNode, { pointerOpacity: 0, duration: fadeOutTime });
                    tl.call(() => { deleteNode.next = null });
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode)
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Clear the CLL and set head and tail to null
    // Also set each next pointer to null
    async clearAll(context: CanvasRenderingContext2D, fadeOutTime = 1) {
        if (!this.headPtr) return;

        const nodes = this.collectNodes();
        if (nodes.length === 0) {
            return;
        }

        for (const n of nodes) {
            n.renderNextOverride = null;
            this.staging.push(n);
        }

        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;

        const animations: Promise<void>[] = [];
        for (const n of nodes) {
            animations.push(
                new Promise<void>(resolve => {
                    gsap.to(n, { nodeOpacity: 0, pointerOpacity: 0, duration: fadeOutTime, onComplete: resolve });
                })
            );
        }

        await this.withRenderLoop(context, animations);

        for (const n of nodes) n.next = null;

        this.staging = this.staging.filter(n => !nodes.includes(n));
        this.draw(context);
    }
}