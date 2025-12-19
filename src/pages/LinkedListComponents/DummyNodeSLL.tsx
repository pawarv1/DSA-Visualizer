import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./SLLNode";
import { LinkedList } from "./SLL";

// Singly linked list, but with a dummy head node, inherits from regular Linked List
export class DummyNodeSLL extends LinkedList {
    protected headPtr: LinkedListNode
    protected tailPtr: LinkedListNode   // While not all SLL use tail pointer, this class will keep track of the tail to make some animations easier
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
    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        // Error if the index is not valid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            // Traversal starts at the node after head
            let currNode = this.headPtr.next;

            // Highlight nodes to show traversal if iterationAnimation is true
            for (let i = 0; i < index; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode!);
                }
                currNode = currNode!.next;
            }

            if (iterationAnimation) {
                await this.highlightNode(context, currNode!);
            }

            return currNode!.data;
        }
    }

    // Search through the SLL for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any, iterationAnimation: boolean = true) {
        // Traversal starts at the node after head
        let currNode = this.headPtr.next;
        let index = 0;

        while (currNode) {
            // Highlight nodes to show traversal if iterationAnimation is true
            if (iterationAnimation) {
                await this.highlightNode(context, currNode);
            }
            
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
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1, usingTailPointer: boolean = true, iterationAnimation: boolean = true) {
        let currNode = this.headPtr;

        // Option to use more efficient tail pointer implementation
        if (usingTailPointer) {
            currNode = this.tailPtr;
        }
        // Or append as if the SLL has no tail pointer
        else {
            // Highlight nodes to show traversal if iterationAnimation is true
            while (currNode.next) {
                currNode = currNode.next;
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }
        }
            
        const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        currNode.next = newNode;    // Set currNode.next to newNode then redraw
        currNode.drawNode(context);
        this.tailPtr = newNode; // Update the tail pointer to the new node (regardless of which animation is being used)

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
        if (!this.headPtr.next) {
            // In this particular case, append can be used to simplify the code
            await this.append(context, newData, fadeIntime);
        }
        else {
            const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up

            const newNode = new LinkedListNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            newNode.next = this.headPtr.next;   // set newNode.next to the node after the head

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

                // Fade out the head nodes next pointer, than set it to the new node
                timeline.to(this.headPtr, {
                    pointerOpacity: 0,
                    duration: fadeIntime,
                    onUpdate: () => {
                        // Clear the area between the head node and the following node
                        context.clearRect(this.headPtr.x + this.nodeWidth, this.headPtr.y, this.nodeWidth * 3 - 1, this.nodeHeight);
                        newNode.drawNode(context);  // Redraw newNode as some of its next pointer arrow gets cleared by the above statement
                        this.headPtr.drawNode(context);
                    },
                    onComplete: () => {
                        this.headPtr.next = newNode;
                    }
                });

                // Fade in the head nodes next pointer, which now points to the new node
                timeline.to(this.headPtr, {
                    pointerOpacity: 1,
                    duration: fadeIntime,
                    onStart: () => {
                        // Redraw nextNode pointer to regain some of the arrow cleared in previous code.
                        // The area in question may be insignificant enough to remove this part
                        newNode.drawNode(context);
                    },
                    onUpdate: () => {
                        this.headPtr.drawNode(context);
                    }
                });

                // Move the new node to the same height as the other nodes
                timeline.to(newNode, {
                    y: this.y,
                    duration: fadeIntime,
                    onUpdate: () => {
                        // Clear the area affected by the movement
                        context.clearRect(this.headPtr.x + this.nodeWidth, this.y, this.nodeWidth * 3 - 1, this.nodeHeight * 4);
                        newNode.drawNode(context);  // Redraw newNode to show its position at current frame
                        this.headPtr.drawNode(context); // Redraw head node to show updated next pointer position
                    }
                });
            });

            this.numElements++; // Increment the number or elements
        }
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, fadeIntime: number = 1, iterationAnimation: boolean = true) {
        // Error if the insertion index is not valid
        if (index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal if iterationAnimation is true, stop right before the index of deletion
            for (let i = -1; i < index - 1; i++) {
                currNode = currNode.next!;
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }

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

                // Animate the new node creation and pointer change sequence using timeline
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

                    // Fade out the curr nodes next pointer, than set it to the new node
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

                    // Fade in the current nodes next pointer, which now points to the new node
                    timeline.to(currNode, {
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onStart: () => {
                            // Redraw nextNode pointer to regain some of the arrow cleared in previous code.
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
                            newNode.drawNode(context);  // Redraw newNode to show its position at current frame
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

    // Remove the first node after the dummy head node, and return its data
    async shift(context: CanvasRenderingContext2D, fadeOutTime: number = 1) {
        // No such node to remove, return early
        if (!this.headPtr.next) {
            return;
        }

        const firstRealNode = this.headPtr.next;
        let tempPtr = firstRealNode.next;  // Set tempPtr to the node after firstRealNode if it exists
        firstRealNode.next = null;  // Ensure the deleted nodes next pointer is set to null as well

        // If the removal of the node only leaves the dummy head, set the tail pointer to the head
        if (!tempPtr) {
            this.tailPtr = this.headPtr;
        }

        // Animate node removal and pointer change sequence using timeline
        await new Promise<void>((resolve) => {
            const timeline = gsap.timeline({onComplete: () => resolve()});

            // Fade out the head node next pointer, then set it to tempPtr (the node after firstRealNode)
            timeline.to(this.headPtr, {
                pointerOpacity: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    this.headPtr.drawNode(context);
                },
                onComplete: () => {
                    this.headPtr.next = tempPtr;
                },
            });

            // Fade the head node next pointer back in
            timeline.to(this.headPtr, {
                pointerOpacity: 1,
                duration: fadeOutTime,
                onUpdate: () => {
                    this.headPtr.drawNode(context);
                }
            });

            // Fade out firstRealNode
            timeline.to(firstRealNode, {
                nodeOpacity: 0,
                pointerOpacity: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    firstRealNode.drawNode(context);
                    // Draw the head node so its next pointer does not get cleared by the fade out
                    this.headPtr.drawNode(context);
                }
            });
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
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {

        let currNode = this.headPtr;

        // Highlight nodes to show traversal, if iterationAnimation is true
        // Iteration stops right before the last node
        while (currNode.next?.next) {
            currNode = currNode.next;
            if (iterationAnimation) {
                await this.highlightNode(context, currNode);
            }
        }

        const lastNode = currNode.next;
        currNode.next = null;   // Set currNode.next to null then redraw
        currNode.drawNode(context);
        this.tailPtr = currNode;    // Update the tail pointer

        // Fade out the removed last node
        await new Promise<void>((resolve) => {
            gsap.to(lastNode, {
                nodeOpacity : 0,
                pointerOpacity: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    lastNode?.drawNode(context);
                },
                onComplete: () => resolve()
            });
        });

        this.numElements--; // Decrement the number of elements

        // Return the removed nodes data
        return lastNode?.data;
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        // Error if index of deletion is invalid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal if iterationAnimation is true, stop right before the index of deletion
            for (let i = -1; i < index - 1; i++) {
                currNode = currNode.next!;
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }

            const deleteNode = currNode.next!;

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                // Animate the node removal and pointer change sequence with timeline
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
                
                // Fade out the deleted node
                await new Promise<void>((resolve) => {
                    gsap.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode.drawNode(context);
                        },
                        onComplete: () => resolve()
                    });
                });
            }

            this.numElements--; // Decrement the number of elements
        }

        return true;    // Deletion was successful
    }

    // Deletes based on the element value, as opposed to index like removeAt
    async delete(context: CanvasRenderingContext2D, data: any, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        if (this.headPtr.next === null) {
            return false;
        }
        else {
            let currNode = this.headPtr;

            // Highlight nodes to show traversal if iterationAnimation is true, stop right before the index of deletion
            while(currNode.next != null) {
                if (currNode.next.data === data) {
                    await this.highlightNode(context, currNode.next);
                    await this.highlightNode(context, currNode.next, 500, "black", "lightgreen");
                    break;
                }
                currNode = currNode.next;

                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }

            if (currNode.next === null) {
                return false;
            }

            const deleteNode = currNode.next;

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                // Animate the node removal and pointer change sequence with timeline
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
                
                // Fade out the deleted node
                await new Promise<void>((resolve) => {
                    gsap.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode.drawNode(context);
                        },
                        onComplete: () => resolve()
                    });
                });
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

            const promise = new Promise<void>((resolve) => {
                gsap.to(node, {
                    nodeOpacity: 0,
                    pointerOpacity: 0,
                    duration: 1,
                    onUpdate: () => {
                        node.drawNode(context);
                    },
                    onComplete: () => resolve()
                });
            });

            promises.push(promise);
        }
        await Promise.all(promises);
    }
}