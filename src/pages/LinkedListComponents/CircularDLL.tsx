import { DoublyLinkedList } from "./DLL";
import { CircularDLLNode } from "./CircularDLLNode";
import { collectNodes, highlightNode, withRenderTimeline, shiftNodesTL } from "./LLHelpers";

// Circular Doubly Linked List class extends DoublyLinkedList
export class CircularDLL extends DoublyLinkedList {
    protected headPtr: CircularDLLNode | null = null;
    protected tailPtr: CircularDLLNode | null = null;
    protected pointersOnTop: boolean = false;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
    }

    // Preload the CDLL without gsap animating
    loadDLL(context: CanvasRenderingContext2D, nodeData: any[]) {
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
        this.staging = [];
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            if (currNode === null) {
                // headPtr next and prev pointers points to itself by default, as defined in CircularDLLNode constructor
                this.headPtr = new CircularDLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                currNode = this.headPtr;
            }
            else {
                const newNode = new CircularDLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                newNode.next = this.headPtr;
                newNode.prev = currNode;
                this.headPtr!.prev = newNode;   // Set head node prev pointer to newNode
                currNode.next = newNode;    // Set currNode next pointer to newNode
                currNode = currNode.next;
            }
            this.tailPtr = currNode;
            this.numElements++;
        }

        this.render(context);
    }

    // Draw the CDLL
    draw(context: CanvasRenderingContext2D) {
        const nodes: CircularDLLNode[] = collectNodes(this.headPtr, this.tailPtr);
        const staging: CircularDLLNode[] = this.staging ?? [];
        const all = [...nodes, ...staging];
        if (all.length === 0) return;

        if (!this.pointersOnTop) {
            for (const n of all) n.drawNode(context);
            return;
        }

        for (const n of all) n.drawNode(context, false);
        for (const n of all) n.drawPointers(context);
    }

    // Search through the CDLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        // Return early if the list is empty
        if (!this.headPtr) {
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

    // Traverse forward through the CDLL and print the nodes index and data
    async traverseForward(context: CanvasRenderingContext2D) {
        // Return early if the list is empty
        if (!this.headPtr) {
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

    // Traverse backwards from tail to head and print nodes index and data
    async traverseBackward(context: CanvasRenderingContext2D) {
        // Return early if the list is empty
        if (!this.tailPtr) {
            return;
        }
        let currNode = this.tailPtr;
        let index = 0;

        do {
            // Highlight nodes to show traversal
            await highlightNode(context, currNode, this.render);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.prev!;
            index++;
        }
        while(currNode != this.tailPtr);
    }

    // Insert at the end of the CDLL
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        if (this.headPtr === null) {
            let newNode = new CircularDLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;
            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, pointerOpacityPrev: 1, duration: fadeIntime });
            });
        }
        else {
            let newNode = new CircularDLLNode(this.tailPtr!.x + this.nodeWidth * 2, this.tailPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
            newNode.next = null;
            newNode.prev = null;
            this.staging.push(newNode);
            await withRenderTimeline(context, this.render, (tl) => {
                // Fade in new node
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime});

                // Update tailPtr next
                tl.to(this.tailPtr, { pointerOpacityNext: 0, duration: fadeIntime});
                tl.call(() => {this.tailPtr!.next = newNode});
                tl.to(this.tailPtr, { pointerOpacityNext: 1, duration: fadeIntime});

                // Update headPtr prev
                tl.to(this.headPtr, { pointerOpacityPrev: 0, duration: fadeIntime});
                tl.call(() => {this.headPtr!.prev = newNode});
                tl.to(this.headPtr, { pointerOpacityPrev: 1, duration: fadeIntime});

                // Update newNode pointers
                tl.call(() => {
                    newNode.next = this.headPtr;
                    newNode.prev = this.tailPtr;
                })

                tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime });
                tl.to(newNode, { pointerOpacityPrev: 1, duration: fadeIntime });

                // Set tailPtr to newNode
                tl.call(() => {this.tailPtr = newNode});
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        this.numElements++;
    }

    // Insert to the head of the CDLL
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        const newNode = new CircularDLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);

        if (!this.headPtr) {
            this.tailPtr = newNode;            
            this.staging.push(newNode);
            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, pointerOpacityPrev: 1, duration: fadeIntime });
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        else {
            newNode.next = null;
            newNode.prev = null;
            this.staging.push(newNode);
            await withRenderTimeline(context, this.render, (tl) => {
                // Shift nodes forward
                const movingNodes = collectNodes(this.headPtr, this.tailPtr);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

                // Fade in new node
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime});

                // Update tailPtr next
                tl.to(this.tailPtr, { pointerOpacityNext: 0, duration: fadeIntime});
                tl.call(() => {this.tailPtr!.next = newNode});
                tl.to(this.tailPtr, { pointerOpacityNext: 1, duration: fadeIntime});

                // Update headPtr prev
                tl.to(this.headPtr, { pointerOpacityPrev: 0, duration: fadeIntime});
                tl.call(() => {this.headPtr!.prev = newNode});
                tl.to(this.headPtr, { pointerOpacityPrev: 1, duration: fadeIntime});

                // Update newNode pointers
                tl.call(() => {
                    newNode.next = this.headPtr;
                    newNode.prev = this.tailPtr;
                })

                tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime });
                tl.to(newNode, { pointerOpacityPrev: 1, duration: fadeIntime });
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        this.headPtr = newNode; // Update the headPtr to the new node
        this.numElements++;
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
        let currNode = this.headPtr!;

        // Traversal is more / as efficient from head than tail
        if (index <= Math.floor(this.numElements / 2)) {
            // Highlight nodes to show traversal, stop right before the index of insertion
            for (let i = 0; i < index - 1; i++){
                await highlightNode(context, currNode, this.render);
                currNode = currNode.next!;
            }
            await highlightNode(context, currNode, this.render);
        }
        // Traversal is more efficient from tail then head
        else {
            currNode = this.tailPtr!;

            // Highlight nodes to show traversal, before the index of insertion
            for (let i = this.numElements - 1; i > index - 1; i--){
                await highlightNode(context, currNode, this.render);
                currNode = currNode.prev!;
            }
            await highlightNode(context, currNode, this.render);
        }

        // Insertions in the middle of the CDLL
        const nextNode = currNode.next!;  // Save the next node after the current node using this pointer
        const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
        const newNode = new CircularDLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
        newNode.next = null;
        newNode.prev = null;
        this.staging.push(newNode);

        await withRenderTimeline(context, this.render, (tl) => {
            // Shift nodes after insertion index forward
            const movingNodes = collectNodes(nextNode, this.tailPtr);
            shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

            // Fade in the newNode
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });

            // Update newNode pointers
            tl.call(() => {newNode.next = nextNode});
            tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime });
            tl.call(() => {newNode.prev = currNode});
            tl.to(newNode, { pointerOpacityPrev: 1, duration: fadeIntime });

            // Update currNode next
            tl.to(currNode, { pointerOpacityNext: 0, duration: fadeIntime })
            tl.call(() => {currNode.next = newNode});
            tl.to(currNode, { pointerOpacityNext: 1, duration: fadeIntime });

            // Update nextNode prev
            tl.to(nextNode, { pointerOpacityPrev: 0, duration: fadeIntime });
            tl.call(() => {nextNode.prev = newNode});
            tl.to(nextNode, { pointerOpacityPrev: 1, duration: fadeIntime });

            // Move new node up to the height of the other nodes
            tl.to(newNode, { y: this.y, duration: fadeIntime });
        });
        this.staging = this.staging.filter(n => n !== newNode);
        this.numElements++;  
        return true;    // Insertion was successful
    }

    // Remove the head node, and return its data
    async shift(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // Error if CDLL is empty
        if (!this.headPtr) {
            console.error("Linked List is empty, cannot remove first element");
            return null;
        }
        else {
            const firstNode = this.headPtr;

            // Set head and tail to null if the list becomes empty
            if (firstNode.next === firstNode) {
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                this.headPtr = firstNode.next;  // Update the head to the node after firstNode next
            }
            this.staging.push(firstNode);

            if (this.headPtr) {
                await withRenderTimeline(context, this.render, (tl) => {
                    tl.to(this.headPtr, { pointerOpacityPrev: 0, duration: fadeOutTime });
                    tl.call(() => { this.headPtr!.prev = this.tailPtr; });
                    tl.to(this.headPtr, { pointerOpacityPrev: 1, duration: fadeOutTime });
                    tl.to(this.tailPtr!, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { this.tailPtr!.next = this.headPtr; });
                    tl.to(this.tailPtr!, { pointerOpacityNext: 1, duration: fadeOutTime });
                });
            }

            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(firstNode, { pointerOpacityPrev: 0, duration: fadeOutTime });
                tl.call(() => { firstNode.prev = null});
                tl.to(firstNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                tl.call(() => { firstNode.next = null; });
                tl.to(firstNode, { nodeOpacity: 0, duration: fadeOutTime });
            });
            this.staging = this.staging.filter(n => n !== firstNode);

            await withRenderTimeline(context, this.render, (tl) => {
                const movingNodes = collectNodes(this.headPtr, this.tailPtr);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });
            this.numElements--;
            return firstNode.data;  // Return the removed nodes data
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
            const lastNode = this.tailPtr!;

            // Set head and tail to null if list becomes empty
            if (this.headPtr.next === this.headPtr) {
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                this.tailPtr = this.tailPtr!.prev;
            }
            this.staging.push(lastNode);

            if (this.headPtr) {
                await withRenderTimeline(context, this.render, (tl) => {
                    tl.to(this.headPtr, { pointerOpacityPrev: 0, duration: fadeOutTime });
                    tl.call(() => { this.headPtr!.prev = this.tailPtr; });
                    tl.to(this.headPtr, { pointerOpacityPrev: 1, duration: fadeOutTime });
                    tl.to(this.tailPtr!, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { this.tailPtr!.next = this.headPtr; });
                    tl.to(this.tailPtr!, { pointerOpacityNext: 1, duration: fadeOutTime });
                });
            }

            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(lastNode, { pointerOpacityPrev: 0, duration: fadeOutTime });
                tl.call(() => { lastNode.prev = null});
                tl.to(lastNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                tl.call(() => { lastNode.next = null; });
                tl.to(lastNode, { nodeOpacity: 0, duration: fadeOutTime });
            });
            this.staging = this.staging.filter(n => n !== lastNode);
            this.numElements--;
            return lastNode?.data;  // Return the removed nodes data
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
                    await highlightNode(context, deleteNode, this.render);
                    deleteNode = deleteNode.next!;
                }
                await highlightNode(context, deleteNode, this.render);
            }
            // Traversal is more efficient from tail than head
            else {
                deleteNode = this.tailPtr!;

                // Highlight nodes to show traversal
                for (let i = this.numElements - 1; i > index; i--) {
                    await highlightNode(context, deleteNode, this.render);
                    deleteNode = deleteNode.prev!;
                }
                await highlightNode(context, deleteNode, this.render);
            }
            const prevNode = deleteNode.prev!;
            const nextNode = deleteNode.next!;

            // Handle head deletions with shift
            if (this.headPtr === deleteNode) {
                await this.shift(context, fadeOutTime);
                return true;    // Deletion was successful
            }
            // Handle tail deletions with pop
            if (this.tailPtr === deleteNode) {
                await this.pop(context, fadeOutTime);
                return true;    // Deletion was successful
            }
            this.pointersOnTop = true;
            this.staging.push(deleteNode);

            await withRenderTimeline(context, this.render, (tl) => {
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
            this.pointersOnTop = false;

            await withRenderTimeline(context, this.render, (tl) => {
                const movingNodes = collectNodes(nextNode, this.tailPtr);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });

            this.numElements--;
            return true;    // Deletion was successful
        }
    }

    // Deletes based on the element value, as opposed to index like removeAt
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1) {
        if (this.headPtr === null) {
            return false;
        }
        else {
            let deleteNode = this.headPtr;

            do {
                if (deleteNode.data === data) {
                    await highlightNode(context, deleteNode, this.render);
                    await highlightNode(context, deleteNode, this.render, 500, "black", "lightgreen");
                    break;
                }
                await highlightNode(context, deleteNode, this.render);
                deleteNode = deleteNode.next!;

            } while (deleteNode != this.headPtr);

            // Data was not found
            if (deleteNode === this.headPtr && deleteNode.data != data) {
                return false;
            }

            // Handle head deletions with shift
            if (this.headPtr === deleteNode) {
                await this.shift(context, fadeOutTime);
                return true;    // Deletion was successful
            }
            // Handle tail deletions with pop
            if (this.tailPtr === deleteNode) {
                await this.pop(context, fadeOutTime);
                return true;    // Deletion was successful
            }
            const prevNode = deleteNode.prev!;
            const nextNode = deleteNode.next!;
            this.pointersOnTop = true;
            this.staging.push(deleteNode);

            await withRenderTimeline(context, this.render, (tl) => {
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
            this.pointersOnTop = false;

            await withRenderTimeline(context, this.render, (tl) => {
                const movingNodes = collectNodes(nextNode, this.tailPtr);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });
            this.numElements--;
        }

        return true;    // Deletion was successful
    }
}