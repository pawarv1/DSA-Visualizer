import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./SLLNode";
import { LinkedList } from "./SLL";

// Singly linked list, but with a dummy head node, inherits from regular Linked List
export class DummyNodeSLL extends LinkedList {
    protected headPtr: LinkedListNode
    protected tailPtr: LinkedListNode
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = new LinkedListNode(x, y, nodeWidth, nodeHeight, null, opacity, opacity); // Head is set to a dummy node
        this.tailPtr = this.headPtr;    // Set tail to the head when initialized
        this.numElements = 0;
    }

    // Preload the SLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = this.headPtr

        for (let i = 0; i < nodeData.length; i++) {
            const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
            currNode.next = newNode;    // Set currNode.next to newNode then redraw
            currNode.drawNode(context);
            newNode.drawNode(context);
            currNode = currNode.next;
            this.tailPtr = currNode; // Update tail pointer to currNode
            this.numElements++; // Increment number of elements
        }
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
        let currNode = this.tailPtr;
        const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        currNode.next = newNode;    // Set currNode.next to newNode then redraw
        currNode.drawNode(context);
        this.tailPtr = newNode; // Update the tail pointer to the new node (regardless of which animation is being used)
        await newNode.fadeInNode(context, fadeIntime);  // Fade in the new node
        this.numElements++; // Increment number of elements
    }

    // Insert right after dummy head node
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {    
        const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
        let tempPtr = this.headPtr.next;    // This pointer will be used to help move the SLL forward
        
        // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
        await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

        // Only dummy head node exists
        if (this.headPtr.next === null) {
            // In this particular case, append can be used to simplify the code
            await this.append(context, newData, fadeIntime);
        }
        else {
            const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
            const newNode = new LinkedListNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            newNode.next = this.headPtr.next;   // set newNode.next to the node after the head

            await newNode.fadeInNode(context, fadeIntime); // Fade in the new node
            
            // Fade out the head nodes next pointer, than set it to the new node
            await this.headPtr.fadeOutPointer(context, fadeIntime, () => {
                // Clear the area between the head node and the following node
                context.clearRect(this.headPtr.x + this.nodeWidth, this.headPtr.y, this.nodeWidth * 3 - 1, this.nodeHeight);
                newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above statement
                this.headPtr.drawNode(context);
            });

            this.headPtr.next = newNode;

            // Redraw nextNode pointer to regain some of the arrow cleared in previous code.
            // The area in question may be insignificant enough to remove this line
            newNode.drawNode(context);

            // Fade head updated next pointer back in
            await this.headPtr.fadeInPointer(context, fadeIntime);

            // Move the new node to the same height as the other nodes
            await newNode.moveNode(context, newNode.x, this.y, fadeIntime, () => {
                // Clear the area affected by the movement
                context.clearRect(this.headPtr.x + this.nodeWidth, this.y, this.nodeWidth * 3 - 1, this.nodeHeight * 4);
                newNode.drawNode(context);  // Redraw newNode to show its position at current frame
                this.headPtr.drawNode(context); // Redraw head node to show updated next pointer position
            });

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
                const initialY = this.y + this.nodeHeight * 2;    // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
                newNode.next = currNode.next;   // Set newNode.next to currNode.next

                const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
                let tempPtr: LinkedListNode | null = currNode.next;  // This pointer will be used to help move nodes following the new node forward

                // Add the nodes to movingNodes
                while (tempPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next;
                }

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

                await newNode.fadeInNode(context, fadeIntime);  // Fade in the new node

                // Fade out the curr nodes next pointer, than set it to the new node
                await currNode.fadeOutPointer(context, fadeIntime, () => {
                    // Clear the area between the current node and the following node
                    context.clearRect(currNode.x + this.nodeWidth, currNode.y, this.nodeWidth * 3 - 1, this.nodeHeight);
                    newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above statement
                    currNode.drawNode(context);
                });

                currNode.next = newNode;

                // Redraw nextNode pointer to regain some of the arrow cleared in previous code.
                // The area in question may be insignificant enough to remove this line
                newNode.drawNode(context);

                // Fade currNode updated next pointer back in
                await currNode.fadeInPointer(context, fadeIntime);

                // Move the new node to the same height as the other nodes
                await newNode.moveNode(context, newNode.x, this.y, fadeIntime, () => {
                    // Clear the area affected by the movement
                    context.clearRect(currNode.x + this.nodeWidth, this.y, this.nodeWidth * 3 - 1, this.nodeHeight * 4);
                    newNode.drawNode(context);  // Redraw newNode to show its position at current frame
                    currNode.drawNode(context); // Redraw currNode to show updated next pointer position
                });

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
        let tempPtr = firstRealNode.next;  // Set tempPtr to the node after firstRealNode if it exists
        firstRealNode.next = null;  // Ensure the deleted nodes next pointer is set to null as well

        // If the removal of the node only leaves the dummy head, set the tail pointer to the head
        if (tempPtr === null) {
            this.tailPtr = this.headPtr;
        }

        // Fade out the head node next pointer, then set it to tempPtr (the node after firstRealNode)
        await this.headPtr.fadeOutPointer(context, fadeOutTime);
        this.headPtr.next = tempPtr;
        
        await this.headPtr.fadeInPointer(context, fadeOutTime); // Fade the head node next pointer back in
        
        // Fade out firstRealNode
        await firstRealNode.fadeOutNode(context, fadeOutTime, () => {
            firstRealNode.drawNode(context);
            // Draw the head node so its next pointer does not get cleared by the fade out
            this.headPtr.drawNode(context);
        });

        const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
        
        // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
        await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
        
        this.numElements--; // Decrement number of elements

        // Return the removed nodes data
        return firstRealNode.data;
    }

    // Remove from the end of the ll and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {

        let currNode = this.headPtr;

        // Highlight nodes to show traversal
        // Iteration stops right before the last node
        while (currNode.next != this.tailPtr) {
            await this.highlightNode(context, currNode);
            currNode = currNode.next!;
        }
        await this.highlightNode(context, currNode);

        const lastNode = currNode.next;
        currNode.next = null;   // Set currNode.next to null then redraw
        currNode.drawNode(context);
        this.tailPtr = currNode;    // Update the tail pointer

        await lastNode.fadeOutNode(context, fadeOutTime);   // Fade out the removed last node
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
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                // Fade out currNode next pointer, then set it to tempPtr (the node after deleteNode)
                await currNode.fadeOutPointer(context, fadeOutTime);
                currNode.next = tempPtr;
                await currNode.fadeInPointer(context, fadeOutTime);   // Fade currNode next pointer back in

                // Set the deleted node next pointer to null, then fade the node out
                deleteNode.next = null;
                await deleteNode.fadeOutNode(context, fadeOutTime, () => {
                    deleteNode.drawNode(context);
                    currNode.drawNode(context); // Redraw currNode, as part of its next pointer arrow would otherwise be cleared by the fade out
                });

                const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving

                // Add the nodes to movingNodes
                while (tempPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next;
                }

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
            }
            // Deletions from the end of the SLL
            else {
                currNode.next = null;   // Set currNode.next to null then redraw
                currNode.drawNode(context);
                this.tailPtr = currNode;    // Update the tail pointer
                await deleteNode.fadeOutNode(context, fadeOutTime); // Fade out the deleted node
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
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                // Fade out currNode next pointer, then set it to tempPtr (the node after deleteNode)
                await currNode.fadeOutPointer(context, fadeOutTime);
                currNode.next = tempPtr;
                await currNode.fadeInPointer(context, fadeOutTime);   // Fade currNode next pointer back in

                // Set the deleted node next pointer to null, then fade the node out
                deleteNode.next = null;
                await deleteNode.fadeOutNode(context, fadeOutTime, () => {
                    deleteNode.drawNode(context);
                    currNode.drawNode(context); // Redraw currNode, as part of its next pointer arrow would otherwise be cleared by the fade out
                });
                
                const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving

                // Add the nodes to movingNodes
                while (tempPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next;
                }

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
            }
            // Deletions from the end of the SLL
            else {
                currNode.next = null;   // Set currNode.next to null then redraw
                currNode.drawNode(context);
                this.tailPtr = currNode;    // Update the tail pointer
                await deleteNode.fadeOutNode(context, fadeOutTime); // Fade out the deleted node
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Clear all but the dummy head node
    // Also set each next pointer to null
    async clearAll(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr.next;
        const promises: Promise<void>[] = [];

        this.tailPtr = this.headPtr;    // Set the tail pointer to the dummy head node
        this.headPtr.next = null;
        this.headPtr.drawNode(context);
        this.numElements = 0;   // Set number of elements to 0

        // Fade out the SLL
        while (currNode) {
            const node = currNode;
            currNode = currNode.next;
            node.next = null;   // Set each next pointer to null

            const promise = new Promise<void>(async (resolve) => {
                await node.fadeOutNode(context, 1);
                resolve();
            });

            promises.push(promise);
        }
        await Promise.all(promises);
    }
}