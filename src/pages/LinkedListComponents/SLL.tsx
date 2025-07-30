import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./LinkedListNode";


// Singly linked list class
export class LinkedList {
    protected headPtr: LinkedListNode | null;
    protected tailPtr: LinkedListNode | null;   // While not all ll use tail pointer, this class will keep track of the tail to make some animations easier
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

    // Preload the linked list without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currPtr = null;

        for (let i = 0; i < nodeData.length; i++) {
            if (currPtr === null) {
                this.headPtr = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                this.headPtr.drawNode(context);
                currPtr = this.headPtr;
            }
            else {
                let newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, currPtr.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
                currPtr.next = newNode;
                currPtr.drawNode(context);
                newNode.drawNode(context);
                currPtr = currPtr.next;
            }

            this.tailPtr = currPtr;
            this.numElements++;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr;

        while(currPtr) {
            currPtr.drawNode(context);
            currPtr = currPtr.next;
        }
    }

    isEmpty() {
        return this.numElements === 0;
    }

    getSize() {
        return this.numElements;
    }

    // Method to higlight a specific node for a short duration then set it back to normal afterwards
    // This is ussually used to portray traversals, and can be disabled if needed using the iterationAnimation parameter
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

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr;

            for (let i = 0; i < index; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr!);
                }
                currPtr = currPtr!.next;
            }

            if (iterationAnimation) {
                await this.highlightNode(context, currPtr!);
            }

            return currPtr!.data;
        }
    }

    // Search through the ll for the given data argument, and return the index where it is found, or if not, -1
    async find(context: CanvasRenderingContext2D, data: any) {
        let currPtr = this.headPtr;
        let index = 0;

        while (currPtr) {
            await this.highlightNode(context, currPtr);
            
            // Data was found
            if (currPtr.data === data) {
                await this.highlightNode(context, currPtr, 1000, "black", "lightgreen");
                return index;
            }

            currPtr = currPtr.next;
            index++;
        }

        // Data was not found
        return -1;
    }

    // Traverse through ll and print the nodes index and data
    async traverse(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr;
        let index = 0;

        while (currPtr) {
            await this.highlightNode(context, currPtr);
            console.log(`[${index}]: ${currPtr.data}`);
            currPtr = currPtr.next;
            index++;
        }
    }

    // Insert at the end of the ll
    async append(context: CanvasRenderingContext2D, newData: any, fadeIntime: number = 1, usingTailPointer: boolean = true, iterationAnimation: boolean = true) {
        let newNode: LinkedListNode;

        // Empty linked list case
        if (this.headPtr === null) {
            newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            this.headPtr = newNode;
            this.tailPtr = newNode;
        }
        else {
            let currPtr = this.headPtr;

            // Show append animations for linked lists whether or not they use a tail pointer
            if (usingTailPointer) {
                if (iterationAnimation) {
                    await this.highlightNode(context, this.tailPtr!);
                }
                currPtr = this.tailPtr!;
            }
            // Can choose to show appending with iterations start at the head, as linked lists may not include a tail pointer
            else {

                // Highlight nodes to show traversal
                while (currPtr.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currPtr);
                    }
                    currPtr = currPtr.next;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr!);
                }
            }

            newNode = new LinkedListNode(currPtr!.x + this.nodeWidth * 2, currPtr!.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
            currPtr.next = newNode;
            currPtr.drawNode(context);
            this.tailPtr = newNode; // update the tail pointer to the new node (regardless of which animation is being used)
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

        this.numElements++;
    }

    // Insert to the head of the ll
    async prepend(context: CanvasRenderingContext2D, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1) {
        
        const promises: Promise<void>[] = [];
        let currPtr = this.headPtr;
        
        // Slide the whole ll forward to make room for the new head
        while (currPtr) {
            const targetX = currPtr.x + this.nodeWidth * 2;

            const promise = new Promise<void>((resolve) => {
                gsap.to(currPtr, {
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
            currPtr = currPtr.next;
        }
        
        await Promise.all(promises);

        let newNode = new LinkedListNode(this.x, this.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        newNode.next = this.headPtr;

        // If the ll was empty, tail pointer will also point to the new node 
        if (!this.headPtr) {
            this.tailPtr = newNode;
        }
        this.headPtr = newNode;

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

        this.numElements++;
    }

    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1, iterationAnimation: boolean = true) {

        // Insertions at the head
        if (index === 0) {
            await this.prepend(context, newData, canvasWidth, canvasHeight, fadeIntime);
        }
        else if(this.headPtr === null || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of insertion
            for (let i = 0; i < index - 1; i++){
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr);
                }
                currPtr = currPtr.next!;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr);
            }

            // Insertions in the middle of the ll
            if (currPtr.next) {

                let tempPtr: LinkedListNode | null = currPtr.next;  // This pointer will be used to help move nodes following the new node forward
                let initialY = this.y + this.nodeHeight * 2;        // New nodes will appear below the height of the rest of the linked list, before being moved up
                let newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, "black", "white", tempPtr);

                const promises: Promise<void>[] = [];

                // Slide the nodes after the insertion index forward to make space for the new node
                while (tempPtr) {
                    const targetX = tempPtr.x + this.nodeWidth * 2;

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

                await new Promise<void>((resolve) => {
                    let timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade in the new node
                    timeline.to(newNode, {
                        nodeOpacity : 1,
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onUpdate: () => {
                            newNode.drawNode(context);
                            currPtr.drawNode(context);
                        }
                    });

                    // Fade out the curr nodes next pointer, than set it to the new node
                    timeline.to(currPtr, {
                        pointerOpacity: 0,
                        duration: fadeIntime,
                        onUpdate: () => {
                            context.clearRect(currPtr.x + this.nodeWidth, currPtr.y, currPtr.next!.x - (currPtr.x + this.nodeWidth) - 1, this.nodeHeight);  // Clear the area between the current node and the new node
                            newNode.drawNode(context);
                            currPtr.drawNode(context);
                        },
                        onComplete: () => {
                            currPtr.next = newNode;
                        }
                    });

                    // Fade in the current node pointer, which now points to the new node
                    timeline.to(currPtr, {
                        pointerOpacity: 1,
                        duration: fadeIntime,
                        onStart: () => {
                            newNode.drawNode(context);
                        },
                        onUpdate: () => {
                            currPtr.drawNode(context);
                        }
                    });

                    // Move the new node to the same height as the other nodes
                    timeline.to(newNode, {
                        y: this.y,
                        duration: fadeIntime,
                        onUpdate: () => {
                            context.clearRect(0, 0, canvasWidth, canvasHeight);
                            this.draw(context);
                        }
                    });
                });

                this.numElements++;
            }
            else {
                // Insertions at the end can use the appending animation, using the tail pointer to prevent another full iteration
                await this.append(context, newData, fadeIntime, true, false);
            }
        }

        return true;    // Insertion was successful
    }

    // Remove the head node, and return its data
    async shift(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot remove first element");
            return null;
        }
        else {
            // firstNode is the old head, which will be removed
            const firstNode = this.headPtr;
            this.headPtr = firstNode.next;
            firstNode.next = null;

            // If the linked list becomes empty after this removal, both head and tail pointers should be null
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

            let currPtr = this.headPtr;
            const promises: Promise<void>[] = [];
            
            // Slide the rest of the linked list back
            while (currPtr) {
                const targetX = currPtr.x - this.nodeWidth * 2;

                const promise = new Promise<void>((resolve) => {
                    gsap.to(currPtr, {
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
                currPtr = currPtr.next;
            }

            await Promise.all(promises);
            
            this.numElements--;

            // Return the removed nodes data
            return firstNode.data;
        }
    }

    // Remove from the end of the ll and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
        if (this.headPtr === null) {
            console.error("Linked List is empty, cannot pop from it");
            return null;
        }
        else {
            let lastNode: LinkedListNode | null;

            // If the linked list becomes empty after this removal, both head and tail pointers should be null
            if (this.headPtr.next === null) {
                lastNode = this.headPtr;
                this.headPtr = null;
                this.tailPtr = null;
            }
            else {
                let currPtr = this.headPtr;

                // Highlight nodes to show traversal
                while (currPtr.next?.next) {
                    if (iterationAnimation) {
                        await this.highlightNode(context, currPtr);
                    }
                    currPtr = currPtr.next;
                }
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr);
                }

                lastNode = currPtr.next;
                currPtr.next = null;
                this.tailPtr = currPtr; // Update the tail pointer
                currPtr.drawNode(context);
            }

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

            this.numElements--;

            // Return the removed nodes data
            return lastNode?.data;
        }
    }

    async removeAt(context: CanvasRenderingContext2D, index: number, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {

        // Deletions at the head
        if (index === 0) {
            await this.shift(context, canvasWidth, canvasHeight, fadeOutTime);
        }
        else if (this.headPtr === null || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr;

            // Highlight nodes to show traversal, stop right before the index of deletion
            for (let i = 0; i < index - 1; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr);
                }
                currPtr = currPtr.next!;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr);
            }

            let deleteNode = currPtr.next!;

            // Deletions in the middle of the ll
            if (deleteNode.next != null) {
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                await new Promise<void>((resolve) => {
                    let timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade out the pointer which pointed from currPtr to deleteNode
                    timeline.to(currPtr, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            currPtr.drawNode(context);
                        }
                    });

                    // Set the currPtr to the node after deleteNode, and deleteNode next pointer to null, then redraw currPtr
                    timeline.to(currPtr, {
                        pointerOpacity: 1,
                        duration: fadeOutTime,
                        onStart: () => {
                            currPtr.next = tempPtr;
                            deleteNode.next = null;
                        },
                        onUpdate: () => {
                            currPtr.drawNode(context);
                        }
                    });

                    // Fade out the deleted node
                    timeline.to(deleteNode, {
                        nodeOpacity : 0,
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            deleteNode?.drawNode(context);
                            currPtr.drawNode(context);
                        }
                    });
                });

                const promises: Promise<void>[] = [];

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
            }
            // Deletions from the end of the ll
            else {
                currPtr.next = null;
                this.tailPtr = currPtr; // Update the tail pointer
                currPtr.drawNode(context);

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

            this.numElements--;
        }

        return true;    // Deletion was successful
    }

    // This should be changed so its not a class method, since its not a necessary operation for an ll to support
    async reverse(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        if (!this.headPtr || !this.headPtr.next) {
            return;
        }

        let prevPtr: LinkedListNode | null = null;
        let currPtr: LinkedListNode | null = this.headPtr;
        let newX = this.x;

        while (currPtr) {
            let nextPtr: LinkedListNode | null = currPtr.next;
            await this.highlightNode(context, currPtr);
            await new Promise<void>((resolve) => {
                let timeline = gsap.timeline({onComplete: () => resolve()});

                timeline.to(currPtr, {
                    pointerOpacity: 0,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        currPtr?.drawNode(context);
                    },
                    onComplete: () => {
                        currPtr!.next = prevPtr;
                    }
                });
                timeline.to(currPtr, {
                    pointerOpacity: 0.25,
                    duration: fadeOutTime,
                    onUpdate: () => {
                        prevPtr?.drawNode(context, !(prevPtr?.next));
                        currPtr?.drawNode(context);
                    }
                });
            });
            prevPtr = currPtr;
            currPtr = nextPtr;
        }

        this.tailPtr = this.headPtr;
        this.headPtr = prevPtr;

        currPtr = this.headPtr;
        const promises: Promise<void>[] = [];

        while (currPtr) {
            const targetX = newX;
            const promise = new Promise<void>((resolve) => {
                let timeline = gsap.timeline({onComplete: () => resolve()});

                timeline.to(currPtr, {
                    x: targetX,
                    duration: 1,
                    onUpdate: () => {
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    },
                });
                timeline.to(currPtr, {
                    pointerOpacity: 1,
                    duration: 0,
                    onUpdate: () => {
                        currPtr?.drawNode(context);
                    },
                });
            });

            promises.push(promise);
            newX += this.nodeWidth * 2;
            currPtr = currPtr.next;
        }

        await Promise.all(promises);
    }

    // Clear the ll and set head and tail to null
    async clear(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr;
        const promises: Promise<void>[] = [];

        // Fade out the ll
        while (currPtr) {
            const node = currPtr;
            currPtr = currPtr.next;

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