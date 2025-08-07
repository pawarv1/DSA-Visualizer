import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./SLLNode";


// Singly linked list class
export class LinkedList {
    protected headPtr: LinkedListNode | null;
    protected tailPtr: LinkedListNode | null;   // While not all SLL use tail pointer, this class will keep track of the tail to make some animations easier
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

    // Preload the SLL without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        // Initialize currNode to null, as SLL is empty
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            // Loading in the first node
            if (currNode === null) {
                this.headPtr = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                this.headPtr.drawNode(context);
                currNode = this.headPtr;
            }
            // Loading in the following nodes
            else {
                const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currNode.next = newNode;    // Set currNode next to newNode then redraw
                currNode.drawNode(context);
                newNode.drawNode(context);
                currNode = currNode.next;
            }

            this.tailPtr = currNode;    // Update the tail pointer to the last node
            this.numElements++; // Increment number of elements
        }
    }

    // Draw the SLL
    draw(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;

        while(currNode) {
            currNode.drawNode(context);
            currNode = currNode.next;
        }
    }

    // Return true if the SLL is empty
    isEmpty() {
        return this.numElements === 0;
    }

    // Return the size of the SLL
    getSize() {
        return this.numElements;
    }

    // Method to higlight a specific node for a short duration then set it back to normal afterwards
    // This is usually used to portray traversals, and can be disabled if needed using the iterationAnimation parameter
    async highlightNode(context: CanvasRenderingContext2D, node: LinkedListNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
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
    animateNodeShift(nodes: LinkedListNode[], offsetX: number, duration: number): Promise<void>[] {
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
    async runWithCentralDrawLoop(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, drawFn: (arg0: CanvasRenderingContext2D) => void, animationPromises: Promise<void>[]): Promise<void> {
        let animating = true;

        const drawLoop = () => {
            if (!animating) {
                return;
            }
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            drawFn(context);
        };

        gsap.ticker.add(drawLoop);

        await Promise.all(animationPromises);

        animating = false;
        gsap.ticker.remove(drawLoop);
    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        // Error if the index is not valid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currNode = this.headPtr;

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
        let currNode = this.headPtr;
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

    // Traverse through SLL and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
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

    // Insert at the end of the SLL
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1, usingTailPointer: boolean = true, iterationAnimation: boolean = true) {
        let newNode: LinkedListNode;

        // Empty SLL case
        if (this.headPtr === null) {
            newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;
        }
        else {
            let currNode = this.headPtr;

            // Option to use more efficient tail pointer implementation
            if (usingTailPointer) {
                currNode = this.tailPtr!;
            }
            // Or append as if the SLL has no tail pointer
            else {
                // Highlight nodes to show traversal if iterationAnimation is true
                while (currNode.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.next;
                }
                // Highlight nodes to show traversal if iterationAnimation is true
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }

            newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            currNode.next = newNode;    // Update currNode.next to newNode then redraw
            currNode.drawNode(context);
            this.tailPtr = newNode; // Update the tail pointer to the new node (regardless of which animation is being used)
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

    // Insert to the head of the SLL
    async prepend(context: CanvasRenderingContext2D, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1) {
        const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
        let tempPtr = this.headPtr; // This pointer will be used to help move the SLL forward

        // Add the nodes to movingNodes
        while (tempPtr) {
            movingNodes.push(tempPtr);
            tempPtr = tempPtr.next;
        }

        // Animate the movement of the following nodes
        const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
        await this.runWithCentralDrawLoop(context, canvasWidth, canvasHeight, this.draw.bind(this), animationPromises);

        const newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        newNode.next = this.headPtr;    // Set newNode.next to the head

        // If the SLL was previously empty, tail pointer will also point to the new node 
        if (!this.headPtr) {
            this.tailPtr = newNode;
        }
        this.headPtr = newNode; // Update the head to point to the new node

        // Fade in new node
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
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1, iterationAnimation: boolean = true) {
        // Error if the insertion index is not valid
        if (index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        // Insertions at the head can be taken care of with prepend
        else if (index === 0) {
            await this.prepend(context, newData, canvasWidth, canvasHeight, fadeIntime);
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

            // Insertions in the middle of the SLL
            if (currNode.next) {
                const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new LinkedListNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0);
                newNode.next = currNode.next;
                
                const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
                let tempPtr: LinkedListNode | null = currNode.next;  // This pointer will be used to help move nodes following the new node forward
                
                // Add the nodes to movingNodes
                while (tempPtr) {
                    movingNodes.push(tempPtr);
                    tempPtr = tempPtr.next;
                }

                // Animate the movement of the following nodes
                const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * 2, 1);
                await this.runWithCentralDrawLoop(context, canvasWidth, canvasHeight, this.draw.bind(this), animationPromises);

                // Animate new node creation and pointer change sequence using timeline
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
                            newNode.drawNode(context);  // Redraw newNode to show its position at current frame
                            currNode.drawNode(context); // Redraw currNode so it pointer is drawn to the right location at that frame
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
    async shift(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        // Error if SLL is empty
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot remove first element");
            return null;
        }
        else {
            const firstNode = this.headPtr;
            this.headPtr = firstNode.next;  // Update the head to the node after firstNode next (or null if there isn't one)
            firstNode.next = null;  // Ensure the deleted nodes pointers are set to null as well

            // If head became null, this means that the linked list will be empty after the removal
            // Tail must be set to null as well
            if (!this.headPtr) {
                this.tailPtr = null;
            }

            // Fade out the removed first node
            await new Promise<void>((resolve) => {
                gsap.to(firstNode, {
                    nodeOpacity: 0,
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        firstNode.drawNode(context);
                    },
                    onComplete: () => {
                        resolve();
                    }
                });
            });

            const movingNodes: LinkedListNode[] = [];   // This array is used to store the nodes which will be moving
            let tempPtr = this.headPtr; // This pointer will be used to help move the remaining nodes back
            
            // Add the nodes to movingNodes
            while (tempPtr) {
                movingNodes.push(tempPtr);
                tempPtr = tempPtr.next;
            }

            // Animate the movement of the following nodes
            const animationPromises = this.animateNodeShift(movingNodes, this.nodeWidth * -2, 1);
            await this.runWithCentralDrawLoop(context, canvasWidth, canvasHeight, this.draw.bind(this), animationPromises);

            this.numElements--; // Decrement number of elements
           
            // Return the removed nodes data
            return firstNode.data;
        }
    }

    // Remove from the end of the SLL and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        // Error if linked list is empty
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot pop from it");
            return null;
        }
        else {
            let lastNode;

            // If the linked list becomes empty after this removal, both head and tail pointers should be null
            // This will happen when there is only one node, and that is the one being removed
            if (this.headPtr.next === null) {
                lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                let currNode = this.headPtr;

                // Highlight nodes to show traversal, if iterationAnimation is true
                // Iteration stops right before the last node
                while (currNode.next?.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.next;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }

                lastNode = currNode.next;
                currNode.next = null;   // Set currNode.next to null then redraw
                currNode.drawNode(context);
                this.tailPtr = currNode;    // Update the tail pointer
            }

            // Fade out the removed last node
            await new Promise<void>((resolve) => {
                gsap.to(lastNode, {
                    nodeOpacity : 0,
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        lastNode!.drawNode(context);
                    },
                    onComplete: () => resolve()
                });
            });

            this.numElements--; // Decrement the number of elements

            // Return the removed nodes data
            return lastNode!.data;
        }
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        // Error if index of deletion is invalid
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        // Deletions at the head are taken care of using shift
        else if (index === 0) {
            await this.shift(context, canvasWidth, canvasHeight, fadeOutTime);
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

            // Deletions in the middle of the SLL
            if (deleteNode.next) {
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                // Animate node removal and pointer change sequence using timeline
                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade out the pointer which pointed from currNode to deleteNode
                    timeline.to(currNode, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            currNode.drawNode(context);
                        }
                    });

                    // Set the currNode to tempPtr (the node after deleteNode), then fade currNode pointer back in
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
                await this.runWithCentralDrawLoop(context, canvasWidth, canvasHeight, this.draw.bind(this), animationPromises);
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

    // This should be changed so its not a class method, since its not a necessary operation for an SLL to support
    async reverse(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        if (!this.headPtr || !this.headPtr.next) {
            return;
        }

        let prevNode: LinkedListNode | null = null;
        let currNode: LinkedListNode | null = this.headPtr;

        while (currNode) {
            let nextNode: LinkedListNode | null = currNode.next;
            await this.highlightNode(context, currNode);
            await new Promise<void>((resolve) => {
                const timeline = gsap.timeline({onComplete: () => resolve()});

                timeline.to(currNode, {
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        currNode?.drawNode(context);
                    },
                    onComplete: () => {
                        currNode!.next = prevNode;
                    }
                });
                timeline.to(currNode, {
                    pointerOpacity: 0.25,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        prevNode?.drawNode(context, !(prevNode?.next));
                        currNode?.drawNode(context);
                    }
                });
            });
            prevNode = currNode;
            currNode = nextNode;
        }

        this.tailPtr = this.headPtr;
        this.headPtr = prevNode;

        const animations: Promise<void>[] = [];
        let newX = this.x;
        let tempPtr = this.headPtr;

        while (tempPtr) {
            const targetX = newX;
            animations.push(new Promise<void>((resolve) => {
                gsap.to(tempPtr, {
                    x: targetX,
                    pointerOpacity: 1,
                    duration: 1,
                    onComplete: resolve
                });
            }));

            newX += this.nodeWidth * 2;
            tempPtr = tempPtr.next;
        }

        await this.runWithCentralDrawLoop(context, canvasWidth, canvasHeight, this.draw.bind(this), animations);
    }

    // Clear the SLL and set head and tail to null
    // Also set each next pointer to null
    async clearAll(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;
        const promises: Promise<void>[] = [];

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
        // Set head and tail to null, and number of elements to 0
        this.headPtr = null;
        this.tailPtr = null;
        this.numElements = 0;
    }
}