import gsap, { context, set, timeline } from "gsap";
import { DLLNode } from "./DLLNode";

// Doubly linked list class
export class DoublyLinkedList {
    protected headPtr: DLLNode | null;
    protected tailPtr: DLLNode | null;
    protected numElements: number;

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

    // Preload the DLL without gsap animating
    loadDLL(context: CanvasRenderingContext2D, nodeData: any[]) {
        // Initialize currNode to null as the DLL is empty
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            // Loading in the first node
            if (currNode === null) {
                this.headPtr = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                this.headPtr.drawNode(context);
                currNode = this.headPtr;
            }
            // Loading in the following nodes
            else {
                const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                currNode.next = newNode;
                newNode.prev = currNode;
                // Draw the nodes after setting their pointers
                currNode.drawNode(context);
                newNode.drawNode(context);
                currNode = currNode.next;
            }

            this.tailPtr = currNode;    // Update tailPtr
            this.numElements++; // Increment number of elements
        }
    }

    // Draw the DLL
    draw(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;

        while(currNode) {
            currNode.drawNode(context);
            currNode = currNode.next;
        }
    }

    // Method to higlight a specific node for a short duration then set it back to normal afterwards
    protected async highlightNode(context: CanvasRenderingContext2D, node: DLLNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
        return new Promise<void>((resolve) => {
            node.outlineColor = outlineColor
            node.fillColor = fillColor;
            node.drawNode(context);

            setTimeout(() => {
                // Reset to orignal colors
                node.outlineColor = "black";
                node.fillColor = "white";
                node.drawNode(context);
                resolve();
            }, duration);
        });
    }

    // Helper method to extract logic animating the movements of nodes
    protected animateNodeShift(nodes: DLLNode[], offsetX: number, duration: number): Promise<void>[] {
        return nodes.map(node =>
            new Promise(resolve => {
                gsap.to(node, {
                    x: node.x + offsetX,
                    duration,
                    onComplete: resolve
                });
            })
        );
    }

    // Helper method which genealizes the central draw loop pattern
    // Improves efficiency for large movement animations
    protected async runWithCentralDrawLoop(context: CanvasRenderingContext2D, drawFn: (arg0: CanvasRenderingContext2D) => void, animationPromises: Promise<void>[]): Promise<void> {
        let animating = true;

        const drawLoop = () => {
            if (!animating) {
                return;
            }
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            drawFn(context);
        };

        gsap.ticker.add(drawLoop);

        await Promise.all(animationPromises);

        animating = false;
        gsap.ticker.remove(drawLoop);
    }

    // Return true if the DLL is empty
    isEmpty() {
        return this.numElements === 0;
    }

    // Return the size of the DLL
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
            this.tailPtr = newNode;
        }
        else {
            newNode = new DLLNode(this.tailPtr!.x + this.nodeWidth * 2, this.tailPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
            newNode.prev = this.tailPtr;    // Set newNode.prev to the tail node
            this.tailPtr!.next = newNode;   // Set the tail node next pointer to newNode then redraw
            this.tailPtr!.drawNode(context);
            this.tailPtr = newNode; // Update the tail pointer to the new node
        }

        await newNode.fadeInNode(context, fadeIntime);  // Fade in the new node
        this.numElements++; // Increment number of elements
    }

    // Insert to the head of the DLL
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        const movingNodes: DLLNode[] = [];   // This array is used to store the nodes which will be moving
        let tempPtr = this.headPtr;    // This pointer will be used to help move the DLL forward
        
        // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
        await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

        const newNode = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
        newNode.next = this.headPtr;    // Set newNode.next to the head node

        // If the DLL was previously empty, tail pointer will also point to the new node 
        if (this.headPtr === null) {
            this.tailPtr = newNode;
        }
        else {
            // Set the head node prev to newNode then redraw
            this.headPtr.prev = newNode;
            this.headPtr.drawNode(context);
        }
        this.headPtr = newNode; // Update head pointer to the new node
        await newNode.fadeInNode(context, fadeIntime);  // Fade in new node
        this.numElements++; // Increment the number of elements
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1) {
        // Error if the insertion index is not valid
        if(index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }

        let currNode = this.headPtr!;

        // Traversal is more / as efficient from head than tail
        if (index <= Math.floor(this.numElements / 2)) {
            // Inserting to the head can be taken care of with prepend
            if (index === 0) {
                await this.prepend(context, newData, fadeIntime);
                return true;    // Insertion was successful
            }
            else {
                // Highlight nodes to show traversal, stop right before the index of insertion
                for (let i = 0; i < index - 1; i++){
                    await this.highlightNode(context, currNode);
                    currNode = currNode.next!;
                }
                await this.highlightNode(context, currNode);
            }
        }
        // Traversal is more efficient from tail than head
        else {
            // Inserting to the tail can be taken care of with append
            if (index === this.numElements) {
                await this.append(context, newData, fadeIntime);
                return true;    // Insertion was successful
            }
            else {
                currNode = this.tailPtr!;

                // Highlight nodes to show traversal, stop right before the index of insertion
                for (let i = this.numElements - 1; i > index - 1; i--){
                    await this.highlightNode(context, currNode);
                    currNode = currNode.prev!;
                }
                await this.highlightNode(context, currNode);
            }
        }

        const nextNode = currNode.next!;  // Save the next node after the current node using this pointer
        const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
        const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
        newNode.next = nextNode;    // Set newNode.next to nextNode
        newNode.prev = currNode;    // Set newNode.prev to currNode

        const movingNodes: DLLNode[] = [];   // This array is used to store the nodes which will be moving
        let tempPtr: DLLNode | null = nextNode; // This pointer will be used to help move nodes following the new node forward

        // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
        await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

        await newNode.fadeInNode(context, fadeIntime); // Fade in the new node

        // Fade out the curr nodes next pointer, than set it to the new node
        await currNode.fadeOutNext(context, fadeIntime, () => {
            // Clear the area between the current node and nextNode (to fade out currNode next pointer)
            context.clearRect(currNode.x + this.nodeWidth, currNode.y, this.nodeWidth * 3 - 1, this.nodeHeight / 2);
            newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above statement
            currNode.drawNode(context);
        });
        currNode.next = newNode;

        // Fade in the current nodes next pointer, which now points to the new node
        await currNode.fadeInNext(context, fadeIntime);

        // Fade out the next nodes prev pointer, than set it to the new node
        await nextNode.fadeOutPrev(context, fadeIntime, () => {
            // Clear the area between the current node and nextNode (to fade out nextNode prev pointer)
            context.clearRect(currNode.x + this.nodeWidth + 1, currNode.y + this.nodeHeight / 2, this.nodeWidth * 3, this.nodeHeight / 2);
            nextNode.drawNode(context); // Order is flipped here to prevent arrow clearing bugs
            newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above clear statement
            currNode.drawNode(context); // Redraw currNode as some of its next pointer gets cleared by the fade out
        });
        nextNode.prev = newNode

        // Fade in the next nodes prev pointer, which now points to the new node
        await nextNode.fadeInPrev(context, fadeIntime, () => {
            nextNode.drawNode(context);
            newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
        });

        // Move the new node to the same height as the other nodes
        await newNode.moveNode(context, newNode.x, this.y, fadeIntime, () => {
            // Clear area between currNode and nextNode, with enough height to clear new node
            context.clearRect(currNode.x + this.nodeWidth, this.y, this.nodeWidth * 3, this.nodeHeight * 4);
            newNode.drawNode(context);  // draw new node after clearing
            currNode.drawNode(context); // draw prev node after clearing and pointer movement
            nextNode.drawNode(context); // draw tail node after clearing and pointer movement
            newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
        });

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
            firstNode.next = null;  // Ensure the deleted nodes pointers are set to null as well

            // If head became null, this means that the linked list will be empty after the removal
            // Tail must be set to null as well
            if (this.headPtr === null) {
                this.tailPtr = null;
            }
            else {
                this.headPtr.prev = null;   // Update head node prev pointer to null then redraw the head
                this.headPtr.drawNode(context);
            }

            await firstNode.fadeOutNode(context, fadeOutTime); // Fade out the removed first node

            const movingNodes: DLLNode[] = [];  // This array is used to store the nodes which will be moving
            let tempPtr = this.headPtr; // This pointer will be used to help move the remaining nodes back

            // Add the nodes to movingNodes
            while (tempPtr) {
                movingNodes.push(tempPtr);
                tempPtr = tempPtr.next;
            }

            // Animate the movement of the following nodes
            const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
            await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

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
            let lastNode;

            // If the linked list becomes empty after this removal, both head and tail pointers should become null
            // This will happen when there is only one node, and that is the one being removed
            if (this.headPtr.next === null) {
                lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                lastNode = this.tailPtr;
                this.tailPtr = this.tailPtr!.prev;  // Set tailPtr to the node before the tail
                this.tailPtr!.next = null;  // Set the tail next to null
                lastNode!.prev = null;  // Ensure the deleted nodes pointers are also set to null
            }

            // Redraw the new last node if it exists
            this.tailPtr?.drawNode(context);

            await lastNode!.fadeOutNode(context, fadeOutTime);  // Fade out the removed last node
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

            // Save the nodes before and after deleteNode if they exist (or null if they don't)
            const prevNode = deleteNode.prev;
            const nextNode = deleteNode.next;

            // If head pointer points to deleteNode update it to nextNode
            if (this.headPtr === deleteNode) {
                this.headPtr = nextNode;
            }
            // If tail pointer points to deleteNode update it to prevNode
            if (this.tailPtr === deleteNode) {
                this.tailPtr = prevNode;
            }

            if (prevNode != null) {
                // Fade out prevNode next pointer, then set it to nextNode
                await prevNode.fadeOutNext(context, fadeOutTime);
                prevNode.next = nextNode;
                await prevNode.fadeInNext(context, fadeOutTime);    // Fade prevNode next pointer back in
            }

            if (nextNode != null) {
                // Fade out nextNode prev pointer than set it to prevNode
                await nextNode.fadeOutPrev(context, fadeOutTime);
                nextNode.prev = prevNode;
                await nextNode.fadeInPrev(context, fadeOutTime);    // Fade nextNode prev pointer back in
            }

            // Set deleteNode next and prev pointers to null then fade it out
            deleteNode.prev = null;
            deleteNode.next = null;

            await deleteNode.fadeOutNode(context, fadeOutTime, () => {
                deleteNode.drawNode(context);
                prevNode?.drawNode(context);    // Draw prevNode if it is not null, so its pointers are not cleared
                nextNode?.drawNode(context);    // Draw nextNode if it is not null, so its pointers are not cleared
            });

            const movingNodes: DLLNode[] = [];  // This array is used to store the nodes which will be moving
            let tempPtr = nextNode; // This pointer will be used to move the nodes following the removed node back

            // Add the nodes to movingNodes
            while (tempPtr) {
                movingNodes.push(tempPtr);
                tempPtr = tempPtr.next;
            }

            // Animate the movement of the following nodes
            const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
            await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

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

        // Save the nodes before and after deleteNode if they exist (or null if they don't)
        const prevNode = deleteNode.prev;
        const nextNode = deleteNode.next;

        // If head pointer points to deleteNode update it to nextNode
        if (this.headPtr === deleteNode) {
            this.headPtr = nextNode;
        }
        // If tail pointer points to deleteNode update it to prevNode
        if (this.tailPtr === deleteNode) {
            this.tailPtr = prevNode;
        }

        if (prevNode != null) {
            // Fade out prevNode next pointer, then set it to nextNode
            await prevNode.fadeOutNext(context, fadeOutTime);
            prevNode.next = nextNode;
            await prevNode.fadeInNext(context, fadeOutTime);    // Fade prevNode next pointer back in
        }

        if (nextNode != null) {
            // Fade out nextNode prev pointer than set it to prevNode
            await nextNode.fadeOutPrev(context, fadeOutTime);
            nextNode.prev = prevNode;
            await nextNode.fadeInPrev(context, fadeOutTime);    // Fade nextNode prev pointer back in
        }

        // Set deleteNode next and prev pointers to null then fade it out
        deleteNode.prev = null;
        deleteNode.next = null;

        await deleteNode.fadeOutNode(context, fadeOutTime, () => {
            deleteNode.drawNode(context);
            prevNode?.drawNode(context);    // Draw prevNode if it is not null, so its pointers are not cleared
            nextNode?.drawNode(context);    // Draw nextNode if it is not null, so its pointers are not cleared
        });

        const movingNodes: DLLNode[] = [];  // This array is used to store the nodes which will be moving
        let tempPtr = nextNode; // This pointer will be used to move the nodes following the removed node back

        // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
        await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

        this.numElements--; // Decrement the number of elements
        return true;    // Deletion was successful
    }

    // Clear the DLL and set head and tail to null
    // Also set each next and prev pointer to null
    async clearAll(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;
        const promises: Promise<void>[] = [];

        // Fade out the DLL
        while (currNode) {
            const node = currNode;
            currNode = currNode.next;
            node.prev = null;   // Set each prev pointer to null
            node.next = null;   // Set each next pointer to null

            const promise = new Promise<void>(async (resolve) => {
                await node.fadeOutNode(context, 1);
                resolve();
            });

            promises.push(promise);
        }

        await Promise.all(promises);
        // Set head and tail to null, and number of elements to 0
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }
}