import { LinkedList } from "./SLL";
import { CircularLLNode } from "./CLLNode";
import gsap, { context, set, timeline } from "gsap";

// Circular linked list class, extends LinkedList
export class CircularLinkedList extends LinkedList {
    protected headPtr: CircularLLNode | null;
    protected tailPtr: CircularLLNode | null;
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }

    // Preload the CLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            // Loading in the first node
            if (!currNode) {
                // headPtr next pointer points to itself by default, as defined in CircularLLNode constructor
                this.headPtr = new CircularLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                this.headPtr.drawNode(context);
                currNode = this.headPtr;
            }
            // Loading in following nodes
            else {
                const newNode = new CircularLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                newNode.next = this.headPtr;    // Set newNode.next to the head node
                currNode.next = newNode;    // Set currNode next pointer to the new node, then redraw
                currNode.drawNode(context);
                newNode.drawNode(context);
                currNode = currNode.next;
            }

            this.tailPtr = currNode;    // Update the tail pointer to the last node
            this.numElements++; // Increment number of elements
        }
    }

    // Draw the CLL
    draw(context: CanvasRenderingContext2D) {
        // Return early if list is empty
        if (!this.headPtr) {
            return;
        }

        let currNode = this.headPtr;
        
        // Use do while loop to traverse CLL
        do {
            currNode.drawNode(context);
            currNode = currNode.next!;
        } while (currNode != this.headPtr);
    }

    // Helper method to extract logic animating the movements of nodes
    protected animateNodeShift(nodes: CircularLLNode[], offsetX: number, duration: number): Promise<void>[] {
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

    // Search through the CLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any, iterationAnimation: boolean = true) {
        // Return early if the list is empty
        if (!this.headPtr) {
            return -1;
        }

        let currNode = this.headPtr;
        let index = 0;

        // Use do while loop to traverse CLL
        do {
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
        } while (currNode != this.headPtr);

        // Data was not found
        return -1;
    }

    // Traverse through CLL and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
        // Return early if the list is empty
        if (!this.headPtr) {
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
        if (!this.headPtr) {
            // newNode next pointer points to itself by default, as defined in CircularLLNode constructor
            newNode = new CircularLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;
        }
        else {
            let currNode = this.tailPtr!;
            newNode = new CircularLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            newNode.next = this.headPtr;    // Set newNode.next to the head node
            currNode.next = newNode;    // Set currNode.next to the new node then redraw
            currNode.drawNode(context);
            this.tailPtr = newNode; // Update the tail pointer to the new node
        }

        // Fade in the new node
        await new Promise<void>((resolve) => {
            gsap.to(newNode, {
                nodeOpacity: 1,
                pointerOpacity: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    newNode.drawNode(context);
                },
                onComplete: () => resolve()
            });
        });

        this.numElements++; // Increment number of elements
    }

    // Insert to the head of the CLL
    async prepend(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1) {

        const newNode = new CircularLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);

        // If the CLL was previously empty, tailPtr will also point to the newNode
        if (!this.headPtr) {
            this.tailPtr = newNode;
        }
        else {
            const movingNodes: CircularLLNode[] = [];   // This array is used to store the nodes which will be moving
            let tempPtr = this.headPtr; // This pointer will be used to help move the CLL forward

            // Add the nodes to movingNodes
            do {
                movingNodes.push(tempPtr);
                tempPtr = tempPtr.next!;
            }
            while (tempPtr != this.headPtr);

            // Animate the movement of the following nodes
            const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
            await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

            newNode.next = this.headPtr;    // Set newNode.next to the head node
            this.tailPtr!.next = newNode;   // Set tail node next to newNode
            this.tailPtr!.drawNode(context);    // Redraw after pointer update
        }

        this.headPtr = newNode; // Update the head to point to the new node

        // Fade in the new node
        await new Promise<void>((resolve) => {
            gsap.to(newNode, {
                nodeOpacity: 1,
                pointerOpacity: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    newNode.drawNode(context);
                },
                onComplete: () => resolve()
            });
        });

        this.numElements++; // Increment the number of elements
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1, iterationAnimation: boolean = true) {
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

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);

                // Animate the node creation and pointer change sequence using timeline
                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade in the new node
                    timeline.to(newNode, {
                        nodeOpacity : 1,
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onUpdate: () => {
                            newNode.drawNode(context);
                        }
                    });

                    // Fade out curr nodes next pointer, than set it to the new node
                    timeline.to(currNode, {
                        pointerOpacity: 0,
                        duration: fadeIntime,
                        onUpdate: () => {
                            // Clear the area between the current node and the following node
                            context.clearRect(currNode.x + this.nodeWidth, currNode.y, this.nodeWidth * 3 - 1, this.nodeHeight);
                            newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above statement
                            currNode.drawNode(context);
                        },
                        onComplete: () => {
                            currNode.next = newNode;
                        }
                    });

                    // Fade in current nodes next pointer, which now points to the new node
                    timeline.to(currNode, {
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onStart: () => {
                            // Redraw nextNode to regain some of the arrow cleared in previous code.
                            // The area in question may be insignificant enough to remove this part
                            newNode.drawNode(context);
                        },
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Move the new node to the same height as the other nodes
                    timeline.to(newNode, {
                        y: this.y,
                        duration: fadeIntime,
                        onUpdate: () => {
                            // Clear the area affected by the movement
                            context.clearRect(currNode.x + this.nodeWidth, this.y, this.nodeWidth * 3 - 1, this.nodeHeight * 4);
                            this.tailPtr!.drawNode(context);    // Redraw tail node so part of its next pointer does not get cleared
                            newNode.drawNode(context, false);   // Redraw newNode to show its position at current frame
                            currNode.drawNode(context); // Redraw currNode to show updated next pointer position
                        }
                    });
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

    // Remove the head node, and return its data
    async shift(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // Error if CLL is empty
        if (!this.headPtr) {
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

            // Animate the node removal and pointer change sequence using timeline
            await new Promise<void>((resolve) => {
                const timeline = gsap.timeline({onComplete: () => resolve()});

                // This branch should execute as long as there is at least one node remaining after the deletion, otherwise tail would be null
                if (this.tailPtr) {
                    // Fade out the tail node next pointer than set it to the new head
                    timeline.to(this.tailPtr, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            this.tailPtr!.drawNode(context);
                        },
                        onComplete: () => {
                            this.tailPtr!.next = this.headPtr;
                        }
                    });

                    // Fade the tail node next pointer back in
                    timeline.to(this.tailPtr, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            this.tailPtr!.drawNode(context);
                        }
                    });
                }

                // Fade out the first node next pointer
                timeline.to(firstNode, {
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        firstNode.drawNode(context);
                        this.tailPtr?.drawNode(context);    // Draw the tail node if it exists so part of its pointer does not get cut off
                    }
                });

                // Fade out the first node, after setting its next pointer to null
                timeline.to(firstNode, {
                    nodeOpacity: 0,
                    duration: fadeOutTime,
                    onStart: () => {
                        firstNode.next = null;
                    },
                    onUpdate: () => {
                        firstNode.drawNode(context, false);
                    }
                });
            });

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
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
            }

            this.numElements--; // Decrement number of elements
           
            // Return the removed nodes data
            return firstNode.data;
        }
    }

    // Remove from the end of the CLL and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
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

                // Highlight nodes to show traversal, if iterationAnimation is true
                // Iteration stops right before the last node
                while (currNode.next != this.tailPtr) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.next!;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }

                lastNode = currNode.next!;
                this.tailPtr = currNode;    // Update the tail pointer
            }

            // Animate the node removal and pointer change sequence using timeline
            await new Promise<void>((resolve) => {
                const timeline = gsap.timeline({onComplete: () => resolve()});

                // This branch should execute as long as there is at least one node remaining after the deletion, otherwise tail would be null
                if (this.tailPtr) {
                    // Fade out the tail node next pointer than set it to the head
                    timeline.to(this.tailPtr, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            this.tailPtr!.drawNode(context);
                        },
                        onComplete: () => {
                            this.tailPtr!.next = this.headPtr;
                        }
                    });

                    // Fade the tail node next pointer back in
                    timeline.to(this.tailPtr, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            this.tailPtr!.drawNode(context);
                        }
                    });
                }
                
                // Fade out the last node next pointer arrow
                timeline.to(lastNode, {
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        lastNode.drawNode(context);
                        this.tailPtr!.drawNode(context);
                    }
                });

                // Fade out the last node after setting its next pointer to null
                timeline.to(lastNode, {
                    nodeOpacity: 0,
                    duration: fadeOutTime,
                    onStart: () => {
                        lastNode.next = null;
                    },
                    onUpdate: () => {
                        lastNode.drawNode(context, false);
                    }
                });
            });

            this.numElements--; // Decrement the number of elements

            // Return the removed nodes data
            return lastNode.data;
        }
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
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

            // Highlight nodes to show traversal if iterationAnimation is true, stop right before the index of deletion
            for (let i = 0; i < index - 1; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
                currNode = currNode.next!;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currNode);
            }

            const deleteNode = currNode.next!;

            // Deletions in the middle of the CLL
            if (deleteNode.next != this.headPtr) {
                let tempPtr = deleteNode.next!;  // This pointer will be used to move the nodes following the removed node back

                // Animate node removal and pointer change sequence using timeline
                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade out currNode next pointer
                    timeline.to(currNode, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Set the currNode next pointer to tempPtr (the node after deleteNode) then fade it back in
                    timeline.to(currNode, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onStart: () => {
                            currNode.next = tempPtr;
                        },
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Fade out the deleted node, after setting its next pointer to null
                    timeline.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onStart: () => {
                            deleteNode.next = null;
                        },
                        onUpdate: () => {
                            deleteNode.drawNode(context);
                            currNode.drawNode(context); // Redraw currNode, as part of its next pointer arrow would otherwise be cleared by the fade out
                        }
                    });
                });

                const movingNodes: CircularLLNode[] = [];   // This array is used to store the nodes which will be moving

                // Add the nodes to movingNodes
                while (tempPtr != this.headPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
                }

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
            }
            // Deletions from the end of the CLL
            else {
                this.tailPtr = currNode;    // Update the tail pointer

                // Animate the node removal and pointer change sequence using timeline
                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade out the tail node next pointer than set it to the head
                    timeline.to(this.tailPtr, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            this.tailPtr!.drawNode(context);
                        },
                        onComplete: () => {
                            this.tailPtr!.next = this.headPtr;
                        }
                    });

                    // Fade the tail node next pointer back in
                    timeline.to(this.tailPtr, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            this.tailPtr!.drawNode(context);
                        }
                    });

                    // Fade out deleteNode next pointer arrow
                    timeline.to(deleteNode, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode.drawNode(context);
                            this.tailPtr!.drawNode(context);
                        }
                    });

                    // Fade out deleteNode node after setting its next pointer to null
                    timeline.to(deleteNode, {
                        nodeOpacity: 0,
                        duration: fadeOutTime,
                        onStart: () => {
                            deleteNode.next = null;
                        },
                        onUpdate: () => {
                            deleteNode.drawNode(context, false);
                        }
                    });
                });
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Deletes based on the element value, as opposed to index like removeAt
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        if (this.headPtr === null) {
            return false;
        }
        else if (this.headPtr.data === data) {
            await this.highlightNode(context, this.headPtr);
            await this.highlightNode(context, this.headPtr, 500, "black", "lightgreen");
            await this.shift(context, fadeOutTime);
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal if iterationAnimation is true, stop right before the index of deletion
            while(currNode.next != this.headPtr) {
                if (currNode.next!.data === data) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    await this.highlightNode(context, currNode.next!);
                    await this.highlightNode(context, currNode.next!, 500, "black", "lightgreen");
                    break;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
                currNode = currNode.next!;

            }

            // Data was not found
            if (currNode.next === this.headPtr) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
                return false;
            }

            const deleteNode = currNode.next!;

            // Deletions in the middle of the CLL
            if (deleteNode.next != this.headPtr) {
                let tempPtr = deleteNode.next!;  // This pointer will be used to move the nodes following the removed node back

                // Animate node removal and pointer change sequence using timeline
                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade out currNode next pointer
                    timeline.to(currNode, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Set the currNode next pointer to tempPtr (the node after deleteNode) then fade it back in
                    timeline.to(currNode, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onStart: () => {
                            currNode.next = tempPtr;
                        },
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Fade out the deleted node, after setting its next pointer to null
                    timeline.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onStart: () => {
                            deleteNode.next = null;
                        },
                        onUpdate: () => {
                            deleteNode.drawNode(context);
                            currNode.drawNode(context); // Redraw currNode, as part of its next pointer arrow would otherwise be cleared by the fade out
                        }
                    });
                });

                const movingNodes: CircularLLNode[] = [];   // This array is used to store the nodes which will be moving

                // Add the nodes to movingNodes
                while (tempPtr != this.headPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next!;
                }

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
                await this.runWithCentralDrawLoop(context, this.draw.bind(this), animationPromises);
            }
            // Deletions from the end of the CLL
            else {
                this.tailPtr = currNode;    // Update the tail pointer

                // Animate the node removal and pointer change sequence using timeline
                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade out the tail node next pointer than set it to the head
                    timeline.to(this.tailPtr, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            this.tailPtr!.drawNode(context);
                        },
                        onComplete: () => {
                            this.tailPtr!.next = this.headPtr;
                        }
                    });

                    // Fade the tail node next pointer back in
                    timeline.to(this.tailPtr, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            this.tailPtr!.drawNode(context);
                        }
                    });

                    // Fade out deleteNode next pointer arrow
                    timeline.to(deleteNode, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode.drawNode(context);
                            this.tailPtr!.drawNode(context);
                        }
                    });

                    // Fade out deleteNode node after setting its next pointer to null
                    timeline.to(deleteNode, {
                        nodeOpacity: 0,
                        duration: fadeOutTime,
                        onStart: () => {
                            deleteNode.next = null;
                        },
                        onUpdate: () => {
                            deleteNode.drawNode(context, false);
                        }
                    });
                });
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Clear the CLL and set head and tail to null
    // Also set each next pointer to null
    async clearAll(context: CanvasRenderingContext2D) {
        // Return early if the list is empty
        if (!this.headPtr) {
            return;
        }

        let currNode = this.headPtr;
        const promises: Promise<void>[] = [];

        // Fade out the CLL
        do {
            const node = currNode;
            currNode = currNode.next!;
            node.next = null;

            const promise = new Promise<void>((resolve) => {
                gsap.to(node, {
                    nodeOpacity: 0,
                    pointerOpacity: 0,
                    duration: 1,
                    onUpdate: () => {
                        node.drawNode(context);
                    },
                    onComplete: resolve
                });
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
