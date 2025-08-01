import gsap, { context, set, timeline } from "gsap";
import { DLLNode } from "./DLLNode";

// Doubly linked list class
export class DoublyLinkedList {
    protected headPtr: DLLNode | null;
    protected tailPtr: DLLNode | null;  // While user may choose not to use a tail pointer, the class will use it implicitly to simplify some animations
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
        let currNode = null;

        for (let i = 0; i < nodeData.length; i++) {
            if (currNode === null) {
                this.headPtr = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                this.headPtr.drawNode(context);
                currNode = this.headPtr;
            }
            else {
                const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity, this.opacity);
                currNode.next = newNode;
                newNode.prev = currNode;
                currNode.drawNode(context);
                newNode.drawNode(context);
                currNode = currNode.next;
            }

            this.tailPtr = currNode;
            this.numElements++;
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

    // Return true if the DLL is empty
    isEmpty() {
        return this.numElements === 0;
    }

    // Return the size of the DLL
    getSize() {
        return this.numElements;
    }

    // Method to higlight a specific node for a short duration then set it back to normal afterwards
    // This is ussually used to portray traversals, and can be disabled if needed using the iterationAnimation parameter
    async highlightNode(context: CanvasRenderingContext2D, node: DLLNode, duration: number = 500, outlineColor = "red", fillColor = "yellow") {
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

    // Return true if the DLL has the provided data
    async contains(context: CanvasRenderingContext2D, data: any) {
        const findOutput = await this.find(context, data);
        return findOutput != -1;
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

    // If the DLL uses a tail pointer, traverse backwards from tail to head and print nodes index and data
    async traverseBackward(context: CanvasRenderingContext2D, isUsingTailPointer: boolean = true) {
        // Return early if tail pointer is not being used in the implementation
        if (!isUsingTailPointer) {
            return;
        }
        
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
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1, usingTailPointer: boolean = true, iterationAnimation: boolean = true) {
        let newNode: DLLNode;

        // Empty DLL case
        if (this.headPtr === null) {
            newNode = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;
        }
        else {
            let currNode = this.headPtr;

            // Option to use more efficient tail pointer implementation
            if (usingTailPointer) {
                currNode = this.tailPtr!;
            }
            // Or append as if the DLL has no tail pointer
            else {
                // Highlight nodes to show traversal if iterationAnimation is true
                while (currNode.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currNode);
                    }
                    currNode = currNode.next;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currNode);
                }
            }

            // newNode is initialized with its prev pointer pointing to currNode
            newNode = new DLLNode(currNode.x + this.nodeWidth * 2, currNode.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0, "black", "white", null, currNode);
            currNode.next = newNode;
            currNode.drawNode(context); // Redraw currNode after its pointer is updated
            this.tailPtr = newNode; // Update the tail pointer to the new node (regardless of which animation is being used)
        }

        // Fade in the new node
        await new Promise<void>((resolve) => {
            gsap.to(newNode, {
                nodeOpacity: 1,
                pointerOpacityNext: 1,
                pointerOpacityPrev: 1,
                duration: fadeIntime,
                onUpdate: () => {
                    newNode.drawNode(context);
                },
                onComplete: () => resolve()
            });
        });

        this.numElements++; // Increment number of elements
    }

    // Insert to the head of the DLL
    async prepend(context: CanvasRenderingContext2D, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1) {
            
        const promises: Promise<void>[] = [];
        let currNode = this.headPtr;
        
        // Slide the whole DLL forward to make room for the new head
        while (currNode) {
            const targetX = currNode.x + this.nodeWidth * 2;

            const promise = new Promise<void>((resolve) => {
                gsap.to(currNode, {
                    x: targetX,
                    duration: 1,
                    onUpdate: () => {
                        // Clear the whole canvas, then draw the whole LL
                        // May be inefficient, but otherwise leaves ghost lines on the canvas
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    },
                    onComplete: () => resolve()
                });
            });

            promises.push(promise);
            currNode = currNode.next;
        }
        
        await Promise.all(promises);

        // newNode is initialized with its next pointer pointing to the head
        const newNode = new DLLNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0, "black", "white", this.headPtr);

        // If the DLL was previously empty, tail pointer will also point to the new node 
        if (!this.headPtr) {
            this.tailPtr = newNode;
        }
        else {
            // Set the head node prev to newNode then draw the head node
            this.headPtr.prev = newNode;
            this.headPtr.drawNode(context);
        }
        this.headPtr = newNode; // Update head pointer to the new node

        // Fade in new node
        await new Promise<void>((resolve) => {
            gsap.to(newNode, {
                nodeOpacity: 1,
                pointerOpacityNext: 1,
                pointerOpacityPrev: 1,
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
        if(this.headPtr === null || index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        // Insertions at the head can be taken care of with prepend
        else if (index === 0) {
            await this.prepend(context, newData, canvasWidth, canvasHeight, fadeIntime);
        }
        else {
            let currNode = this.headPtr;

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

            // Insertions in the middle of the DLL
            if (currNode.next) {
                const nextNode = currNode.next;  // Save the next node after the current node using this pointer
                const initialY = this.y + this.nodeHeight * 2;  // New nodes will appear below the height of the rest of the linked list, before being moved up
                // newNode is initialized with its next pointer pointing to nextNode and its prev pointer pointing to currNode
                const newNode = new DLLNode(currNode.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, 0, "black", "white", nextNode, currNode);

                let tempPtr: DLLNode | null = currNode.next; // This pointer will be used to help move nodes following the new node forward
                const promises: Promise<void>[] = [];

                // Slide the nodes after the insertion index forward to make space for the new node
                while (tempPtr) {
                    const targetX = tempPtr.x + this.nodeWidth * 2;

                    const promise = new Promise<void>((resolve) => {
                        gsap.to(tempPtr, {
                            x: targetX,
                            duration: 1,
                            onUpdate: () => {
                                // Clear the whole canvas, then draw the whole LL
                                // May be inefficient, but otherwise leaves ghost lines on the canvas
                                context.clearRect(0, 0, canvasWidth, canvasHeight);
                                this.draw(context);
                            },
                            onComplete: () => resolve()
                        });
                    });

                    promises.push(promise);
                    tempPtr = tempPtr.next;
                }
                
                await Promise.all(promises);

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
                            // Clear the area between the current node and the new node
                            context.clearRect(currNode.x + this.nodeWidth, currNode.y, nextNode.x - (currNode.x + this.nodeWidth) - 1, this.nodeHeight / 2); // Clear the area between the current node and the next node
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
                            context.clearRect(currNode.x + this.nodeWidth + 1, currNode.y + this.nodeHeight / 2, nextNode.x - (currNode.x + this.nodeWidth), this.nodeHeight / 2);  // Clear the area between the current node and the next node
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
                            context.clearRect(0, 0, canvasWidth, canvasHeight);
                            this.draw(context);
                            newNode.drawPointers(context);  // Have to call this method to fix partial arrow clearing bug
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
            if (!this.headPtr) {
                this.tailPtr = null;
            }
            else {
                this.headPtr.prev = null;   // Update head node prev pointer to null then redraw the head
                this.headPtr.drawNode(context);
            }

            // Fade out the removed first node
            await new Promise<void>((resolve) => {
                gsap.to(firstNode, {
                    nodeOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        firstNode.drawNode(context);
                    },
                    onComplete: () => {
                        resolve();
                    }
                });
            });

            let currNode: DLLNode | null = this.headPtr;
            const promises: Promise<void>[] = [];
            
            // Slide the rest of the linked list back
            while (currNode) {
                const targetX = currNode.x - this.nodeWidth * 2;

                const promise = new Promise<void>((resolve) => {
                    gsap.to(currNode, {
                        x: targetX,
                        duration: 1,
                        onUpdate: () => {
                            context.clearRect(0, 0, canvasWidth, canvasHeight);
                            this.draw(context);
                        },
                        onComplete: () => resolve()
                    });
                });

                promises.push(promise);
                currNode = currNode.next;
            }

            await Promise.all(promises);
            this.numElements--; // Decrement the number of elements

            // Return the removed nodes data
            return firstNode.data;
        }
    }

    // Remove from the end of the DLL and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, usingTailPointer: boolean = true, iterationAnimation: boolean = true) {
        // Error if linked list is empty
        if (this.headPtr === null) {
            console.error("DLL is empty, cannot pop from it");
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
            // Option to use more efficient tail pointer implementation
            else if (usingTailPointer) {
                lastNode = this.tailPtr;
                this.tailPtr = this.tailPtr!.prev;
                this.tailPtr!.next = null;
                lastNode!.prev = null;
            }
            // Or pop as if the DLL has no tail pointer
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
                currNode.next = null;   // currNode next now points to null
                lastNode!.prev = null;  // Ensure the deleted nodes prev pointer is also set to null
                this.tailPtr = currNode;    // Update the tail pointer
            }

            // Redraw the new last node if it exists
            this.tailPtr?.drawNode(context);

            // Fade out the removed last node
            await new Promise<void>((resolve) => {
                gsap.to(lastNode, {
                    nodeOpacity : 0,
                    pointerOpacityPrev: 0,
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
    }

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        // Error if index of deletion is invalid
        if (this.headPtr === null || index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            // Pointer for the node that will be deleted
            let deleteNode = this.headPtr;

            // Highlight nodes to show traversal if iterationAnimation is true
            // Stop when the index of deletion is reached
            for (let i = 0; i < index; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, deleteNode);
                }
                deleteNode = deleteNode.next!;
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

            await new Promise<void>((resolve) => {
                const timeline = gsap.timeline({onComplete: () => resolve()});

                if (prevNode) {
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
                }

                if (nextNode) {
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
                }

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
                        prevNode?.drawNode(context);    // Draw prevNode if it is not null, so its pointers arent cleared
                        nextNode?.drawNode(context);    // Draw nextNode if it is not null, so its pointers arent cleared
                    }
                });
            });

            const promises: Promise<void>[] = [];
            let tempPtr: DLLNode | null = nextNode; // This pointer will be used to move the nodes following the removed node back

            // Slide the following nodes back
            while (tempPtr) {
                const targetX = tempPtr.x - this.nodeWidth * 2;

                const promise = new Promise<void>((resolve) => {
                    gsap.to(tempPtr, {
                        x: targetX,
                        duration: 1,
                        onUpdate: () => {
                            context.clearRect(0, 0, canvasWidth, canvasHeight);
                            this.draw(context);
                        },
                        onComplete: () => resolve()
                    });
                });

                promises.push(promise);
                tempPtr = tempPtr.next;
            }
            
            await Promise.all(promises);
            this.numElements--; // Decrement the number of elements

            return true;    // Deletion was successful
        }
    }

    // Clear the DLL and set head and tail to null
    // Also set each next and prev to null
    async clear(context: CanvasRenderingContext2D) {
        let currNode = this.headPtr;
        const promises: Promise<void>[] = [];

        // Fade out the SLL
        while (currNode) {
            const node = currNode;
            currNode = currNode.next;
            node.prev = null;   // Set each prev pointer to null
            node.next = null;   // Set each next pointer to null

            const promise = new Promise<void>((resolve) => {
                gsap.to(node, {
                    nodeOpacity: 0,
                    pointerOpacityNext: 0,
                    pointerOpacityPrev: 0,
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