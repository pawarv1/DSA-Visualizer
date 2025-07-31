import gsap, { context, set, timeline } from "gsap";
import { LinkedListNode } from "./SLLNode";
import { LinkedList } from "./SLL";

// Singly linked list, but with a dummy head node, inherits from SLL.tsx
export class DummyNodeSLL extends LinkedList {
    protected headPtr: LinkedListNode
    protected tailPtr: LinkedListNode   // While not all ll use tail pointer, this class will keep track of the tail to make some animations easier
    protected numElements: number;

    constructor(protected x: number, protected y: number, protected nodeWidth: number, protected nodeHeight: number, protected opacity: number = 1) {
        super(x, y, nodeWidth, nodeHeight, opacity);
        this.headPtr = new LinkedListNode(x, y, nodeWidth, nodeHeight, null, opacity, opacity); // Head is set to a dummy node
        this.tailPtr = this.headPtr;    // Set tail to the head when initialized
        this.numElements = 0;
    }

    // Preload the linked list without gsap animating
    loadLinkedList(context: CanvasRenderingContext2D, nodeData: any[]) {
        let currPtr = this.headPtr

        for (let i = 0; i < nodeData.length; i++) {
            const newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, currPtr.y, this.nodeWidth, this.nodeHeight, nodeData[i], this.opacity, this.opacity);
            currPtr.next = newNode;
            currPtr.drawNode(context);
            newNode.drawNode(context);
            currPtr = currPtr.next;
            this.tailPtr = currPtr; // Update tail pointer
            this.numElements++;
        }
    }

    // Draw the sll
    draw(context: CanvasRenderingContext2D) {
        this.headPtr.drawNode(context);
        let currPtr = this.headPtr.next;

        while(currPtr) {
            currPtr.drawNode(context);
            currPtr = currPtr.next;
        }
    }

    // Return the data at the given index
    async getAt(context: CanvasRenderingContext2D, index: number, iterationAnimation: boolean = true) {
        if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr.next;

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
        let currPtr = this.headPtr.next;
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
        let currPtr = this.headPtr.next;
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
        let currPtr = this.headPtr;

        // Show append animations for linked lists whether or not they use a tail pointer
        if (usingTailPointer) {
            currPtr = this.tailPtr;
        }
        // Can choose to show appending with iterations start at the head, as linked lists may not include a tail pointer
        else {
            while (currPtr.next) {
                currPtr = currPtr.next;
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr);
                }
            }
        }
            
        const newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, currPtr.y, this.nodeWidth, this.nodeHeight, newData, 0, 0);
        currPtr.next = newNode;
        currPtr.drawNode(context);
        this.tailPtr = newNode; // update the tail pointer to the new node (regardless of which animation is being used)

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

    // Insert right after dummy head node
    async prepend(context: CanvasRenderingContext2D, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1) {    
        const promises: Promise<void>[] = [];
        let currPtr = this.headPtr.next;
        
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

        // Only dummy head node exists
        if (!this.headPtr.next) {
            // In this particular case, append can be used to simplify the code
            await this.append(context, newData, fadeIntime);
        }
        else {
            const initialY = this.y + this.nodeHeight * 2;    // New nodes will appear below the height of the rest of the linked list, before being moved up
            const newNode = new LinkedListNode(this.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, "black", "white", this.headPtr.next);

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
                        context.clearRect(this.headPtr.x + this.nodeWidth, this.headPtr.y, this.headPtr.next!.x - (this.headPtr.x + this.nodeWidth) - 1, this.nodeHeight);
                        newNode.drawNode(context);
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
                        context.clearRect(0, 0, canvasWidth, canvasHeight);
                        this.draw(context);
                    }
                });
            });

            this.numElements++;
        }
    }

    // Insert at the given index
    async insertAt(context: CanvasRenderingContext2D, index: number, newData: any, canvasWidth: number, canvasHeight: number, fadeIntime: number = 1, iterationAnimation: boolean = true) {

        // Insertions right after the dummy head node
        if (index === 0) {
            await this.prepend(context, newData, canvasWidth, canvasHeight, fadeIntime);
        }
        else if(index < 0 || index > this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr.next;

            for (let i = 0; i < index - 1; i++){
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr!);
                }
                currPtr = currPtr!.next;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr!);
            }

            // Insertions in the middle of the ll
            if (currPtr?.next) {

                let tempPtr: LinkedListNode | null = currPtr.next;  // This pointer will be used to help move nodes following the new node forward
                const initialY = this.y + this.nodeHeight * 2;    // New nodes will appear below the height of the rest of the linked list, before being moved up
                const newNode = new LinkedListNode(currPtr.x + this.nodeWidth * 2, initialY, this.nodeWidth, this.nodeHeight, newData, 0, 0, "black", "white", tempPtr);

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
                    timeline.to(currPtr, {
                        pointerOpacity: 0,
                        duration: fadeIntime,
                        onUpdate: () => {
                            context.clearRect(currPtr.x + this.nodeWidth, currPtr.y, currPtr.next!.x - (currPtr.x + this.nodeWidth) - 1, this.nodeHeight);
                            newNode.drawNode(context);
                            currPtr.drawNode(context);
                        },
                        onComplete: () => {
                            currPtr.next = newNode;
                        }
                    });

                    // Fade in the current nodes next pointer, which now points to the new node
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
                await this.append(context, newData, fadeIntime);
            }
        }

        return true;    // Insertion was successful
    }

    // Remove the first node after the dummy head node, and return its data
    async shift(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1) {
        // No such node to remove
        if (!this.headPtr.next) {
            return;
        }

        const firstRealNode = this.headPtr.next;
        let currPtr = firstRealNode.next;
        firstRealNode.next = null;

        // If the removal of the node only leaves the dummy head, set the tail pointer to the head
        if (!currPtr) {
            this.tailPtr = this.headPtr;
        }

        this.headPtr.next = currPtr;

        // Fade out the removed node
        await new Promise<void>((resolve) => {
            gsap.to(firstRealNode, {
                nodeOpacity: 0,
                pointerOpacity: 0,
                duration: fadeOutTime,
                onUpdate: () => {
                    firstRealNode.drawNode(context);
                    this.headPtr.drawNode(context)
                },
                onComplete: () => {
                    resolve();
                }
            });
        });

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
        return firstRealNode.data;
    }

    // Remove from the end of the ll and return its data
    async pop(context: CanvasRenderingContext2D, fadeOutTime: number = 1, iterationAnimation: boolean = true) {

        let currPtr = this.headPtr;

        while (currPtr.next?.next) {
            currPtr = currPtr.next;
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr);
            }
        }

        const lastNode = currPtr.next;
        currPtr.next = null;
        this.tailPtr = currPtr; // Update the tail pointer
        currPtr.drawNode(context);

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

    // Remove at the given index
    async removeAt(context: CanvasRenderingContext2D, index: number, canvasWidth: number, canvasHeight: number, fadeOutTime: number = 1, iterationAnimation: boolean = true) {
    
        // Deletions right after the dummy head node
        if (index === 0) {
            await this.shift(context, canvasWidth, canvasHeight, fadeOutTime);
        }
        else if (index < 0 || index >= this.numElements) {
            console.error(`Index ${index} is out of bounds`);
            return false;
        }
        else {
            let currPtr = this.headPtr.next!;

            for (let i = 0; i < index - 1; i++) {
                if (iterationAnimation) {
                    await this.highlightNode(context, currPtr);
                }
                currPtr = currPtr.next!;
            }
            if (iterationAnimation) {
                await this.highlightNode(context, currPtr);
            }

            const deleteNode = currPtr.next!;

            // Deletions in the middle of the ll
            if (deleteNode.next) {
                let tempPtr: LinkedListNode | null = deleteNode.next;  // This pointer will be used to move the nodes following the removed node back

                await new Promise<void>((resolve) => {
                    const timeline = gsap.timeline({onComplete: () => resolve()});

                    // Fade out the pointer which pointed from currPtr to deleteNode
                    timeline.to(currPtr, {
                        pointerOpacity: 0,
                        duration: fadeOutTime,
                        onUpdate: () => {
                            currPtr.drawNode(context);
                        }
                    });

                    // Set the currPtr to the node after deleteNode, and deleteNode next pointer to null, then redraw currPtr after the pointer update
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
                            deleteNode.drawNode(context);
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

    // Clear all but the dummy head node
    async clear(context: CanvasRenderingContext2D) {
        let currPtr = this.headPtr.next;
        const promises: Promise<void>[] = [];

        this.tailPtr = this.headPtr;    // Set the tail pointer to the dummy head node
        this.headPtr.next = null;
        this.headPtr.drawNode(context);
        this.numElements = 0;   // Set number of elements to 0

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
    }
}