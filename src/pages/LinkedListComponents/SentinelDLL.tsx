import gsap, { context, set, timeline } from "gsap";
import { DLLNode } from "./DLLNode";
import { DoublyLinkedList } from "./DLL";

// Doubly linked list, but both the head and tail use sentinel nodes, inherits from regular Doubly Linked List
export class SentinelDLL extends DoublyLinkedList {
    protected headPtr: DLLNode;
    protected tailPtr: DLLNode;
    protected numElements: number = 0;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        // Head and tail are set to sentinel nodes
        this.headPtr = new DLLNode(x, y, nodeWidth, nodeHeight, null, opacity, opacity, opacity);
        this.tailPtr = new DLLNode(x + nodeWidth * 2, y, nodeWidth, nodeHeight, null, opacity, opacity, opacity);
        // Update head next pointer to tail and tail prev pointer to head
        this.headPtr.next = this.tailPtr;
        this.tailPtr.prev = this.headPtr;
        this.headPtr.isSentinel = true;
        this.tailPtr.isSentinel = true;
    }

    /*HELPERS*/
    private collectReals(): DLLNode[] {
        const nodes: DLLNode[] = [];
        let curr = this.headPtr.next;
        const cap = this.numElements + 10;

        while (curr && curr !== this.tailPtr && nodes.length < cap) {
            nodes.push(curr);
            curr = curr.next;
        }
        return nodes;
    }

    private collectFromForShift(start: DLLNode): DLLNode[] {
        const nodes: DLLNode[] = [];
        let curr: DLLNode | null = start;
        const cap = this.numElements + 2;

        while (curr && nodes.length < cap) {
            nodes.push(curr);
            if (curr === this.tailPtr) {
                break; 
            } 
            curr = curr.next;
        }
        return nodes;
    }

    // Preload the DLL without gsap animating
    loadDLL(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = this.headPtr
        
        for (let i = 0; i < nodeData.length; i++) {
            // newNode is intialized with tail as the next node and currNode as the previous node
            const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
            newNode.next = this.tailPtr;    // Set newNode.next to the tail
            newNode.prev = currNode;    // Set newNode.prev to currNode

            currNode.next = newNode;    // Set currNode.next to newNode
            this.tailPtr.prev = newNode;    // Set tail node prev to newNode
            this.tailPtr.x = newNode.x + this.nodeWidth * 2 // Update the position of the tail node

            currNode = currNode.next;
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
            // currNode starts at the node after head
            let currNode = this.headPtr.next!;

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
                // Set currNode to the node before tail
                currNode = this.tailPtr.prev!;

                // Highlight nodes to show traversal, before the index of insertion
                for (let i = this.numElements - 1; i > index; i--){
                    await this.highlightNode(context, currNode);
                    currNode = currNode.prev!;
                }
                await this.highlightNode(context, currNode);
            }

            return currNode!.data;
        }
    }

    // Search through the DLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        // currNode starts at the node after head
        let currNode = this.headPtr.next!;
        let index = 0;

        // Iterate until currNode is the sentinel tail node
        while (currNode != this.tailPtr) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            
            // Data was found
            if (currNode.data === data) {
                await this.highlightNode(context, currNode, 1000, "black", "lightgreen");
                return index;
            }

            currNode = currNode.next!;
            index++;
        }

        // Data was not found
        return -1;
    }

    // Traverse forward through the DLL and print the nodes index and data
    async traverseForward(context: CanvasRenderingContext2D) {
        // currNode starts at the node after head
        let currNode = this.headPtr.next!;
        let index = 0;

        // Iterate until currNode is the sentinel tail node
        while (currNode != this.tailPtr) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.next!;
            index++;
        }
    }

    // Traverse backwards from tail to head and print nodes index and data
    async traverseBackward(context: CanvasRenderingContext2D) {
        // currNode starts at the node before tail
        let currNode = this.tailPtr.prev!;
        let index = this.numElements - 1;

        // Iterate until currNode is the sentinel head node
        while (currNode != this.headPtr) {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.prev!;
            index--;
        }
    }

    // Insert right before sentinel tail node
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        const prevNode = this.tailPtr.prev!;  // Store the node right before the tail
        const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up

        const newNode = new DLLNode(prevNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);

        this.staging.push(newNode);
            await this.withRenderTimeline(context, (tl) => {
                // Move the tailPtr to make space for the new node
                tl.to(this.tailPtr, { x: this.tailPtr.x + this.nodeWidth * 2, duration: fadeIntime});

                // Fade in new node
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });

                // Update newNode next pointer
                tl.call(() => {newNode.next = this.tailPtr});
                tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime});
                
                // Update newNode prev pointer
                tl.call(() => {newNode.prev = prevNode});
                tl.to(newNode, { pointerOpacityPrev: 1, duration: fadeIntime});

                // Update prevNode next pointer
                tl.to(prevNode, { pointerOpacityNext: 0, duration: fadeIntime});
                tl.call(() => {prevNode.next = newNode});
                tl.to(prevNode, { pointerOpacityNext: 1, duration: fadeIntime});

                // Update tailPtr prev pointer
                tl.to(this.tailPtr, { pointerOpacityPrev: 0, duration: fadeIntime});
                tl.call(() => {this.tailPtr.prev = newNode});
                tl.to(this.tailPtr, { pointerOpacityPrev: 1, duration: fadeIntime});

                // Move newNode to the same height as the other nodes
                tl.to(newNode, { y: this.y, duration: fadeIntime});
            });
            this.staging = this.staging.filter(n => n !== newNode);

        this.numElements++; // Increment number of elements
    }

    // Insert right after sentinel head node
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {            
        const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
        const nextNode = this.headPtr.next!;  // Save the next node after the head node using this pointer

        const newNode = new DLLNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
        newNode.next = nextNode;    // Set newNode.next to nextNode
        newNode.prev = this.headPtr;    // Set newNode.prev to the sentinel head node
        
        this.staging.push(newNode);

        await this.withRenderTimeline(context, (tl) => {
            const movingNodes = this.collectFromForShift(nextNode);
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

            // Fade in new node
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });

            // Update newNode next pointer
            tl.call(() => {newNode.next = nextNode});
            tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime});
            
            // Update newNode prev pointer
            tl.call(() => {newNode.prev = this.headPtr});
            tl.to(newNode, { pointerOpacityPrev: 1, duration: fadeIntime});

            // Update headPtr next pointer
            tl.to(this.headPtr, { pointerOpacityNext: 0, duration: fadeIntime});
            tl.call(() => {this.headPtr.next = newNode});
            tl.to(this.headPtr, { pointerOpacityNext: 1, duration: fadeIntime});

            // Update nextNode prev pointer
            tl.to(nextNode, { pointerOpacityPrev: 0, duration: fadeIntime});
            tl.call(() => {nextNode.prev = newNode});
            tl.to(nextNode, { pointerOpacityPrev: 1, duration: fadeIntime});

            // Move newNode to the same height as the other nodes
            tl.to(newNode, { y: this.y, duration: fadeIntime});
        });
        this.staging = this.staging.filter(n => n !== newNode);

        this.numElements++; // Increment the number or elements
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1) {
        // Error if the insertion index is not valid
        if(index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }

        if (index === 0) {
            await this.prepend(context, newData, fadeIntime);
            return true;    // Insertion was successful
        }

        if (index === this.numElements) {
            await this.append(context, newData, fadeIntime);
            return true;    // Insertion was successful
        }

        // Initially set currNode to node after the head
        let currNode = this.headPtr.next!;

        // Traversal is more / as efficient from head than tail
        if (index <= Math.floor(this.numElements / 2)) {
            // currNode is already set to the node after the head

            // Highlight nodes to show traversal if stop right before the index of insertion
            for (let i = 0; i < index - 1; i++){
                await this.highlightNode(context, currNode);
                currNode = currNode.next!;
            }
            await this.highlightNode(context, currNode);
        }
        // Traversal is more efficient from tail than head
        else {
            // Set currNode to the node before tail
            currNode = this.tailPtr.prev!;

            // Highlight nodes to show traversal, before the index of insertion
            for (let i = this.numElements - 1; i > index - 1; i--){
                await this.highlightNode(context, currNode);
                currNode = currNode.prev!;
            }
            await this.highlightNode(context, currNode);
        }

        // Insertions in the middle of the DLL
        const nextNode = currNode.next!;  // Save the next node after the current node using this pointer
        const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up

        const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);

        this.staging.push(newNode);

        await this.withRenderTimeline(context, (tl) => {
            const movingNodes = this.collectFromForShift(nextNode);
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

            // Fade in new node
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });

            // Update newNode next pointer
            tl.call(() => {newNode.next = nextNode});
            tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime});
            
            // Update newNode prev pointer
            tl.call(() => {newNode.prev = currNode});
            tl.to(newNode, { pointerOpacityPrev: 1, duration: fadeIntime});

            // Update currNode next pointer
            tl.to(currNode, { pointerOpacityNext: 0, duration: fadeIntime});
            tl.call(() => {currNode.next = newNode});
            tl.to(currNode, { pointerOpacityNext: 1, duration: fadeIntime});

            // Update nextNode prev pointer
            tl.to(nextNode, { pointerOpacityPrev: 0, duration: fadeIntime});
            tl.call(() => {nextNode.prev = newNode});
            tl.to(nextNode, { pointerOpacityPrev: 1, duration: fadeIntime});

            // Move newNode to the same height as the other nodes
            tl.to(newNode, { y: this.y, duration: fadeIntime});
        });
        this.staging = this.staging.filter(n => n !== newNode);
        
        this.numElements++; // Increment number of elements
        return true;    // Insertion was successful
    }

    // Remove the first node after the dummy head node, and return its data
    async shift(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // No such node to remove so return early
        if (this.headPtr.next === this.tailPtr) {
            return;
        }

        const firstRealNode = this.headPtr.next!;
        const nextNode = firstRealNode.next!;  // Save the next node after firstRealNode with this pointer

        this.staging.push(firstRealNode);

        await this.withRenderTimeline(context, (tl) => {
            // Update headPtr next pointer
            tl.to(this.headPtr, { pointerOpacityNext: 0, duration: fadeOutTime});
            tl.call(() => {this.headPtr.next = nextNode});
            tl.to(this.headPtr, { pointerOpacityNext: 1, duration: fadeOutTime});

            // Update nextNode prev pointer
            tl.to(nextNode, {pointerOpacityPrev: 0, duration: fadeOutTime});
            tl.call(() => {nextNode.prev = this.headPtr})
            tl.to(nextNode, {pointerOpacityPrev: 1, duration: fadeOutTime});

            // Set firstRealNode pointers to null then fade it out
            tl.call(() => {
                firstRealNode.prev = null;
                firstRealNode.next = null;
            });

            tl.to(firstRealNode, { nodeOpacity: 0, duration: fadeOutTime });
        });
        this.staging = this.staging.filter(n => n !== firstRealNode);

        await this.withRenderTimeline(context, (tl) => {
            const movingNodes = this.collectFromForShift(nextNode);
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
        });
                
        this.numElements--; // Decrement number of elements

        // Return the removed nodes data
        return firstRealNode.data;
    }

    // Remove the node right before the sentinel tail node and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // No such node to remove so return early
        if (this.headPtr.next === this.tailPtr) {
            return;
        }

        const lastRealNode = this.tailPtr.prev!;
        const prevNode = lastRealNode.prev!;    // Save the node before lastRealNode with this pointer

        this.staging.push(lastRealNode);
        await this.withRenderTimeline(context, (tl) => {
            // Update prevNode next pointer
            tl.to(prevNode, { pointerOpacityNext: 0, duration: fadeOutTime});
            tl.call(() => {prevNode.next = this.tailPtr});
            tl.to(prevNode, { pointerOpacityNext: 1, duration: fadeOutTime});

            // Update tailPtr prev pointer
            tl.to(this.tailPtr, {pointerOpacityPrev: 0, duration: fadeOutTime});
            tl.call(() => {this.tailPtr.prev = prevNode})
            tl.to(this.tailPtr, {pointerOpacityPrev: 1, duration: fadeOutTime});

            // Set lastRealNode pointers to null then fade it out
            tl.call(() => {
                lastRealNode.prev = null;
                lastRealNode.next = null;
            });

            tl.to(lastRealNode, { nodeOpacity: 0, duration: fadeOutTime});

            // Move the sentinel tail node back
            tl.to(this.tailPtr, { x: prevNode.x + this.nodeWidth * 2, duration: fadeOutTime});
        });        
        this.staging = this.staging.filter(n => n !== lastRealNode);
        this.numElements--; // Decrement the number of elements

        // Return the removed nodes data
        return lastRealNode.data;
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, fadeOutTime: number = 1) {
        // Error if index of deletion is invalid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            // Pointer for the node that will be deleted, initialized to the node after the head
            let deleteNode = this.headPtr.next!;

            // Traversal is more / as efficient from head than tail
            if (index <= Math.floor((this.numElements - 1) / 2)) {
                // deleteNode is already set to node after the head

                // Highlight nodes to show traversal
                for (let i = 0; i < index; i++) {
                    await this.highlightNode(context, deleteNode);
                    deleteNode = deleteNode.next!;
                }
                await this.highlightNode(context, deleteNode);
            }
            // Traversal is more efficient from tail than head
            else {
                // Set deleteNode to the node before the tail
                deleteNode = this.tailPtr.prev!;

                // Highlight nodes to show traversal
                for (let i = this.numElements - 1; i > index; i--) {
                    await this.highlightNode(context, deleteNode);
                    deleteNode = deleteNode.prev!;
                }
                await this.highlightNode(context, deleteNode);
            }

            // Save the nodes before and after deleteNode
            const prevNode = deleteNode.prev!;
            const nextNode = deleteNode.next!;

            this.staging.push(deleteNode);
            await this.withRenderTimeline(context, (tl) => {
                // Update prevNode next pointer
                tl.to(prevNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                tl.call(() => {prevNode.next = nextNode});
                tl.to(prevNode, { pointerOpacityNext: 1, duration: fadeOutTime});

                // Update nextNode prev pointer
                tl.to(nextNode, {pointerOpacityPrev: 0, duration: fadeOutTime});
                tl.call(() => {nextNode.prev = prevNode})
                tl.to(nextNode, {pointerOpacityPrev: 1, duration: fadeOutTime});

                // Set deleteNode pointers to null then fade it out
                tl.call(() => {
                    deleteNode.prev = null;
                    deleteNode.next = null;
                });

                tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});
            });        
            this.staging = this.staging.filter(n => n !== deleteNode);

            await this.withRenderTimeline(context, (tl) => {
                const movingNodes = this.collectFromForShift(nextNode);
                this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });
            
            this.numElements--; // Decrement the number of elements
            return true;    // Deletion was successful
        }
    }

    // Deletes based on the element value, as opposed to index like removeAt
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1) {
        // Pointer for the node that will be deleted, initialized to the node after the head
        let deleteNode = this.headPtr.next!;

        while (deleteNode != this.tailPtr) {
            if (deleteNode.data === data) {
                await this.highlightNode(context, deleteNode);
                await this.highlightNode(context, deleteNode, 500, "black", "lightgreen");
                break;
            }
            await this.highlightNode(context, deleteNode);
            deleteNode = deleteNode.next!;
        }

        // Data was not found
        if (deleteNode === this.tailPtr) {
            return false;
        }

        // Save the nodes before and after deleteNode
        const prevNode = deleteNode.prev!;
        const nextNode = deleteNode.next!;

        this.staging.push(deleteNode);
        await this.withRenderTimeline(context, (tl) => {
            // Update prevNode next pointer
            tl.to(prevNode, { pointerOpacityNext: 0, duration: fadeOutTime});
            tl.call(() => {prevNode.next = nextNode});
            tl.to(prevNode, { pointerOpacityNext: 1, duration: fadeOutTime});

            // Update nextNode prev pointer
            tl.to(nextNode, {pointerOpacityPrev: 0, duration: fadeOutTime});
            tl.call(() => {nextNode.prev = prevNode})
            tl.to(nextNode, {pointerOpacityPrev: 1, duration: fadeOutTime});

            // Set deleteNode pointers to null then fade it out
            tl.call(() => {
                deleteNode.prev = null;
                deleteNode.next = null;
            });

            tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});
        });        
        this.staging = this.staging.filter(n => n !== deleteNode);

        await this.withRenderTimeline(context, (tl) => {
            const movingNodes = this.collectFromForShift(nextNode);
            this.shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
        });
        
        this.numElements--; // Decrement the number of elements
        return true;    // Deletion was successful
    }

    // Clear all but the sentinel head and tail nodes, and also set each non sentinel nodes pointers to null
    async clearAll(context: CanvasRenderingContext2D, t: number = 1) {
        const nodes = this.collectReals();
        if (nodes.length === 0) return;

         for (const n of nodes) this.staging.push(n);

        this.headPtr.next = this.tailPtr;
        this.tailPtr.prev = this.headPtr;
        this.numElements = 0;

        const fades = nodes.map(n =>
            new Promise<void>(resolve => {
            gsap.to(n, {
                nodeOpacity: 0,
                pointerOpacityNext: 0,
                pointerOpacityPrev: 0,
                duration: t,
                onComplete: resolve,
            });
            })
        );

        const tailMove = new Promise<void>(resolve => {
            gsap.to(this.tailPtr, {
                x: this.headPtr.x + this.nodeWidth * 2,
                duration: t,
                onComplete: resolve
            });
        });

        await this.withRenderLoop(context, [...fades, tailMove]);
        for (const n of nodes) { n.next = null; n.prev = null; }
        this.staging = this.staging.filter(n => !nodes.includes(n));
        this.render(context);
    }
}