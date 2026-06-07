import gsap  from "gsap";
import { SLLNode } from "./SLLNode";
import { LinkedList } from "./SLL";
import { collectNodes, highlightNode, withRenderTimeline, shiftNodesTL, withRenderLoop } from "./LLHelpers";

// Singly linked list, but with a dummy head node, inherits from regular Linked List
export class DummyNodeSLL extends LinkedList {
    protected headPtr: SLLNode
    protected tailPtr: SLLNode
    protected numElements: number = 0;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = new SLLNode(x, y, nodeWidth, nodeHeight, null, opacity, opacity); // Head is set to a dummy node
        this.tailPtr = this.headPtr;    // Set tail to the head when initialized
        this.headPtr.isSentinel = true;
    }
    
    // Preload the SLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = this.headPtr

        for (let i = 0; i < nodeData.length; i++) {
            const newNode = new SLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
            currNode.next = newNode;    // Set currNode.next to newNode then redraw
            currNode = currNode.next;
            this.tailPtr = currNode;
            this.numElements++;
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
            let currNode = this.headPtr.next;

            for (let i = 0; i < index; i++) {
                await highlightNode(context, currNode!, this.render);
                currNode = currNode!.next;
            }

            await highlightNode(context, currNode!, this.render);
            return currNode!.data;
        }
    }

    // Search through the SLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        let currNode = this.headPtr.next;
        let index = 0;

        while (currNode) {
            // Highlight nodes to show traversal
            await highlightNode(context, currNode, this.render);
            
            // Data was found
            if (currNode.data === data) {
                await highlightNode(context, currNode, this.render, 1000, "black", "lightgreen");
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
        let currNode = this.headPtr.next;
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
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        const newNode = new SLLNode(this.tailPtr.x + this.nodeWidth * 2, this.tailPtr.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        this.staging.push(newNode);
        await withRenderTimeline(context, this.render, (tl) => {
            // fade in new node
            tl.to(newNode, { nodeOpacity: 1, duration: fadeIntime });
            
            // Update tailPtr next
            tl.to(this.tailPtr, { pointerOpacityNext: 0, duration: 0});
            tl.call(() => {this.tailPtr!.next = newNode;});
            tl.to(this.tailPtr, { pointerOpacityNext: 1, duration: fadeIntime});
        });
        this.staging = this.staging.filter(n => n !== newNode);
        
        this.tailPtr = newNode;
        this.numElements++;
    }

    // Insert right after dummy head node
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {    
        // Only dummy head node exists
        if (this.headPtr.next === null) {
            await this.append(context, newData, fadeIntime);
        }
        else {
            const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
            const newNode = new SLLNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);

            this.staging.push(newNode);
            await withRenderTimeline(context, this.render, (tl) => {
                const movingNodes = collectNodes(this.headPtr.next);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

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
            this.numElements++;
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
                await highlightNode(context, currNode, this.render);
                currNode = currNode.next!;
            }
            await highlightNode(context, currNode, this.render);

            // Insertions in the middle of the SLL
            if (currNode.next) {
                const nextNode = currNode.next;
                const initialY = this.y + this.nodeHeight * 2;    // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new SLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
                this.staging.push(newNode);

                await withRenderTimeline(context, this.render, (tl) => {
                    const movingNodes = collectNodes(nextNode);
                    shiftNodesTL(tl, movingNodes, this.nodeWidth * 2, 1, 0);

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
                this.numElements++;
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
        await withRenderTimeline(context, this.render, (tl) => {
            // Update headPtr next pointer
            tl.to(this.headPtr, { pointerOpacityNext: 0, duration: fadeOutTime});
            tl.call(() => {this.headPtr.next = nextNode});
            tl.to(this.headPtr, { pointerOpacityNext: 1, duration: fadeOutTime});

            tl.call(() => {firstRealNode.next = null;});
            tl.to(firstRealNode, { nodeOpacity: 0, duration: fadeOutTime });
        });
        this.staging = this.staging.filter(n => n !== firstRealNode);

        if (nextNode) {
            await withRenderTimeline(context, this.render, (tl) => {
                const movingNodes = collectNodes(nextNode);
                shiftNodesTL(tl, movingNodes, this.nodeWidth * -2, 1, 0);
            });
        }
        
        this.numElements--;
        return firstRealNode.data;
    }

    // Remove from the end of the ll and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        if (this.numElements === 0) return null;

        let currNode = this.headPtr;

        // Highlight nodes to show traversal, stop right before last node
        while (currNode.next != this.tailPtr) {
            await highlightNode(context, currNode, this.render);
            currNode = currNode.next!;
        }
        await highlightNode(context, currNode, this.render);

        const lastNode = currNode.next;
        
        this.staging.push(lastNode);
        await withRenderTimeline(context, this.render, (tl) => {
            tl.to(currNode, { pointerOpacityNext: 0, duration: fadeOutTime });
            tl.call(() => {
                currNode.next = null;   // Set currNode.next to null then redraw
                this.tailPtr = currNode;    // Update the tail pointer
            })
            tl.to(lastNode, { nodeOpacity: 0, duration: fadeOutTime });
        });
        this.staging = this.staging.filter(n => n !== lastNode);
        this.numElements--;

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
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
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
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1) {
        if (this.headPtr.next === null) {
            return false;
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
                    // Update currNode next pointer to tempPtr (the node after deleteNode)
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

    // Clear all but the dummy head node
    async clearAll(context: CanvasRenderingContext2D, fadeOutTime = 1) {
        if (!this.headPtr.next) return;
        
        const nodes = collectNodes(this.headPtr.next);
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

        await withRenderLoop(context, this.render, fades);

        for (const n of nodes) {
            n.next = null;
        }

        const nodeSet = new Set(nodes);
        this.staging = this.staging.filter((n) => !nodeSet.has(n));
        this.render(context);
    }
}