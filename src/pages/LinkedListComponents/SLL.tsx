import gsap from "gsap";
import { SLLNode } from "./SLLNode";
import { collectNodes, highlightNode, withRenderTimeline, shiftNodesTL, withRenderLoop } from "./LLHelpers";

// Singly linked list class
export class LinkedList<T> {
    protected headPtr: SLLNode<T> | null = null;
    protected tailPtr: SLLNode<T> | null = null;
    protected numElements: number = 0;
    protected staging: SLLNode<T>[] = [];

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {}

    protected render = (context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.draw(context);
    };

    // Preload the SLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: T[]) {
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
        this.staging = [];
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            if (currNode === null) {
                this.headPtr = new SLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currNode = this.headPtr;
            }
            else {
                const newNode = new SLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currNode.next = newNode;
                currNode = currNode.next;
            }

            this.tailPtr = currNode;
            this.numElements++;
        }

        this.render(context);
    }

    // Draw the SLL
    draw(context: CanvasRenderingContext2D) {
        const nodes = collectNodes(this.headPtr);

        // Draw nodes
        for (const n of nodes) n.drawNode(context, false);
        for (const s of this.staging) s.drawNode(context, false);

        // Draw pointers
        for (const n of nodes) n.drawPointers(context);
        for (const s of this.staging) s.drawPointers(context);
    }

    getNumElements() {
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

            for (let i = 0; i < index; i++) {
                await highlightNode(context, currNode!, this.render);
                currNode = currNode!.next;
            }

            await highlightNode(context, currNode!, this.render);
            return currNode!.data;
        }
    }

    // Search through the SLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: T) {
        let currNode = this.headPtr;
        let index = 0;

        while (currNode) {
            await highlightNode(context, currNode, this.render);
            
            // Data was found
            if (currNode.data === data) {
                await highlightNode(context, currNode, this.render, 1000, "black", "lightgreen");
                return index;
            }

            currNode = currNode.next;
            index++;
        }

        return -1;
    }

    // Traverse through SLL and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;
        let index = 0;

        while (currNode) {
            // Highlight nodes to show traversal
            await highlightNode(context, currNode, this.render);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.next;
            index++;
        }
    }

    // Insert at the end of the SLL
    async append(context: CanvasRenderingContext2D, newData: T, fadeIntime: number = 1) {
        let newNode: SLLNode<T>;

        if (this.headPtr === null) {
            newNode = new SLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr = newNode;
            
            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
            });
        }
        else {
            newNode = new SLLNode(this.tailPtr!.x + this.nodeWidth * 2, this.tailPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.staging.push(newNode);

            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                tl.to(this.tailPtr, { pointerOpacityNext: 0, duration: 0});
                tl.call(() => {this.tailPtr!.next = newNode;});
                tl.to(this.tailPtr, { pointerOpacityNext: 1, duration: fadeIntime});
            });
            this.staging = this.staging.filter(n => n !== newNode);
        }
        this.tailPtr = newNode;
        this.numElements++;
    }

    // Insert to the head of the SLL
    async prepend(context: CanvasRenderingContext2D, newData: T, fadeIntime: number = 1) {
        if (this.headPtr === null) {
            const newNode = new SLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;
            this.numElements = 1;

            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(newNode, { nodeOpacity: 1, pointerOpacityNext: 1, duration: fadeIntime });
            });
            return;
        }

        const newNode = new SLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        this.staging.push(newNode);

        await withRenderTimeline(context, this.render, (tl) => {
            const movingNodes = collectNodes(this.headPtr);
            shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
            tl.call(() => {newNode.next = this.headPtr})
            tl.to(newNode, {pointerOpacityNext: 1, duration: fadeIntime });
        });
        this.staging = this.staging.filter(n => n !== newNode);
        this.headPtr = newNode;
        this.numElements++;
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: T, fadeIntime: number = 1) {
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

            // Insertions in the middle of the SLL
            if (currNode.next) {
                const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new SLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
                const nextNode = currNode.next;

                this.staging.push(newNode);
                await withRenderTimeline(context, this.render, (tl) => {
                    // Shift nodes after insertion index forward
                    const movingNodes = collectNodes(nextNode)
                    shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

                    // fade in new node
                    tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
                    tl.call(() => {newNode.next = nextNode});
                    tl.to(newNode, { pointerOpacityNext: 1, duration: fadeIntime });

                    // Update currNode next pointer to newNode
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeIntime });
                    tl.call(() => { currNode.next = newNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeIntime });

                    // move new node up
                    tl.to(newNode, { y: this.y, duration: fadeIntime });
                });
                this.staging = this.staging.filter(n => n !== newNode);
                this.numElements++;
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
            this.headPtr = firstNode.next;

            // Set tail to null if the linked list becomes empty
            if (this.headPtr === null) {
                this.tailPtr = null;
            }

            this.staging.push(firstNode);
            await withRenderTimeline(context, this.render, (tl) => {
                tl.to(firstNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                tl.call(() => {firstNode.next = null})
                tl.to(firstNode, { nodeOpacity: 0, duration: fadeOutTime });
            });
            this.staging = this.staging.filter(n => n !== firstNode);

            await withRenderTimeline(context, this.render, (tl) => {
                const movingNodes = collectNodes(this.headPtr);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });

            this.numElements--;
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

            // Set tail to null if the linked list becomes empty
            if (this.headPtr.next === null) {
                let lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;

                this.staging.push(lastNode);
                await withRenderTimeline(context, this.render, (tl) => {
                    tl.to(lastNode, {nodeOpacity: 0, duration: fadeOutTime});
                });
                this.staging = this.staging.filter(n => n !== lastNode);
            }
            else {
                let currNode = this.headPtr;

                // Highlight nodes to show traversal, iteration stops right before the last node
                while (currNode.next != this.tailPtr) {
                    await highlightNode(context, currNode, this.render);
                    currNode = currNode.next!;
                }
                
                await highlightNode(context, currNode, this.render);
                lastNode = this.tailPtr!;
                this.staging.push(lastNode);
                await withRenderTimeline(context, this.render,(tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => { currNode.next = null;});
                    tl.to(lastNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== lastNode);
                this.tailPtr = currNode;
            }

            this.numElements--;
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
                await highlightNode(context, currNode, this.render);
                currNode = currNode.next!;
            }
            await highlightNode(context, currNode, this.render);
            const deleteNode = currNode.next!;

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                const nextNode = deleteNode.next;
                this.staging.push(deleteNode);

                await withRenderTimeline(context, this.render, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});
                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await withRenderTimeline(context, this.render, (tl) => {
                    const movingNodes = collectNodes(nextNode);
                    shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
            }
            // Deletions from the end of the SLL
            else {
                this.staging.push(deleteNode);
                await withRenderTimeline(context, this.render, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => {currNode.next = null;});
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
    async delete(context: CanvasRenderingContext2D, data: T, fadeOutTime: number = 1) {
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
            while(currNode.next != null) {
                if (currNode.next.data === data) {
                    await highlightNode(context, currNode, this.render);
                    await highlightNode(context, currNode.next, this.render, 500, "black", "lightgreen");
                    break;
                }

                await highlightNode(context, currNode, this.render);
                currNode = currNode.next;
            }

            // Data was not found
            if (currNode.next === null) {
                await highlightNode(context, currNode, this.render);
                return false;
            }
            const deleteNode = currNode.next;

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                const nextNode = deleteNode.next;

                this.staging.push(deleteNode);
                await withRenderTimeline(context, this.render, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime});
                    tl.call(() => { currNode.next = nextNode; });
                    tl.to(currNode, { pointerOpacityNext: 1, duration: fadeOutTime});
                    tl.call(() => {deleteNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime});                    
                });
                this.staging = this.staging.filter(n => n !== deleteNode);

                await withRenderTimeline(context, this.render, (tl) => {
                    const movingNodes = collectNodes(nextNode);
                    shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
                });
            }
            // Deletions from the end of the SLL
            else {
                this.staging.push(deleteNode);
                await withRenderTimeline(context, this.render, (tl) => {
                    tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
                    tl.call(() => {currNode.next = null;});
                    tl.to(deleteNode, { nodeOpacity: 0, duration: fadeOutTime });
                });
                this.staging = this.staging.filter(n => n !== deleteNode);
                this.tailPtr = currNode;
            }

            this.numElements--;
        }

        return true;    // Deletion was successful
    }

    // Clear the SLL and set head and tail to null
    async clearAll(context: CanvasRenderingContext2D, fadeOutTime = 1) {
        if (!this.headPtr) return;
        
        const nodes = collectNodes(this.headPtr);
        if (nodes.length === 0) {
            return;
        }

        for (const n of nodes) gsap.killTweensOf(n);
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;

        const stagedSet = new Set(this.staging);
        for (const n of nodes) {
            if (!stagedSet.has(n)) this.staging.push(n);
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

        await withRenderLoop(context, this.render, fades);
        for (const n of nodes) {
            n.next = null;
        }

        const nodeSet = new Set(nodes);
        this.staging = this.staging.filter((n) => !nodeSet.has(n));
        this.render(context);
    }
}