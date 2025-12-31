import { DoublyLinkedList } from "./DLL";
import { CircularDLLNode } from "./CircularDLLNode";
import gsap, { context, set, timeline } from "gsap";

// Circular Doubly Linked List class extends DoublyLinkedList
export class CircularDLL extends DoublyLinkedList {
    protected headPtr: CircularDLLNode | null;
    protected tailPtr: CircularDLLNode | null;
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }

    // Preload the CDLL without gsap animating
    loadDLL(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            if (currNode === null) {
                // headPtr next and prev pointers points to itself by default, as defined in CircularDLLNode constructor
                this.headPtr = new CircularDLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                this.headPtr.drawNode(context);
                currNode = this.headPtr;
            }
            else {
                
                const newNode = new CircularDLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                // Set newNode next pointer to the head node and its prev pointer to currNode
                newNode.next = this.headPtr;
                newNode.prev = currNode;

                this.headPtr!.prev = newNode;   // Set head node prev pointer to newNode then redraw
                this.headPtr!.drawNode(context);
                currNode.next = newNode;    // Set currNode next pointer to newNode then redraw
                currNode.drawNode(context);

                newNode.drawNode(context);
                currNode = currNode.next;
            }

            this.tailPtr = currNode;    // Update tailPtr
            this.numElements++; // Increment number of elements
        }
    }

    // Draw the CDLL
    draw(context: CanvasRenderingContext2D) {
        // Return early if list is empty
        if (!this.headPtr) {
            return;
        }

        let currNode = this.headPtr;
        
        // Use do while loop to traverse CDLL
        do {
            currNode.drawNode(context);
            currNode = currNode.next!;
        } while (currNode != this.headPtr);
    }

    // Helper method to extract logic animating the movements of nodes
    protected animateNodeShift(nodes: CircularDLLNode[], offsetX: number, duration: number): Promise<void>[] {
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

    // Search through the CDLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        // Return early if the list is empty
        if (!this.headPtr) {
            return -1;
        }

        let currNode = this.headPtr;
        let index = 0;

        // Use do while loop to traverse CDLL
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

    // Traverse forward through the CDLL and print the nodes index and data
    async traverseForward(context: CanvasRenderingContext2D) {
        // Return early if the list is empty
        if (!this.headPtr) {
            return;
        }

        let currNode = this.headPtr;
        let index = 0;

        // Use do while loop to traverse CDLL
        do {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
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

        // Use do while loop to traverse CDLL
        do {
            // Highlight nodes to show traversal
            await this.highlightNode(context, currNode);
            console.log(`[${index}]: ${currNode.data}`);
            currNode = currNode.prev!;
            index++;
        }
        while(currNode != this.tailPtr);
    }

    // Insert at the end of the CDLL
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {
        let newNode: CircularDLLNode;

        // Empty CDLL case
        if (this.headPtr === null) {
            // newNode next and prev pointers point to itself by default as defined in CircularDLLNode constructor
            newNode = new CircularDLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;
        }
        else {
            newNode = new CircularDLLNode(this.tailPtr!.x + this.nodeWidth * 2, this.tailPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
            newNode.next = this.headPtr;    // Set newNode.next to the head node
            newNode.prev = this.tailPtr;    // Set newNode.prev to the tail node

            this.headPtr.prev = newNode;    // Set the head node prev pointer to newNode then redraw
            this.headPtr.drawNode(context);
            this.tailPtr!.next = newNode;   // Set the tail node next pointer to newNode then redraw
            this.tailPtr!.drawNode(context);
            this.tailPtr = newNode; // Update the tail pointer to the new node
        }

        // Fade in the new node
        await newNode.fadeInNode(context, fadeIntime);
        this.numElements++; // Increment number of elements
    }

    // Insert to the head of the CDLL
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {

        const newNode = new CircularDLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);

        // If the CDLL was previously empty, tailPtr will also point to the newNode
        if (!this.headPtr) {
            this.tailPtr = newNode;
        }
        else {
            const movingNodes: CircularDLLNode[] = [];   // This array is used to store the nodes which will be moving
            let tempPtr = this.headPtr; // This pointer will be used to help move the CDLL forward

            // Add the nodes to movingNodes
            do {
                movingNodes.push(tempPtr);
                tempPtr = tempPtr.next!;
            }
            while (tempPtr != this.headPtr);

            // Animate the movement of the following nodes
            const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
            await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

            // Set newNode next pointer to the head, and prev to the tail
            newNode.next = this.headPtr;
            newNode.prev = this.tailPtr;
            this.headPtr.prev = newNode;    // Set the head node prev to newNode then redraw
            this.headPtr.drawNode(context);
            this.tailPtr!.next = newNode;   // Set tail node next to newNode then redraw
            this.tailPtr!.drawNode(context);
        }

        this.headPtr = newNode; // Update the headPtr to the new node

        // Fade in the new node
        await newNode.fadeInNode(context, fadeIntime);
        this.numElements++; // Increment the number of elements
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1) {
        // Error if the insertion index is not valid
        if(index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }

        // Initially set currNode to the head
        let currNode = this.headPtr!;

        // Traversal is more / as efficient from head than tail
        if (index <= Math.floor(this.numElements / 2)) {
            if (index === 0) {
                await this.prepend(context, newData, fadeIntime);
                return true;    // Insertion was successful
            }
            else {
                // currNode is already set to the head

                // Highlight nodes to show traversal, stop right before the index of insertion
                for (let i = 0; i < index - 1; i++){
                    await this.highlightNode(context, currNode);
                    currNode = currNode.next!;
                }
                await this.highlightNode(context, currNode);
            }
        }
        // Traversal is more efficient from tail then head
        else {
            if (index === this.numElements) {
                await this.append(context, newData, fadeIntime);
                return true;    // Insertion was successful
            }
            else {
                // Set currNode to the tail
                currNode = this.tailPtr!;

                // Highlight nodes to show traversal, before the index of insertion
                for (let i = this.numElements - 1; i > index - 1; i--){
                    await this.highlightNode(context, currNode);
                    currNode = currNode.prev!;
                }
                await this.highlightNode(context, currNode);
            }
        }

        // Insertions in the middle of the CDLL
        const nextNode = currNode.next!;  // Save the next node after the current node using this pointer
        const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up

        const newNode = new CircularDLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
        newNode.next = nextNode;    // Set newNode.next to nextNode
        newNode.prev = currNode;    // Set newNode.prev to currNode

        const movingNodes: CircularDLLNode[] = [];   // This array is used to store the nodes which will be moving
        let tempPtr: CircularDLLNode | null = currNode.next!; // This pointer will be used to help move nodes following the new node forward

        // Add the nodes to movingNodes
        while (tempPtr != this.headPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next!;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
        await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

        // Fade in the new node
        await newNode.fadeInNode(context, fadeIntime);

        // Fade out the curr nodes next pointer, than set it to the new node
        await currNode.fadeOutNext(context, fadeIntime, () => {
            // Clear the area between the current node and nextNode (to fade out currNode next pointer)
            context.clearRect(currNode.x + this.nodeWidth + 1, currNode.y, this.nodeWidth * 3 - 2, this.nodeHeight / 2);
            currNode.drawNode(context);
            newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared from the above statements
        });
        currNode.next = newNode;

        // Fade in the current nodes next pointer, which now points to the new node
        await currNode.fadeInNext(context, fadeIntime, () => {
            currNode.drawNode(context);
            newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
        });

        // Fade out the next nodes prev pointer, than set it to the new node
        await nextNode.fadeOutPrev(context, fadeIntime, () => {
            // Clear the area between the current node and nextNode (to fade out nextNode prev pointer)
            context.clearRect(currNode.x + this.nodeWidth + 1, currNode.y + this.nodeHeight / 2, this.nodeWidth * 3, this.nodeHeight / 2);
            nextNode.drawNode(context); // Order is flipped here to prevent arrow clearing bugs
            currNode.drawNode(context); // Redraw currNode as some of its next pointer gets cleared by the fade out
            newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
        });
        nextNode.prev = newNode;

        // Fade in the next nodes prev pointer, which now points to the new node
        await nextNode.fadeInPrev(context, fadeIntime, () => {
            nextNode.drawNode(context);
            newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
        });

        // Move the new node to the same height as the other nodes
        await newNode.moveNode(context, newNode.x, this.y, fadeIntime, () => {
            // Clear area between currNode and nextNode, with enough height to clear new node
            context.clearRect(currNode.x + this.nodeWidth, this.y, this.nodeWidth * 3, this.nodeHeight * 4);
            this.headPtr!.drawNode(context);    // Redraw head node so part of its prev pointer does not get cleared
            currNode.drawNode(context); // draw prev node after clearing and pointer movement
            nextNode.drawNode(context); // draw next node after clearing and pointer movement
            newNode.drawNode(context, false);  // draw new node after clearing
        });

        this.numElements++; // Increment number of elements   
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

            // If firstNode points to itself, then it is the only node in the CDLL, and the CDLL will be empty after it is removed
            // Head and tail must be set to null
            if (firstNode.next === firstNode) {
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                this.headPtr = firstNode.next;  // Update the head to the node after firstNode next
            }

            // This branch should execute as long as there is at least one node remaining after the deletion, otherwise head would be null
            if (this.headPtr) {
                // Fade out the new head node prev pointer than set it to the tail node
                await this.headPtr.fadeOutPrev(context, fadeOutTime);
                this.headPtr.prev = this.tailPtr;
                // Fade the new head node prev pointer back in
                await this.headPtr.fadeInPrev(context, fadeOutTime);

                // Fade out the tail node next pointer than set it to the new head node
                await this.tailPtr!.fadeOutNext(context, fadeOutTime);
                this.tailPtr!.next = this.headPtr;
                // Fade the tail node next pointer back in
                await this.tailPtr!.fadeInNext(context, fadeOutTime);
            }

            // Fade out firstNode pointers out first so they get cleared properly
            await firstNode.fadeOutNext(context, fadeOutTime, () => {
                firstNode.drawNode(context);
                this.headPtr?.drawNode(context);    // Draw the head node if it exists so part of its pointer does not get cut off
                this.tailPtr?.drawNode(context); 
            });

            await firstNode.fadeOutPrev(context, fadeOutTime, () => {
                firstNode.drawNode(context);
                this.headPtr?.drawNode(context);    // Draw the head node if it exists so part of its pointer does not get cut off
                this.tailPtr?.drawNode(context); 
            });

            // Fade out the first node, after setting its pointers to null
            firstNode.next = null;
            firstNode.prev = null;
            await firstNode.fadeOutNode(context, fadeOutTime);

            // Only need to move nodes if there are nodes to move
            if (this.headPtr) {
                const movingNodes: CircularDLLNode[] = [];   // This array is used to store the nodes which will be moving
                let tempPtr = this.headPtr; // This pointer will be used to help move the remaining nodes back
                
                // Add the nodes to movingNodes
                do {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
                }
                while(tempPtr != this.headPtr);

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
            }

            this.numElements--; // Decrement number of elements
            
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
            const lastNode = this.tailPtr!;

            // If the linked list becomes empty after this removal, both head and tail pointers should be null
            // This will happen when there is only one node, and that is the one being removed
            if (this.headPtr.next === this.headPtr) {
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                this.tailPtr = this.tailPtr!.prev;
            }

            // This branch should execute as long as there is at least one node remaining after the deletion, otherwise head would be null
            if (this.headPtr) {
                // Fade out the head node prev pointer than set it to the new tail node
                await this.headPtr.fadeOutPrev(context, fadeOutTime);
                this.headPtr.prev = this.tailPtr;
                // Fade the head node prev pointer back in
                await this.headPtr.fadeInPrev(context, fadeOutTime);

                // Fade out the new tail node next pointer than set it to the head node
                await this.tailPtr!.fadeOutNext(context, fadeOutTime);
                this.tailPtr!.next = this.headPtr;
                // Fade the new tail node next pointer back in
                await this.tailPtr!.fadeInNext(context, fadeOutTime);
            }

            // Fade out lastNode pointers out first so they get cleared properly
            await lastNode.fadeOutNext(context, fadeOutTime, () => {
                lastNode.drawNode(context);
                this.headPtr?.drawNode(context);    // Draw the head node if it exists so part of its pointer does not get cut off
                this.tailPtr?.drawNode(context); 
            });

            await lastNode.fadeOutPrev(context, fadeOutTime, () => {
                lastNode.drawNode(context);
                this.headPtr?.drawNode(context);    // Draw the head node if it exists so part of its pointer does not get cut off
                this.tailPtr?.drawNode(context); 
            });

            // Fade out the last node, after setting its pointers to null
            lastNode.next = null;
            lastNode.prev = null;
            await lastNode.fadeOutNode(context, fadeOutTime);

            this.numElements--; // Decrement the number of elements

            // Return the removed nodes data
            return lastNode?.data;
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
            // Pointer for the node that will be deleted, initialized to the head
            let deleteNode = this.headPtr!;

            // Traversal is more / as efficient from head than tail
            if (index <= Math.floor((this.numElements - 1) / 2)) {
                // deleteNode is already set to the head

                // Highlight nodes to show traversal
                for (let i = 0; i < index; i++) {
                    await this.highlightNode(context, deleteNode);
                    deleteNode = deleteNode.next!;
                }
                await this.highlightNode(context, deleteNode);
            }
            // Traversal is more efficient from tail than head
            else {
                // Set deleteNode to the tail
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

            if (prevNode) {
                // Fade out prevNode next pointer, then set it to nextNode
                await prevNode.fadeOutNext(context, fadeOutTime);
                prevNode.next = nextNode;
                // Fade prevNode next pointer back in
                await prevNode.fadeInNext(context, fadeOutTime);
            }

            if (nextNode) {
                // Fade out nextNode prev pointer, then set it to prevNode
                await nextNode.fadeOutPrev(context, fadeOutTime);
                nextNode.prev = prevNode;
                // Fade nextNode prev pointer back in
                await nextNode.fadeInPrev(context, fadeOutTime);
            }

            // Set deleteNode next and prev pointers to null then fade it out
            deleteNode.prev = null;
            deleteNode.next = null;
            await deleteNode.fadeOutNode(context, fadeOutTime, () => {
                deleteNode.drawNode(context);
                prevNode?.drawNode(context);    // Draw prevNode if it is not null, so its pointers are not cleared
                nextNode?.drawNode(context);    // Draw nextNode if it is not null, so its pointers are not cleared
            });

            // Skip movement if list is now empty
            if (nextNode) {
                const movingNodes: CircularDLLNode[] = [];  // This array is used to store the nodes which will be moving
                let tempPtr = nextNode; // This pointer will be used to move the nodes following the removed node back

                // Add the nodes to movingNodes
                while (tempPtr != this.headPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
                }

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
            }

            this.numElements--; // Decrement the number of elements
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
                    await this.highlightNode(context, deleteNode);
                    await this.highlightNode(context, deleteNode, 500, "black", "lightgreen");
                    break;
                }

                await this.highlightNode(context, deleteNode);
                deleteNode = deleteNode.next!;

            } while (deleteNode != this.headPtr);

            // Data was not found
            if (deleteNode === this.headPtr && deleteNode.data != data) {
                return false;
            }

            // Save the nodes before and after deleteNode if they exist (or null if they don't)
            const prevNode = deleteNode.prev;
            const nextNode = deleteNode.next;

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

            if (prevNode) {
                // Fade out prevNode next pointer, then set it to nextNode
                await prevNode.fadeOutNext(context, fadeOutTime);
                prevNode.next = nextNode;
                // Fade prevNode next pointer back in
                await prevNode.fadeInNext(context, fadeOutTime);
            }

            if (nextNode) {
                // Fade out nextNode prev pointer, then set it to prevNode
                await nextNode.fadeOutPrev(context, fadeOutTime);
                nextNode.prev = prevNode;
                // Fade nextNode prev pointer back in
                await nextNode.fadeInPrev(context, fadeOutTime);
            }

            // Set deleteNode next and prev pointers to null then fade it out
            deleteNode.prev = null;
            deleteNode.next = null;
            await deleteNode.fadeOutNode(context, fadeOutTime, () => {
                deleteNode.drawNode(context);
                prevNode?.drawNode(context);    // Draw prevNode if it is not null, so its pointers are not cleared
                nextNode?.drawNode(context);    // Draw nextNode if it is not null, so its pointers are not cleared
            });

            // Skip movement if list is now empty
            if (nextNode) {
                const movingNodes: CircularDLLNode[] = [];  // This array is used to store the nodes which will be moving
                let tempPtr = nextNode; // This pointer will be used to move the nodes following the removed node back

                // Add the nodes to movingNodes
                while (tempPtr != this.headPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
                }

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }
    
    // Clear the CDLL and set head and tail to null
    // Also set each next and prev pointer to null
    async clearAll(context: CanvasRenderingContext2D) {
        // Return early if the list is empty
        if (!this.headPtr) {
            return;
        }

        let currNode = this.headPtr;
        const promises: Promise<void>[] = [];

        // Fade out the CDLL
        do {
            const node = currNode;
            currNode = currNode.next!;
            node.next = null;
            node.prev = null;

            const promise = new Promise<void>(async (resolve) => {
                await node.fadeOutNode(context, 1, () => {
                    node.drawNode(context);

                });
                resolve();
            });

            promises.push(promise);
        } while(currNode != this.headPtr);

        await Promise.all(promises);

        // Set head and tail to null, and number of elements to 0
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }
}