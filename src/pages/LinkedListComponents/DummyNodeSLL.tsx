import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./SLLNode";
import { LinkedList } from "./SLL";

// Singly linked list, but with a dummy head node, inherits from regular Linked List
export class DummyNodeSLL extends LinkedList {
    protected headPtr: LinkedListNode
    protected tailPtr: LinkedListNode
    protected numElements: number = 0;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = new LinkedListNode(x, y, nodeWidth, nodeHeight, null, opacity, opacity); // Head is set to a dummy node
        this.tailPtr = this.headPtr;    // Set tail to the head when initialized
        this.headPtr.isSentinel = true;
    }

    /*HELPERS*/
    private collectReals(): LinkedListNode[] {
        const nodes: LinkedListNode[] = [];
        const seen = new Set<LinkedListNode>();
        let curr = this.headPtr.next;

        while (curr && !seen.has(curr)) {
            seen.add(curr);
            nodes.push(curr);
            curr = curr.next;
        }
        return nodes;
    }

    private collectFromForShift(start: LinkedListNode): LinkedListNode[] {
        const nodes: LinkedListNode[] = [];
        const seen = new Set<LinkedListNode>();
        let curr: LinkedListNode | null = start;

        while (curr && !seen.has(curr)) {
            seen.add(curr);
            nodes.push(curr);
            curr = curr.next;
        }
        return nodes;
    }

    // Preload the SLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = this.headPtr

        for (let i = 0; i < nodeData.length; i++) {
            const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
            currNode.next = newNode;    // Set currNode.next to newNode then redraw
            currNode = currNode.next;
            this.tailPtr = currNode; // Update tail pointer to currNode
            this.numElements++; // Increment number of elements
        }

        this.render(context);
    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number) {
        // Error if the index is not valid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            // Traversal starts at the node after head
            let currNode = this.headPtr.next;

            // Highlight nodes to show traversal
            for (let i = 0; i < index; i++) {
                await this.highlightNode(context, currNode!);
                currNode = currNode!.next;
            }

            await this.highlightNode(context, currNode!);
            return currNode!.data;
        }
    }

    // Search through the SLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        // Traversal starts at the node after head
        let currNode = this.headPtr.next;
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

    // Traverse through the SLL and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
        // Traversal starts at the node after head
        let currNode = this.headPtr.next;
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
        const newNode = new LinkedListNode(this.tailPtr.x + this.nodeWidth * 2, this.tailPtr.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        this.staging.push(newNode);
        await this.withRenderTimeline(context, (tl) => {
            // fade in new node
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
            
            // Update tailPtr next
            tl.to(this.tailPtr, { pointerOpacityNext: 0, duration: 0});
            tl.call(() => {this.tailPtr!.next = newNode;});
            tl.to(this.tailPtr, { pointerOpacityNext: 1, duration: fadeIntime});
        });
        this.staging = this.staging.filter(n => n !== newNode);
        
        this.tailPtr = newNode; // Update the tail pointer to the new node (regardless of which animation is being used)
        this.numElements++; // Increment number of elements
    }

    // Insert right after dummy head node
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {    
        // Only dummy head node exists
        if (this.headPtr.next === null) {
            // In this particular case, append can be used to simplify the code
            await this.append(context, newData, fadeIntime);
        }
        else {
            const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
            const newNode = new LinkedListNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);

            this.staging.push(newNode);
            await this.withRenderTimeline(context, (tl) => {
                const movingNodes = this.collectReals();
                this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

                // Fade in the new node
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                tl.call(() => {newNode.next = this.headPtr.next;})
                tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime });

                // Update headPtr next pointer
                tl.to(this.headPtr, {pointerOpacityNext: 0, duration: fadeIntime});
                tl.call(() => {this.headPtr.next = newNode});
                tl.to(this.headPtr, {pointerOpacityNext: 1, duration: fadeIntime});

                // Move the new node to the same height as the other nodes
                tl.to(newNode, { y: this.y, duration: fadeIntime });
            });
            this.staging = this.staging.filter(n => n !== newNode);
            this.numElements++; // Increment the number or elements
        }
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1) {
        // Error if the insertion index is not valid
        if (index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            for (let i = -1; i < index - 1; i++) {
                await this.highlightNode(context, currNode);
                currNode = currNode.next!;
            }
            await this.highlightNode(context, currNode);

            // Insertions in the middle of the SLL
            if (currNode.next) {
                const nextNode = currNode.next;
                const initialY = this.y + this.nodeHeight * 2;    // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
                

                this.staging.push(newNode);

                await this.withRenderTimeline(context, (tl) => {
                    // Animate the movement of the following nodes
                    const movingNodes = this.collectFromForShift(nextNode);
                    this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

                    // fade in new node
                    tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                    
                    // Update newNode next pointer
                    tl.call(() => {newNode.next = nextNode});
                    tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime }, "<");

                    // Update currNode next pointer to newNode
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeIntime });
                    tl.call(() => { currNode.next = newNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeIntime });

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

    // Remove the first node after the dummy head node, and return its data
    async shift(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // No such node to remove, return early
        if (this.headPtr.next === null) {
            return;
        }

        const firstRealNode = this.headPtr.next;
        const nextNode = firstRealNode.next;

        // If the removal of the node only leaves the dummy head, set the tail pointer to the head
        if (nextNode === null) {
            this.tailPtr = this.headPtr;
        }
        
        this.staging.push(firstRealNode);
        await this.withRenderTimeline(context, (tl) => {
            // Update headPtr next pointer
            tl.to(this.headPtr, { pointerOpacityNext: 0, duration: fadeOutTime});
            tl.call(() => {this.headPtr.next = nextNode});
            tl.to(this.headPtr, { pointerOpacityNext: 1, duration: fadeOutTime});

            tl.call(() => {firstRealNode.next = null;});
            tl.to(firstRealNode, { nodeOpacity: 0, duration: fadeOutTime });
        });
        this.staging = this.staging.filter(n => n !== firstRealNode);

        if (nextNode) {
            await this.withRenderTimeline(context, (tl) => {
                const movingNodes = this.collectFromForShift(nextNode);
                this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });
        }
        
        this.numElements--; // Decrement number of elements
        return firstRealNode.data;
    }

    // Remove from the end of the ll and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        if (this.numElements === 0) return null;

        let currNode = this.headPtr;

        // Highlight nodes to show traversal
        // Iteration stops right before the last node
        while (currNode.next != this.tailPtr) {
            await this.highlightNode(context, currNode);
            currNode = currNode.next!;
        }
        await this.highlightNode(context, currNode);

        const lastNode = currNode.next;
        
        this.staging.push(lastNode);
        await this.withRenderTimeline(context, (tl) => {
            tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
            tl.call(() => {
                currNode.next = null;   // Set currNode.next to null then redraw
                this.tailPtr = currNode;    // Update the tail pointer
            })
            tl.to(lastNode, { nodeOpacity: 0, duration: fadeOutTime });
        });
        this.staging = this.staging.filter(n => n !== lastNode);
        this.numElements--; // Decrement the number of elements

        // Return the removed nodes data
        return lastNode?.data;
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, fadeOutTime: number = 1) {
        // Error if index of deletion is invalid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            for (let i = -1; i < index - 1; i++) {
                await this.highlightNode(context, currNode);
                currNode = currNode.next!;
            }
            await this.highlightNode(context, currNode);

            const deleteNode = currNode.next!;

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                const nextNode = deleteNode.next;

                this.staging.push(deleteNode);
                await this.withRenderTimeline(context, (tl) => {
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});

                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await this.withRenderTimeline(context, (tl) => {
                    const movingNodes = this.collectFromForShift(nextNode);
                    this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
            }
            // Deletions from the end of the SLL
            else {
                this.staging.push(deleteNode);
                await this.withRenderTimeline(context, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => {currNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode)
                this.tailPtr = currNode;
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Deletes based on the element value, as opposed to index like removeAt
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1) {
        if (this.headPtr.next === null) {
            return false;
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal if iterationAnimation is true, stop right before the index of deletion
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
                const nextNode = deleteNode.next;

                this.staging.push(deleteNode);
                await this.withRenderTimeline(context, (tl) => {
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});

                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await this.withRenderTimeline(context, (tl) => {
                    const movingNodes = this.collectFromForShift(nextNode);
                    this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
            }
            // Deletions from the end of the SLL
            else {
                this.staging.push(deleteNode);
                await this.withRenderTimeline(context, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => {currNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode);
                this.tailPtr = currNode;
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Clear all but the dummy head node
    // Also set each next pointer to null
    async clearAll(context: CanvasRenderingContext2D, fadeOutTime = 1) {
        if (!this.headPtr.next) return;
        
        const nodes = this.collectReals();
        if (nodes.length === 0) {
            return;
        }

        for (const n of nodes) gsap.killTweensOf(n);
        this.headPtr.next = null;
        this.tailPtr = this.headPtr;
        this.numElements = 0;

        const stagedSet = new Set(this.staging);
        for (const n of nodes) {
            if (!stagedSet.has(n)) {
                this.staging.push(n);
                stagedSet.add(n);
            }
        }

        const fades: Promise<void>[] = nodes.map(
            (n) =>
                new Promise<void>((resolve) => {
                    gsap.to(n, {
                    nodeOpacity: 0,
                    pointerOpacityNext: 0,
                    duration: fadeOutTime,
                    onComplete: resolve,
                });
            })
        );

        await this.withRenderLoop(context, fades);

        for (const n of nodes) {
            n.next = null;
        }

        const nodeSet = new Set(nodes);
        this.staging = this.staging.filter((n) => !nodeSet.has(n));
        this.render(context);
    }
}