import gsap, { context, set, timeline } from "gsap";
import { DLLNode } from "./DLLNode";
import { DoublyLinkedList } from "./DLL";

// Doubly linked list, but both the head and tail use sentinel nodes, inherits from regular Doubly Linked List
export class SentinelDLL extends DoublyLinkedList {
    protected headPtr: DLLNode;
    protected tailPtr: DLLNode;
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        // Head and tail are set to sentinel nodes
        this.headPtr = new DLLNode(x, y, nodeWidth, nodeHeight, null, opacity, opacity, opacity);
        this.tailPtr = new DLLNode(x + nodeWidth * 2, y, nodeWidth, nodeHeight, null, opacity, opacity, opacity);
        // Update head next pointer to tail and tail prev pointer to head
        this.headPtr.next = this.tailPtr;
        this.tailPtr.prev = this.headPtr;
        this.numElements = 0;
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
            
            currNode.drawNode(context); // Draw currNode after the pointer update
            this.tailPtr.drawNode(context); // Draw tail node after it is moved
            newNode.drawNode(context);

            currNode = currNode.next;
            this.numElements++; // Increment number of elements
        }
    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
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
                // currNode is already set to the node after head
                
                // Highlight nodes to show traversal if iterationAnimation is true
                for (let i = 0; i < index; i++) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode!);
                    }
                    currNode = currNode.next!;
                }

                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }
            // Traversal is more efficient from the tail than head
            else {
                // Set currNode to the node before tail
                currNode = this.tailPtr.prev!;

                // Highlight nodes to show traversal if iterationAnimation is true, before the index of insertion
                for (let i = this.numElements - 1; i > index; i--){
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.prev!;
                }

                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }

            return currNode!.data;
        }
    }

    // Search through the DLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any, iterationAnimation: boolean = true) {
        // currNode starts at the node after head
        let currNode = this.headPtr.next!;
        let index = 0;

        // Iterate until currNode is the sentinel tail node
        while (currNode != this.tailPtr) {
            // Highlight nodes to show traversal if iterationAnimation is true
            if (iterationAnimation) {
                await this.highlightNode(context, currNode);
            }
            
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
        newNode.next = this.tailPtr;    // Set newNode.next to the sentinel tail node
        newNode.prev = prevNode;    // Set newNode.prev to prevNode

        // Animate the node creation and pointer change sequence using timeline
        await new Promise<void>((resolve) => {
            const timeline = gsap.timeline({onComplete: () => resolve()});
            
            // Move the sentinel tail up to make space for the new node
            timeline.to(this.tailPtr, {
                x: this.tailPtr.x + this.nodeWidth * 2,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear the area between prevNode and the tail node
                    context.clearRect(prevNode.x + this.nodeWidth, this.y - 1, this.tailPtr.x - (prevNode.x + this.nodeWidth), this.nodeHeight + 2);
                    prevNode.drawNode(context); // Redraw prevNode to show updated next pointer arrow
                    this.tailPtr.drawNode(context); // Redraw tail node to show its position at current frame
                }
            });

            // Fade in the new node
            timeline.to(newNode, {
                nodeOpacity : 1,
                pointerOpacityNext: 1,
                pointerOpacityPrev: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    newNode.drawNode(context);
                }
            });

            // Fade out prev nodes next pointer, than set it to the new node
            timeline.to(prevNode, {
                pointerOpacityNext: 0,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear the area between prev node and the tail node
                    context.clearRect(prevNode.x + this.nodeWidth, prevNode.y, this.nodeWidth * 3 - 1, this.nodeHeight / 2);
                    newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above statement
                    prevNode.drawNode(context);
                },
                onComplete: () => {
                    prevNode.next = newNode;
                }
            });

            // Fade out the tail node prev pointer, than set it to the new node
            timeline.to(this.tailPtr, {
                pointerOpacityPrev: 0,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear the area between prev node and the tail node
                    context.clearRect(prevNode.x + this.nodeWidth + 1, prevNode.y + this.nodeHeight / 2, this.nodeWidth * 3, this.nodeHeight / 2);
                    this.tailPtr.drawNode(context); // Order is flipped here to prevent arrow clearing bugs
                    newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above clear statement
                },
                onComplete: () => {
                    this.tailPtr.prev = newNode;
                }
            });

            // Fade in prev nodes next pointer, which now points to the new node
            timeline.to(prevNode, {
                pointerOpacityNext: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    prevNode.drawNode(context);
                }
            });

            // Fade in the tail nodes prev pointer, which now points to the new node
            timeline.to(this.tailPtr, {
                pointerOpacityPrev: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    this.tailPtr.drawNode(context);
                    newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
                }
            });

            // Move the new node to the same height as the other nodes
            timeline.to(newNode, {
                y: this.y,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear area between prevNode and tail node, with enough height to clear new node
                    context.clearRect(prevNode.x + this.nodeWidth, this.y, this.nodeWidth * 3, this.nodeHeight * 4);
                    newNode.drawNode(context);  // draw new node after clearing
                    prevNode.drawNode(context); // draw prev node after clearing and pointer movement
                    this.tailPtr.drawNode(context); // draw tail node after clearing and pointer movement
                    newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
                }
            });
        });

        this.numElements++; // Increment number of elements
    }

    // Insert right after sentinel head node
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {    
        const movingNodes: DLLNode[] = [];   // This array is used to store the nodes which will be moving
        let tempPtr = this.headPtr.next;   // This pointer will be used to help move the DLL forward
        
        // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
        await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
        
        const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
        const nextNode = this.headPtr.next!;  // Save the next node after the head node using this pointer

        const newNode = new DLLNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
        newNode.next = nextNode;    // Set newNode.next to nextNode
        newNode.prev = this.headPtr;    // Set newNode.prev to the sentinel head node
        
        // Animate node creation and pointer change sequence with timeline
        await new Promise<void>((resolve) => {
            const timeline = gsap.timeline({onComplete: () => resolve()});

            // Fade in the new node
            timeline.to(newNode, {
                nodeOpacity : 1,
                pointerOpacityNext: 1,
                pointerOpacityPrev: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    newNode.drawNode(context);
                }
            });

            // Fade out the head nodes next pointer, than set it to the new node
            timeline.to(this.headPtr, {
                pointerOpacityNext: 0,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear the area between the head node and the following node
                    context.clearRect(this.headPtr.x + this.nodeWidth, this.headPtr.y, this.nodeWidth * 3 - 1, this.nodeHeight / 2);
                    newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above statement
                    this.headPtr.drawNode(context);
                },
                onComplete: () => {
                    this.headPtr.next = newNode;
                }
            });

            // Fade out the next nodes prev pointer, than set it to the new node
            timeline.to(nextNode, {
                pointerOpacityPrev: 0,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear the area between the head node and the following node
                    context.clearRect(this.headPtr.x + this.nodeWidth + 1, this.headPtr.y + this.nodeHeight / 2, this.nodeWidth * 3 - 1, this.nodeHeight / 2);
                    nextNode.drawNode(context); // Order is flipped here to prevent arrow clearing bugs
                    newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above clear statement
                },
                onComplete: () => {
                    nextNode.prev = newNode;
                }
            });

            // Fade in the head nodes next pointer, which now points to the new node
            timeline.to(this.headPtr, {
                pointerOpacityNext: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    this.headPtr.drawNode(context);
                }
            });

            // Fade in the next nodes prev pointer, which now points to the new node
            timeline.to(nextNode, {
                pointerOpacityPrev: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    nextNode.drawNode(context);
                    newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
                }
            });

            // Move the new node to the same height as the other nodes
            timeline.to(newNode, {
                y: this.y,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear the area affected by the movement
                    context.clearRect(this.headPtr.x + this.nodeWidth, this.y, this.nodeWidth * 3 - 1, this.nodeHeight * 4);
                    newNode.drawNode(context);  // draw new node after clearing
                    this.headPtr.drawNode(context); // draw prev node after clearing and pointer movement
                    nextNode.drawNode(context); // draw tail node after clearing and pointer movement
                    newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
                }
            });
        });

        this.numElements++; // Increment the number or elements
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1, iterationAnimation: boolean = true) {
        // Error if the insertion index is not valid
        if(index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }

        // Initially set currNode to node after the head
        let currNode = this.headPtr.next!;

        // Traversal is more / as efficient from head than tail
        if (index <= Math.floor(this.numElements / 2)) {
            if (index === 0) {
                await this.prepend(context, newData, fadeIntime);
                return true;    // Insertion was successful
            }
            else {
                // currNode is already set to the node after the head

                // Highlight nodes to show traversal if iterationAnimation is true, stop right before the index of insertion
                for (let i = 0; i < index - 1; i++){
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.next!;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }
        }
        // Traversal is more efficient from tail than head
        else {
            if (index === this.numElements) {
                await this.append(context, newData, fadeIntime);
                return true;    // Insertion was successful
            }
            else {
                // Set currNode to the node before tail
                currNode = this.tailPtr.prev!;

                // Highlight nodes to show traversal if iterationAnimation is true, before the index of insertion
                for (let i = this.numElements - 1; i > index - 1; i--){
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.prev!;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }
        }

        // Insertions in the middle of the DLL
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
        
        // Animate the creation of the new node and pointer change sequence using timeline
        await new Promise<void>((resolve) => {
            const timeline = gsap.timeline({onComplete: () => resolve()});

            // Fade in the new node
            timeline.to(newNode, {
                nodeOpacity : 1,
                pointerOpacityNext: 1,
                pointerOpacityPrev: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    newNode.drawNode(context);
                }
            });

            // Fade out the curr nodes next pointer, than set it to the new node
            timeline.to(currNode, {
                pointerOpacityNext: 0,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear the area between the current node and nextNode (to fade out currNode next pointer)
                    context.clearRect(currNode.x + this.nodeWidth, currNode.y, this.nodeWidth * 3 - 1, this.nodeHeight / 2); // Clear the area between the current node and the next node
                    newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above statement
                    currNode.drawNode(context);
                },
                onComplete: () => {
                    currNode.next = newNode;
                }
            });
            
            // Fade out the next nodes prev pointer, than set it to the new node
            timeline.to(nextNode, {
                pointerOpacityPrev: 0,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear the area between the current node and nextNode (to fade out nextNode prev pointer)
                    context.clearRect(currNode.x + this.nodeWidth + 1, currNode.y + this.nodeHeight / 2, this.nodeWidth * 3, this.nodeHeight / 2);
                    nextNode.drawNode(context); // Order is flipped here to prevent arrow clearing bugs
                    newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above clear statement
                },
                onComplete: () => {
                    nextNode.prev = newNode;
                }
            });

            // Fade in the current nodes next pointer, which now points to the new node
            timeline.to(currNode, {
                pointerOpacityNext: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    currNode.drawNode(context);
                }
            });

            // Fade in the next nodes prev pointer, which now points to the new node
            timeline.to(nextNode, {
                pointerOpacityPrev: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    nextNode.drawNode(context);
                    newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
                }
            });

            // Move the new node to the same height as the other nodes
            timeline.to(newNode, {
                y: this.y,
                duration: fadeIntime,
                onUpdate: () => {
                    // Clear area between prevNode and nextNode, with enough height to clear new node
                    context.clearRect(currNode.x + this.nodeWidth, this.y, this.nodeWidth * 3, this.nodeHeight * 4);
                    newNode.drawNode(context);  // draw new node after clearing
                    currNode.drawNode(context); // draw prev node after clearing and pointer movement
                    nextNode.drawNode(context); // draw tail node after clearing and pointer movement
                    newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
                }
            });
        });

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

        // Animate the node removal and pointer change sequence using timeline
        await new Promise<void>((resolve) => {
            const timeline = gsap.timeline({onComplete: () => resolve()});

            // Fade the head node next pointer out, then set it to nextNode
            timeline.to(this.headPtr, {
                pointerOpacityNext: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    this.headPtr.drawNode(context);
                },
                onComplete: () => {
                    this.headPtr.next = nextNode;
                }
            });

            // Fade head node next pointer back in
            timeline.to(this.headPtr, {
                pointerOpacityNext: 1,
                duration: fadeOutTime,
                onUpdate: () => {
                    this.headPtr.drawNode(context);
                }
            });

            // Fade nextNode prev pointer out, then set it to the head node
            timeline.to(nextNode, {
                pointerOpacityPrev: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    nextNode.drawNode(context);
                },
                onComplete: () => {
                    nextNode.prev = this.headPtr;
                }
            });

            // Fade nextNode prev pointer back in
            timeline.to(nextNode, {
                pointerOpacityPrev: 1,
                duration: fadeOutTime,
                onUpdate: () => {
                    nextNode.drawNode(context);
                }
            });

            // Set firstRealNode next and prev pointers to null, then fade it out
            timeline.to(firstRealNode, {
                nodeOpacity: 0,
                pointerOpacity: 0,
                duration: fadeOutTime,
                onStart: () => {
                    firstRealNode.next = null;
                    firstRealNode.prev = null;
                },
                onUpdate: () => {
                    firstRealNode.drawNode(context);
                    // Draw the head node and nextNode so their pointers are not cleared by the fade out
                    this.headPtr.drawNode(context);
                    nextNode.drawNode(context);
                }
            });
        });

        const movingNodes: DLLNode[] = [];  // This array is used to store the nodes which will be moving
        let tempPtr: DLLNode | null = nextNode; // This pointer will be used to help move the remaining nodes back
        
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

    // Remove the node right before the sentinel tail node and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // No such node to remove so return early
        if (this.headPtr.next === this.tailPtr) {
            return;
        }

        const lastRealNode = this.tailPtr.prev!;
        const prevNode = lastRealNode.prev!;    // Save the node before lastRealNode with this pointer
        
        // Animate the node removal and pointer change sequence using timeline
        await new Promise<void>((resolve) => {
            const timeline = gsap.timeline({onComplete: () => resolve()});

            // Fade prevNode next pointer out, then set it to the tail node
            timeline.to(prevNode, {
                pointerOpacityNext: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    prevNode.drawNode(context);
                },
                onComplete: () => {
                    prevNode.next = this.tailPtr;
                }
            });

            // Fade prevNode next pointer back in
            timeline.to(prevNode, {
                pointerOpacityNext: 1,
                duration: fadeOutTime,
                onUpdate: () => {
                    prevNode.drawNode(context);
                }
            });

            // Fade tail node prev pointer out, then set it to prevNode
            timeline.to(this.tailPtr, {
                pointerOpacityPrev: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    this.tailPtr.drawNode(context);
                },
                onComplete: () => {
                    this.tailPtr.prev = prevNode;
                }
            });

            // Fade tail node prev pointer back in
            timeline.to(this.tailPtr, {
                pointerOpacityPrev: 1,
                duration: fadeOutTime,
                onUpdate: () => {
                    this.tailPtr.drawNode(context);
                }
            });

            // Set lastRealNode next and prev pointers to null, then fade it out
            timeline.to(lastRealNode, {
                nodeOpacity: 0,
                pointerOpacity: 0,
                duration: fadeOutTime,
                onStart: () => {
                    lastRealNode.next = null;
                    lastRealNode.prev = null;
                },
                onUpdate: () => {
                    lastRealNode.drawNode(context);
                    // Draw prevNode and the tail node so their pointers are not cleared by the fade out
                    prevNode.drawNode(context);
                    this.tailPtr.drawNode(context);
                }
            });

            // Move the sentinel tail node back
            timeline.to(this.tailPtr, {
                x: prevNode.x + this.nodeWidth * 2,
                duration: fadeOutTime,
                onUpdate: () => {
                    // Clear the area affected by the movement
                    context.clearRect(prevNode.x + this.nodeWidth, this.y - 1, this.nodeWidth * 4 + 1, this.nodeHeight + 2);
                    prevNode.drawNode(context); // Redraw prevNode to show updated next pointer arrow
                    this.tailPtr.drawNode(context); // Redraw tail node to show its position at current frame
                }
            });
        });

        this.numElements--; // Decrement the number of elements

        // Return the removed nodes data
        return lastRealNode.data;
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
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

                // Highlight nodes to show traversal if iterationAnimation is true
                for (let i = 0; i < index; i++) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, deleteNode);
                    }
                    deleteNode = deleteNode.next!;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, deleteNode);
                }
            }
            // Traversal is more efficient from tail than head
            else {
                // Set deleteNode to the node before the tail
                deleteNode = this.tailPtr.prev!;

                // Highlight nodes to show traversal if iterationAnimation is true
                for (let i = this.numElements - 1; i > index; i--) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, deleteNode);
                    }
                    deleteNode = deleteNode.prev!;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, deleteNode);
                }
            }

            // Save the nodes before and after deleteNode
            const prevNode = deleteNode.prev!;
            const nextNode = deleteNode.next!;

            // Animate the node removal and pointer change sequence using timeline
            await new Promise<void>((resolve) => {
                const timeline = gsap.timeline({onComplete: () => resolve()});

                // Fade out prevNode next pointer
                timeline.to(prevNode, {
                    pointerOpacityNext: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        prevNode.drawNode(context);
                    }
                });

                // Set prevNode next pointer to nextNode then fade it back in
                timeline.to(prevNode, {
                    pointerOpacityNext: 1,
                    duration: fadeOutTime,
                    onStart: () => {
                        prevNode.next = nextNode;
                    },
                    onUpdate: () => {
                        prevNode.drawNode(context);
                    }
                });

                // Fade out nextNode prev pointer
                timeline.to(nextNode, {
                    pointerOpacityPrev: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        nextNode.drawNode(context);
                    }
                });

                // Set nextNode prev pointer to prevNode then fade it back in
                timeline.to(nextNode, {
                    pointerOpacityPrev: 1,
                    duration: fadeOutTime,
                    onStart: () => {
                        nextNode.prev = prevNode;
                    },
                    onUpdate: () => {
                        nextNode.drawNode(context);
                    }
                });

                // Set deleteNode next and prev pointers to null then fade it out
                timeline.to(deleteNode, {
                    nodeOpacity : 0,
                    pointerOpacityNext: 0,
                    pointerOpacityPrev: 0,
                    duration: fadeOutTime,
                    onStart: () => {
                        deleteNode.prev = null;
                        deleteNode.next = null;
                    },
                    onUpdate: () => {
                        deleteNode.drawNode(context);
                        prevNode.drawNode(context);    // Draw prevNode so its pointers are not cleared
                        nextNode.drawNode(context);    // Draw nextNode so its pointers are not cleared
                    }
                });
            });

            const movingNodes: DLLNode[] = [];  // This array is used to store the nodes which will be moving
            let tempPtr: DLLNode | null = nextNode; // This pointer will be used to move the nodes following the removed node back

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
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        // Pointer for the node that will be deleted, initialized to the node after the head
        let deleteNode = this.headPtr.next!;

        while (deleteNode.data != null) {
            if (deleteNode.data === data) {
                if (iterationAnimation) {
                    await this.highlightNode(context, deleteNode);
                }
                await this.highlightNode(context, deleteNode, 500, "black", "lightgreen");
                break;
            }

            if (iterationAnimation) {
                await this.highlightNode(context, deleteNode);
            }

            deleteNode = deleteNode.next!;
        }

        // Data was not found
        if (deleteNode.data === null) {
            return false;
        }

        // Save the nodes before and after deleteNode
        const prevNode = deleteNode.prev!;
        const nextNode = deleteNode.next!;

        // Animate the node removal and pointer change sequence using timeline
        await new Promise<void>((resolve) => {
            const timeline = gsap.timeline({onComplete: () => resolve()});

            // Fade out prevNode next pointer
            timeline.to(prevNode, {
                pointerOpacityNext: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    prevNode.drawNode(context);
                }
            });

            // Set prevNode next pointer to nextNode then fade it back in
            timeline.to(prevNode, {
                pointerOpacityNext: 1,
                duration: fadeOutTime,
                onStart: () => {
                    prevNode.next = nextNode;
                },
                onUpdate: () => {
                    prevNode.drawNode(context);
                }
            });

            // Fade out nextNode prev pointer
            timeline.to(nextNode, {
                pointerOpacityPrev: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    nextNode.drawNode(context);
                }
            });

            // Set nextNode prev pointer to prevNode then fade it back in
            timeline.to(nextNode, {
                pointerOpacityPrev: 1,
                duration: fadeOutTime,
                onStart: () => {
                    nextNode.prev = prevNode;
                },
                onUpdate: () => {
                    nextNode.drawNode(context);
                }
            });

            // Set deleteNode next and prev pointers to null then fade it out
            timeline.to(deleteNode, {
                nodeOpacity : 0,
                pointerOpacityNext: 0,
                pointerOpacityPrev: 0,
                duration: fadeOutTime,
                onStart: () => {
                    deleteNode.prev = null;
                    deleteNode.next = null;
                },
                onUpdate: () => {
                    deleteNode.drawNode(context);
                    prevNode.drawNode(context);    // Draw prevNode so its pointers are not cleared
                    nextNode.drawNode(context);    // Draw nextNode so its pointers are not cleared
                }
            });
        });

        const movingNodes: DLLNode[] = [];  // This array is used to store the nodes which will be moving
        let tempPtr: DLLNode | null = nextNode; // This pointer will be used to move the nodes following the removed node back

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

    // Clear all but the sentinel head and tail nodes, and also set each non sentinel nodes pointers to null
    async clearAll(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr.next;

        // Make head and tail nodes point to each other and redraw them
        this.headPtr.next = this.tailPtr;
        this.headPtr.drawNode(context);
        this.tailPtr.prev = this.headPtr;
        this.tailPtr.drawNode(context);
        this.numElements = 0;   // Set number of elements to 0

        const promises: Promise<void>[] = [];

        // Fade out the DLL
        while (currNode) {
            // Stop the loop once sentinel tail is reached
            if (currNode === this.tailPtr) {
                break;
            }
            
            const node = currNode;
            currNode = currNode.next;
            // Set each next and prev pointer to null
            node.next = null;
            node.prev = null;

            const promise = new Promise<void>((resolve) => {
                gsap.to(node, {
                    nodeOpacity: 0,
                    pointerOpacity: 0,
                    duration: 1,
                    onUpdate: () => {
                        node.drawNode(context);
                        this.headPtr.drawNode(context);
                        this.tailPtr.drawNode(context);
                    },
                    onComplete: () => resolve()
                });
            });

            promises.push(promise);
        }

        await Promise.all(promises);

        // Move the tail pointer back
        await new Promise<void>((resolve) => {
            gsap.to(this.tailPtr, {
                x: this.headPtr.x + this.nodeWidth * 2,
                duration: 1,
                onUpdate: () => {
                    // Clear the area affected by the movement
                    context.clearRect(this.headPtr.x + this.nodeWidth, this.y - 1, (this.tailPtr.x + this.nodeWidth * 2) - (this.headPtr.x + this.nodeWidth), this.nodeHeight + 2);
                    this.tailPtr.drawNode(context); // Redraw tail node to show its position at current frame
                    this.headPtr.drawNode(context); // Redraw head node to show updated next pointer arrow
                },
                onComplete: () => resolve()
            });
        });
    }   
}